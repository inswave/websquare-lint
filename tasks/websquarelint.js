/*
 * websquare-min
 * https://github.com/inswave/websquare-min
 *
 * Copyright (c) 2013 inswave
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
    'use strict';

    var path = require('path');
    var hooker = require('hooker');
	var eslint = require('eslint');
//    var jshint = require('jshint').JSHINT;
//    var jshintcli = require('jshint/src/cli');
    var pd          = require('pretty-data').pd,
        maxmin      = require('maxmin'),
        _s          = require('underscore.string'),
        path        = require('path'),
        chalk       = require('chalk'),
        fs          = require('fs'),
        Iconv       = require('iconv').Iconv,
        utf82euckr  = new Iconv( 'UTF-8', 'EUC-KR'),
        euckr2utf8  = new Iconv( 'EUC-KR', 'UTF-8'),
        Buffer      = require('buffer').Buffer;
    var DOMParser = require('xmldom').DOMParser;

	grunt.registerMultiTask('websquarelint', 'Validate WebSquare files with Lint', function () {
        var options = this.options({
				outputFile: false,
				format: 'stylish',
				reporterOutput: null
            }),
            encoding = ( options.encoding || 'UTF-8' ).toLowerCase(),
            ast,
            compressor,
            dest,
            isExpandedPair,
            fileType,
            tally = {
                dirs: 0,
                xml: 0,
                js: 0,
                css: 0,
                png: 0,
                jpg: 0
            },
            scriptRegex = /(<script[\s]*?type=[\"\']javascript[\"\'][\s]*?>[\s]*<!\[CDATA\[)([\s\S]*?)(\]\]>[\s]*<\/script>)/ig,
            exceptRegex = /return\s*/,
            eventRegex  = /ev\:event/,
            pseudoFunc  = ['(function(){', '})'],
            min = '',
            sourceStr = '',
            logMsg = '',
            globalStr = '',
            checkFilter = function ( source ) {
                if ( options.filter instanceof RegExp ) {
                    if ( options.filter.test( source ) ) {
                        return false;
                    }
                } else if ( typeof options.filter === 'function' ) {
                    return options.filter( source );
                }
                return true;
            },
            detectDestType = function ( dest ) {
                if( _s.endsWith( dest, '/' ) ) {
                    return 'directory';
                } else {
                    return 'file';
                }
            },
            detectFileType = function ( src ) {
                if( _s.endsWith( src, '.xml' ) ) {
                    return 'XML';
                } else if( _s.endsWith( src, '.js' ) ) {
                    return 'JS';
//                    return '';
                } else if( _s.endsWith( src, '.css' ) ) {
//                    return 'CSS';
                    return '';
                } else if( _s.endsWith( src, '.png' ) ) {
//                    return 'PNG';
                    return '';
                } else if( _s.endsWith( src, '.jpg' ) ) {
//                    return 'JPG';
                    return '';
                } else {
                    return '';
                }
            },
            countWithFileType = function ( fileType ) {
                if( fileType === 'XML' ) {
                    tally.xml++;
                } else if( fileType === 'JS' ) {
                    tally.js++;
                } else if( fileType === 'CSS' ) {
                    tally.css++;
                } else if( fileType === 'PNG' ) {
                    tally.png++;
                } else if( fileType === 'JPG' ) {
                    tally.jpg++;
                }
            },
            unixifyPath = function ( filepath ) {
                if( process.platform === 'win32' ) {
                    return filepath.replace( /\\/g, '/' );
                } else {
                    return filepath;
                }
            },
            esLint = function ( srcfile, file, options, globalObj ) {
				var engine = new eslint.CLIEngine(options);
				var results = engine.executeOnFiles([file]).results;
//				var formatter = require("./formatters/stylish");
				var formatter = engine.getFormatter(options.format);
				var total = 0;

                if(globalObj) {
                    logMsg += '    global object : ';
                    var first = true;
                    for(var prop in globalObj) {
                        if(globalObj.hasOwnProperty(prop)) {
                            if(first) {
                                first = false;
                                logMsg += prop;
                            } else {
                                logMsg += ', ' + prop;
                            }
                        }
                    }
                    logMsg += '\n\n';
                }

				if (!formatter) {
					grunt.warn('Could not find formatter ' + options.format + '\'.');
					return;
				}

				var output = formatter(results);
				var fileOutput = "";
//				var fileOutput = fileFormatter(results);

				results.forEach(function(result) {

				    var messages = result.messages;
				    total += messages.length;

				    messages.forEach(function(message) {

				        fileOutput += srcfile + ": ";
				        fileOutput += "line " + (message.line || 0);
				        fileOutput += ", col " + (message.column || 0);
				        fileOutput += ", " + getMessageType(message);
				        fileOutput += " - " + message.message;
				        fileOutput += message.ruleId ? " (" + message.ruleId + ")" : "";
				        fileOutput += "\n";

				    });

				});

				if (options.outputFile) {
					grunt.file.write(options.outputFile, logMsg);
					grunt.file.write(options.outputFile, fileOutput);
				} else {
                    grunt.log.writeln('\n\n' + srcfile  + ' | ' + total + ' lints found.');
//                    grunt.log.write(logMsg);
					grunt.log.write(output);
                    fs.appendFileSync(resultFile, '\n\n' + srcfile  + ' | ' + total + ' lints found.' +'\n');
                    fs.appendFileSync(resultFile, logMsg);
                    fs.appendFileSync(resultFile, fileOutput + "\n\n");
                    if( total > 0 ) {
	                    fs.appendFileSync(summaryFile, '\n\n' + srcfile  + ' | ' + total + ' lints found.' +'\n');
                    	fs.appendFileSync(summaryFile, fileOutput);
                	}
				}
            },
            pad = function(msg,length) {
                while (msg.length < length) {
                  msg = ' ' + msg;
                }
                return msg;
            },
            printSummary = function () {
                var isWrite = false;

                if( tally.dirs ) {
                    grunt.log.write( 'Created ' + chalk.green(tally.dirs) + ' directories' );
                    isWrite = true;
                }

                if( tally.xml ) {
                    grunt.log.write( ( isWrite ? ', do eslint ' : 'do eslint ' ) + chalk.green(tally.xml) + ' xml' );
                    isWrite = true;
                }

                if( tally.js ) {
                    grunt.log.write( ( isWrite ? ', do eslint ' : 'do eslint ' ) + chalk.green(tally.js) + ' js' );
                    isWrite = true;
                }

                grunt.log.writeln();
            },
            extractWebSquareID = function(str) {
                var globalObj = {};
                try {
                    var parser = new DOMParser();
                    var dom = parser.parseFromString( str , "text/xml" );
                    dom.async = false;
                    var node = dom.documentElement;
                    traverse(globalObj, node);
                } catch(e) {
                    grunt.log.warn("    XML Parsing exception\n");
                    logMsg += "    XML Parsing exception\n";
                }
                return globalObj;
            },
            traverse = function(globalObj, node) {
                if( node.nodeType == 1 ) {
                    if(node.getAttribute("id") && !skipNode(node.nodeName)) {
                        grunt.verbose.writeln("detect global object from " + node.nodeName + ", variable : " + node.getAttribute("id"));
                        globalObj[node.getAttribute("id")] = true;
                    }
                    if( stopNode(node.nodeName) ) {
                        return;
                    }
                    var childList = node.childNodes;
                    for( var i = 0 ; i < childList.length ; i++ ) {
                        var child = childList.item(i);
                        grunt.verbose.writeln("node info : " + child.nodeName );
                        traverse(globalObj, child);
                    }
                }
            },
            stopNode = function (nodeName) {
                var nameList = ["w2:dataMap", "w2:dataList", "xf:instance", "w2:gridView", "w2:grid", "xf:submission"];
                for (var i = nameList.length - 1; i >= 0; i--) {
                    if( nameList[i] == nodeName ) return true;
                };
                return false;
            },
            skipNode = function (nodeName) {
                var nameList = ["w2:tabs", "w2:content"];
                for (var i = nameList.length - 1; i >= 0; i--) {
                    if( nameList[i] == nodeName ) return true;
                };
                return false;
            },
            getMessageType = function(message) {
			    if (message.fatal || message.severity === 2) {
			        return "Error";
			    } else {
			        return "Warning";
			    }
			}
			;


            // Whether to output the report to a file
            var reporterOutput = options.reporterOutput;

            // Hook into stdout to capture report
            var output = '';
            if (reporterOutput) {
              hooker.hook(process.stdout, 'write', {
                pre: function(out) {
                  output += out;
                  return hooker.preempt();
                }
              });
            }

        grunt.verbose.writeflags( options, 'Options' );
        var resultFile = this.result;
        var summaryFile = this.summary;
        var globalObj = {};
        if( !resultFile ) {
            resultFile = 'result/result.txt';
        }
        if( !summaryFile ) {
            summaryFile = 'result/summary.txt';
        }
        var pathIdx = resultFile.lastIndexOf('/')
        grunt.file.mkdir( resultFile.substring(0, pathIdx) );
        grunt.log.warn('result : ' + resultFile + '\n');
        grunt.log.warn('summary : ' + summaryFile + '\n');

        this.files.forEach( function( filePair ) {
            isExpandedPair = filePair.orig.expand || false;

            filePair.src.forEach( function( src ) {

                if( checkFilter( src ) ) {
                    if( detectDestType( filePair.dest ) === 'directory' ) {
                        dest = (isExpandedPair) ? filePair.dest : unixifyPath( path.join( filePair.dest, src ) );
                    } else {
                        dest = filePair.dest;
                    }

                    if( grunt.file.isDir( src ) ) {
                        grunt.verbose.writeln( 'Creating ' + dest.cyan );
                        grunt.file.mkdir( dest );
                        tally.dirs++;
                    } else {
                        globalObj = {};
                        logMsg = '';
                        fileType = detectFileType( src );

                        if( fileType ) {
                            try {
                                grunt.verbose.writeln( fileType + ' do eslint ' + src.cyan + ' -> ' + dest.cyan );

                                sourceStr = fs.readFileSync( src );
                                var sourceStr1 =  sourceStr + "";
                                if( fileType === 'XML' ) {
                                    var strIdx = sourceStr1.indexOf('\n')
                                    grunt.verbose.writeln( fileType + ' do eslint ' + src.cyan + ' -> ' + dest.cyan + ', contents : ' + (strIdx > 0 ? sourceStr1.substring(0,strIdx) : sourceStr1) );
                                    if(sourceStr1.toLowerCase().indexOf("euc-kr") > 0 ) {
                                        try {
                                            grunt.verbose.writeln('convert euc-kr to utf-8');
                                            sourceStr = euckr2utf8.convert(sourceStr).toString('UTF-8');
                                            sourceStr = sourceStr.replace( /EUC[-]KR/, 'UTF-8' );
                                        } catch(e) {
                                            logMsg += "exception occured during convert euc-kr to utf-8. use original : " + src + "\n";
                                            grunt.log.warn('exception occured during convert euc-kr to utf-8. use original');
                                            sourceStr = sourceStr1;
                                        }
                                    }
                                    sourceStr += grunt.util.normalizelf( grunt.util.linefeed );
                                    grunt.verbose.writeln( 'convert ' + sourceStr );

                                    dest = dest + ".js";
                                    var myArray;
                                    var retStr = "";
                                    var startPoint = 0;
                                    while ((myArray = scriptRegex.exec(sourceStr)) !== null) {
                                        var len = sourceStr.substring(startPoint, myArray.index).split("\n").length;
                                        startPoint = scriptRegex.lastIndex;
                                        var arr = [];
                                        for(var idx1 = 0 ; idx1 < len - 1; idx1++) {
                                            arr.push("\n");
                                        }
                                        retStr += arr.join("") + myArray[2];
                                    }

                                    globalObj = extractWebSquareID(sourceStr, src);
                                    globalStr = '/*global';
                                    var first = true;
                                    for(var prop in globalObj) {
                                        if(globalObj.hasOwnProperty(prop)) {
                                            globalStr += ' ' + prop + ':true'
                                        }
                                    }
                                    globalStr += '*/';

                                    min = globalStr + retStr;


                                } else if( fileType === "JS" ) {
                                    grunt.verbose.writeln( fileType + ' do eslint ' + src.cyan + ' -> ' + dest.cyan );
                                    try {
                                        grunt.verbose.writeln('convert euc-kr to utf-8');
                                        sourceStr = euckr2utf8.convert(sourceStr).toString('UTF-8');
                                    } catch(e) {
                                        logMsg += "exception occured during convert euc-kr to utf-8. use original : " + src + "\n";
                                        grunt.log.warn('exception occured during convert euc-kr to utf-8. use original');
                                        sourceStr = sourceStr1;
                                    }
                                    sourceStr += grunt.util.normalizelf( grunt.util.linefeed );
                                    grunt.verbose.writeln( 'convert ' + sourceStr );

                                    min = sourceStr;
                                }
                            } catch( err ) {
                                grunt.warn( src + '\n' + err );
                            }

                            if( min.length < 1 ) {
                                grunt.log.warn( 'Destination not written because folder ' + src.cyan + ' was empty.' );
                            } else {
                                grunt.verbose.writeln(dest);
                                grunt.file.write( dest, min );
                                grunt.verbose.writeln( fileType + ' eslint ' + src.cyan + ' -> ' + dest.cyan );
                                grunt.verbose.writeln( maxmin( sourceStr, min ) );
                                countWithFileType( fileType );
                                esLint(src, dest, options, globalObj);
                            }
                        } else {
                            grunt.verbose.writeln( src.cyan + ' is skiped' );
                        }
                    }
                } else {
                    grunt.verbose.writeln( filePair.src[0] + ' is filtered.' );
                }
            });
        });



        printSummary();
    });
};
