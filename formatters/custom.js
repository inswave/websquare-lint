/**
 * @fileoverview Stylish reporter
 * @author Sindre Sorhus
 */
"use strict";

var chalk = require("chalk"),
    fs = require('fs'),
    Iconv       = require('iconv').Iconv,
    utf82euckr  = new Iconv( 'UTF-8', 'EUC-KR'),
    euckr2utf8  = new Iconv( 'EUC-KR', 'UTF-8'),
    crypto = require('crypto'),
    table = require("text-table"),
    util = require("util"),
    mkdirp = require('mkdirp');

var normalizelf = function(str) {
//  return str.replace(/\r\n|\n/g, '\n');
  return str.replace(/\r\n|\n/g, linefeed);
};

var separator = process.platform === 'win32' ? '\\' : '/';
var linefeed = process.platform === 'win32' ? '\r\n' : '\n';
var leftTrimRegExp =  new RegExp("^\\s\\s*");
var rightTrimRegExp = new RegExp("\\s\\s*$");

var leftRelativePathRegExp =  new RegExp("^[.]+[./\]*");

var removeRelativePath = function(str) {
    return str.replace(leftRelativePathRegExp, separator);
}

var trim = function(str) {
        return str.replace(leftTrimRegExp, '').replace(rightTrimRegExp, '');
}
var pad = function(msg,length) {
    while (msg.length < length) {
      msg = '0' + msg;
    }
    return msg;
}

