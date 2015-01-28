'use strict';
module.exports = function (context) {
	var util = require('util');
	return {
		"VariableDeclaration": function (node) {
			if(node.kind === "var" && node.parent.type === "Program") {
				if( node.declarations.length > 0) {
					if( node.declarations[0].init === null) {
						console.log( node.declarations[0].id.name  + " is delared but not initialized." );
					    context.report(node, "Uninitialized global vairable '{{name}}'.", { name: node.declarations[0].id.name });
					} else {
//						console.log( node.declarations[0].id.name  + " is delared and initialized." +  util.inspect(node.declarations[0].init) );
					}
				}
//				console.log("VariableDeclaration  "  + util.inspect(node.declarations[0]));
			}
		}
	};
};

