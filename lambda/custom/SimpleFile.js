var fs = require('fs');
var text = fs.readFileSync('notes.txt').toString('utf-8');
var textByLine = text.split('\n');
console.log(textByLine[1]);