var readExcludeList = function(path, excludeObj) {
	try {
		var excludeListStr = fs.readFileSync(path);
	} catch(e) {}
	try {
		excludeListStr = euckr2utf8.convert(excludeListStr).toString('UTF-8');
	} catch(e) {
		excludeListStr = excludeListStr + "";
	}
	excludeListStr = normalizelf(excludeListStr);
	var excludeList = excludeListStr.split(linefeed);
	for(var i = 0; i < excludeList.length; i++) {
		var idx = excludeList[i].indexOf(" ")
		if( idx == 32) {
		    excludeObj[excludeList[i].substring(0,idx)] = excludeList[i].substring(idx+1);
		}
	}
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results) {

    var output = "\n",
    	i = 0,
        total = 0,
        subtotal = 0,
        fileTotal = 0,
        excludeTotal = 0,
        basePathIdx = 0,
        sourceModified = false,
        summaryColor = "yellow",
        summary = {},
        generatedExcludeList = {},
        generatedExcludeListFlag = {},
        generatedKey = '',
        shasum = null,
        hashCode = "",
        lintHomePath = "",
        basePath="",
        relativeFilePath = "",
        sourceCode1 = "",
        sourceCode2 = "",
        sourceCode3 = "",
        excludeListStr = "",
        excludeList = [],
        excludeObj={};

//    console.log( "results " + util.inspect(results) );
//    console.log("DIRNAME : " + __dirname);

    try {
        var idx = __dirname.lastIndexOf(separator);
        if(idx > 0 ) {
            lintHomePath = __dirname.substring(0,idx);
//            console.log("lintHomePath >>>>>>> " + lintHomePath + separator + "excludeList.txt");
            basePathIdx = __dirname.lastIndexOf(separator, idx - 1);
            basePath = __dirname.substring(0,basePathIdx);
//            console.log("basePath >>>>>>> " + basePath);
//            readExcludeList(lintHomePath + separator + "conf/excludeList", excludeObj);
//            excludeListStr = fs.readFileSync(lintHomePath + separator + "conf/excludeList");
//            console.log(lintHomePath + separator + "excludeList");
            var files = fs.readdirSync(lintHomePath + separator + "excludeList");
    		files.forEach(function(result) {
//    			console.log("ExcludeList : " + lintHomePath + separator + "excludeList" + separator + result);
    			readExcludeList(lintHomePath + separator + "excludeList" + separator + result, excludeObj);
    		});
        }
    } catch(e) {}
/*    try {
        excludeListStr = euckr2utf8.convert(excludeListStr).toString('UTF-8');
    } catch(e) {
        excludeListStr = excludeListStr + "";
    }
    excludeListStr = normalizelf(excludeListStr);
    excludeList = excludeListStr.split(linefeed);
    for(var i = 0; i < excludeList.length; i++) {
        idx = excludeList[i].indexOf(" ")
        if( idx > 0) {
            excludeObj[excludeList[i].substring(0,idx)] = excludeList[i].substring(idx+1);
        }
    }
*/
//    console.log(util.inspect(excludeObj));

    results.forEach(function(result) {
//        console.log( "result " + util.inspect(result) );

        var sourceStr = fs.readFileSync( result.filePath );

        relativeFilePath = removeRelativePath(result.filePath);
        if(relativeFilePath.indexOf(basePath) == 0) {
        	relativeFilePath = relativeFilePath.substring(basePathIdx);
        }
//        console.log(relativeFilePath);

        try {
            sourceStr = euckr2utf8.convert(sourceStr).toString('UTF-8');
        } catch(e) {
            sourceStr = sourceStr + "";
        }

        sourceStr = normalizelf(sourceStr);
        var sourceArr = sourceStr.split(linefeed);
        var sourceArr_orig = [];

        //console.log(util.inspect(sourceArr));

        var messages = result.messages;

        if (messages.length === 0) {
            return;
        }

//        total += messages.length;

        subtotal = 0;

        var arr = table(
            messages.map(function(message) {
                var messageType,messageTypeStr;
//                console.log( "message " + util.inspect(message) );
                if (message.fatal || message.severity === 2) {
                    messageType = chalk.red("error");
                    messageTypeStr = "error";
                    summaryColor = "red";
                } else {
                    messageType = chalk.yellow("warning");
                    messageTypeStr = "warning";
                }


                if( sourceArr && sourceArr[message.line-1] ) {
                    if( message.line-2 >= 0 ) {
                    	if(sourceArr_orig[message.line-2]) {
                            sourceCode1 = trim(sourceArr_orig[message.line-2]);
                    	} else {
                            sourceCode1 = trim(sourceArr[message.line-2]);
                    	}
                    } else {
                        sourceCode1 = "";
                    }
                    sourceCode2 = trim(sourceArr[message.line-1]);

                    if( message.line < sourceArr.length ) {
                        sourceCode3 = trim(sourceArr[message.line]);
                    } else {
                        sourceCode3 = "";
                    }

                    if( message.ruleId === "semi" ) {
                    	sourceArr_orig[message.line-1] = sourceArr[message.line-1];
                        sourceArr[message.line-1] = sourceArr[message.line-1].substring(0, message.column) + ";" + sourceArr[message.line-1].substring(message.column);
                        sourceModified = true;
                    }

                } else {
                    sourceCode1 = "";
                    sourceCode2 = "";
                    sourceCode3 = "";
                }
                shasum = crypto.createHash('md5');
                shasum.update(message.message + "\n" + message.ruleId + "\n" + relativeFilePath + "\n" + parseInt(message.line / 20) + "\n" + sourceCode1 + "\n" + sourceCode2 + "\n" + sourceCode3);
                hashCode = shasum.digest('hex');
                generatedKey = message.ruleId || 'excludeList';
                if( !generatedExcludeList[generatedKey] ) {
                	generatedExcludeList[generatedKey] = []; 
                }
                if( !generatedExcludeListFlag[generatedKey + "_" + relativeFilePath] ) {
                	generatedExcludeListFlag[generatedKey + "_" + relativeFilePath] = true;
                	if(generatedExcludeList[generatedKey].length > 0 ) {
                    	generatedExcludeList[generatedKey].push([]);
                		                	}
                	generatedExcludeList[generatedKey].push([relativeFilePath]);
                }
//            	generatedExcludeList[generatedKey].push(hashCode + " " + (message.line || 0) + ":" + (message.column || 0) + "\t" + messageTypeStr + "\t" + message.message.replace(/\.$/, "") + "\t" + (message.ruleId || "")  + "\t" + sourceCode2);

                generatedExcludeList[generatedKey].push([
	                 hashCode,
	                 (message.line || 0) + ":" + (message.column || 0),
	                 messageTypeStr,
	                 message.message.replace(/\.$/, ""),
	                 message.ruleId || "",
	                 sourceCode2
	             ]);

                if( excludeObj[hashCode] ) {
//                    console.info("exclude : " + hashCode + " " + excludeObj[hashCode]);
                    excludeTotal++;
                    return [];
                } else {
//                	console.log(typeof message.ruleId);
                    subtotal++;
                    total++;
                    if( summary[message.ruleId] ) {
                        summary[message.ruleId]++;
                    } else {
                        summary[message.ruleId] = 1;
                    }
                }

                return [
                    hashCode,
                    "",
                    message.line || 0,
                    message.column || 0,
                    messageType,
                    message.message.replace(/\.$/, ""),
                    chalk.gray(message.ruleId || ""),
                    sourceCode2
                ];
            }),
            {
                align: ["", "", "r", "l"],
                stringLength: function(str) {
                    return chalk.stripColor(str).length;
                }
            }
        ).split("\n").map(function(el) {
            return el.replace(/([a-z0-9]+\s+)(\d+)\s+(\d+)/, function(m, p1, p2, p3) {
                return p1 + chalk.gray(p2 + ":" + p3);
            });
        });

        if(subtotal > 0) {
            fileTotal++;
            output += chalk.underline(relativeFilePath) + "\n";
            for(var i = 0 ; i < arr.length ; i++) {
                if( arr[i] ) output += arr[i] + "\n";
            }
            output += "\n";

            if( sourceModified ) {
                var modifiedSourceFile = lintHomePath + separator + "modified" + separator + relativeFilePath;

                console.info("result.filePath : " + result.filePath);
                console.info("modifiedSourceFile : " + modifiedSourceFile);
                var pathIdx = modifiedSourceFile.lastIndexOf(separator)
                mkdirp.sync( modifiedSourceFile.substring(0, pathIdx) );

                fs.writeFileSync(modifiedSourceFile, sourceArr.join("\n"));

            }
        }
    });

    if (total > 0) {
        output += chalk[summaryColor].bold("\u2716 " + fileTotal + " file" + (fileTotal === 1 ? ", " : "s, ") + total + " problem" + (total === 1 ? ", " : "s, ") + excludeTotal + " ignored problem" + (excludeTotal === 1 ? "" : "s") + "\n\n");
        var arr = [];
        var arr1 = [];
        i = 0;
        for( var prop in summary ) {
            arr[i] = ["", chalk.bold(prop), summary[prop], "problem" + (summary[prop] === 1 ? "" : "s")];
            arr1[i++] = ["", chalk.bold("'"+prop+"'"), ":0, //",summary[prop], "problem" + (summary[prop] === 1 ? "" : "s")];
        }

        arr.sort(function (a, b) {
          if (a[2] > b[2]) {
            return -1;
          }
          if (a[2] < b[2]) {
            return 1;
          }
          // a must be equal to b
          return 0;
        });


        arr1.sort(function (a, b) {
          if (a[3] > b[3]) {
            return -1;
          }
          if (a[3] < b[3]) {
            return 1;
          }
          // a must be equal to b
          return 0;
        });


//        output += table( arr , { align: [ 'l', 'l', 'r', 'l' ] }) + "\n\n";
        output += table( arr1 , { align: [ 'l', 'l', 'l', 'r', 'l' ] }) + "\n";
    }

    mkdirp.sync(lintHomePath + separator + "excludeList_generated");
    var files = fs.readdirSync(lintHomePath + separator + "excludeList_generated");

//    files.forEach(function(result) {
//    	fs.unlinkSync(lintHomePath + separator + "excludeList_generated" + separator + result)
//		console.log("cleaned : " + lintHomePath + separator + "excludeList_generated" + separator + result);
//	});

    for( var result in generatedExcludeList) {
        var generatedExcludeListPath = lintHomePath + separator + "excludeList_generated" + separator + result;
//        console.info("generatedExcludeListPath : " + generatedExcludeListPath);
        var pathIdx = generatedExcludeListPath.lastIndexOf(separator)

        
        fs.appendFileSync(generatedExcludeListPath, table( generatedExcludeList[result] , { align: [ 'l', 'l', 'l','l', 'l', 'l' ] }));
//        fs.writeFileSync(generatedExcludeListPath, generatedExcludeList[result].join("\n"));
    }
    return total > 0 ? output : "";
};
