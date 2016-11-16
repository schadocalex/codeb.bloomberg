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
    let aMax = computeMax(A, O, M, X, Y, Mf);
    let oMax = computeMax(O, A, M, Y, X, Mf);
    console.log(aMax, oMax);
}

function computeMax(A, O, M, X, Y, Mf) {
    function buyA(x = Infinity) {
        let diff = Math.floor(Math.min(x, M) / X);
        A += diff;
        M -= diff * X;
    }
    function buyO(y = Infinity) {
        let diff = Math.floor(Math.min(y, M) / Y);
        O += diff;
        M -= diff * Y;
    }
    function sellA(x = Infinity) {
        let diff = Math.min(Math.floor(x / X), A);
        A -= diff;
        M += diff * X;
    }
    function sellO(y = Infinity) {
        let diff = Math.min(Math.floor(y / Y), O);
        O -= diff;
        M += diff * Y;
    }

    sellA();
    sellO();
    M -= Mf;
    if(M < 0) {
        exit();
    }

    let [gcd,u,v] = euclid(X, Y);
    let ppcm = X * Y / gcd;

    let mod;
    while((mod = M % X) !== 0 && O * Y < ppcm) {
        buyO(mod);
    }

    buyA();

    if(M > 0) {
        exit();
    }
    return A;
}

function exit() {
    console.log("Impossible");
    process.exit();
}