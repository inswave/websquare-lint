'use strict';
module.exports = function (context) {
	return {
		CallExpression: function (node) {
			if (node.callee.name.toLowerCase.indexOf("$w") >= 0) {
				context.report(node, 'WebSquare !!!');
			}
		}
	};
};



/*


VariableDeclaration  { type: 'VariableDeclaration',
  declarations: 
   [ { type: 'VariableDeclarator',
       id: [Object],
       init: [Object],
       range: [Object],
       loc: [Object] } ],
  kind: 'var',
  range: [ 10067, 10085 ],
  loc: 
   { start: { line: 222, column: 6 },
     end: { line: 222, column: 24 } },
  leadingComments: 
   [ { type: 'Line',
       value: ' page function object',
       range: [Object],
       loc: [Object] } ],
  trailingComments: [ { type: 'Line', value: ' 초기화', range: [Object], loc: [Object] } ],
  parent: 
   { type: 'Program',
     body: 



VariableDeclaration  { type: 'VariableDeclarator',
  id: 
   { type: 'Identifier',
     name: 'abcdefg',
     range: [ 9467, 9474 ],
     loc: { start: [Object], end: [Object] } },
  init: null,
  range: [ 9467, 9474 ],
  loc: 
   { start: { line: 204, column: 7 },
     end: { line: 204, column: 14 } } }


*/