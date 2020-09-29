var fs = require('fs');
var ejs = require('ejs');

var iterate = fs.readFileSync('./iterate.js', 'utf-8');
var tpl = fs.readFileSync('./webworker.ejs', 'utf-8');

iterate = iterate.replace(/module\.exports/, 'mod.exports');

var result = ejs.render(tpl, {iterate: iterate});

console.log(result);
