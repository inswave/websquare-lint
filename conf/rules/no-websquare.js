/**
 * @fileoverview Rule to flag use of alert, confirm, prompt
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function matchProhibited(name) {
//	console.log("matchProhibited " + name);
    return name.match(/^(WebSquare)$/);
}

function report(context, node, result, arr) {
	var name = result[1];
	for( var i = arr.length - 1 ; i >= 0; i-- ) {
		name = name + "." + arr[i];
	}
    context.report(node, "Unexpected {{name}}.", { name: name });
}

function findMatched(node, context, arr) {
	var result;
    // without window.
    if (node.type === "Identifier") {
        result = matchProhibited(node.name);

        if (result) {
//        	console.log("found!!!");
            report(context, node, result, arr);
        }

    } else if (node.type === "MemberExpression" && node.property.type === "Identifier") {
        result = matchProhibited(node.property.name);
        if (result) {
//        	console.log("found!!!!!! " + node.property.name);
//        	console.log(JSON.stringify(node, undefined, 2));
            report(context, node, result, arr);
            return;
        } else {
    		arr.push(node.property.name);
        	node = node.object;
        	if( node ) {
        		findMatched(node, context, arr);
        	}
        	arr.pop();
        }
    }
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    return {

        "CallExpression": function(node) {
        	findMatched(node.callee, context, []);
        }
    };

};
