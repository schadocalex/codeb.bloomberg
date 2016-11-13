eval('var fs = require("fs")');
eval(fs.readFileSync('./getInput.js').toString());
eval(fs.readFileSync('./shortcuts.js').toString());

// sample
/*
 2
 gf fd
 vfd sg
 vf dsb
 test 1
 test 2
 2 14
 1#3
 4#7
 */

getInput(["i-N", "s-M[3]| ", "s-R[N]", "| i-P i-Q", "s-S[2]|#"], main);

function main() {
    c(N);
    c(M);
    c(R);
    c(P);
    c(Q);
    c(S);
}