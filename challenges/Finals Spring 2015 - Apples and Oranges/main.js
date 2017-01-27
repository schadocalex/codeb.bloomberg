//Problem        : Finals Spring 2015 - Apples and Oranges
//Language       : Javascript
//Compiled Using : V8
//Version        : Node 6.3.1
//Input for your program will be provided from STDIN
//Print out all output from your program to STDOUT

// sample
/*
INPUT
100 50 6 2 3 12

OUTPUT
172 114

EXPLANATION
In order to walk away with $12, the salesman must have a net profit of $6. There are handful of different ways
to buy/sell apples/oranges to reach $6 profit, but we are only interested in the cases where we maximize the number
of apples/oranges that the salesman walks away with.
If he buys 72 apples (leaving him with 172 at the end), he would have to sell all of his oranges to still profit
$6 overall. Therefore 172 is the maximum number of apples he can walk away with, since he has no more oranges to sell.
If he buys 64 oranges (leaving him with 114 at the end), he would have to sell all but one of his apples to profit
$6 overall. He cannot sell his last apple, because no matter how many oranges he buys, he would not end up with
a $6 profit. Therefore 114 is the maximum number of oranges he can walk away with.
 */

eval('var fs = require("fs")');
eval(fs.readFileSync('../../getInput.js').toString());
eval(fs.readFileSync('../../algebre.js').toString());

getInput(["| i-A i-O i-M i-X i-Y i-Mf"], main);

function main() {
    M += A * X;
    M += O * Y;
    M -= Mf;

    let [pgcd,,] = euclid(X, Y);
    let ppcm = X * Y / pgcd;
    let q = Math.floor(M / ppcm);
    let r = M % ppcm;
    let coeff1 = coeff(X, Y, r);
    let coeff2 = coeff(Y, X, r);
    if(coeff1 === -1 || coeff2 === -1) {
        console.log("Impossible");
    } else {
        console.log((M - coeff1 * Y) / X, (M - coeff2 * X) / Y);
    }
}

// 2*max + b*min = r
function coeff(a, b, r) {
    let min = 0;
    while(r > 0 && r % a !== 0) {
        r -= b;
        min++;
    }
    if(r < 0) {
        return -1;
    } else {
        return min;
    }
}
