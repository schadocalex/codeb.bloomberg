//Problem        :
//Language       : Javascript
//Compiled Using : V8
//Version        : Node 6.3.1
//Input for your program will be provided from STDIN
//Print out all output from your program to STDOUT

// sample
/*

 */

eval('var fs = require("fs")');
eval(fs.readFileSync('../../getInput.js').toString());
eval(fs.readFileSync('../../shortcuts.js').toString());
eval(fs.readFileSync('../../graphs.js').toString());

getInput(["i-K"], main);

function main() {
    console.log(K);
}