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
    ///!!!!\ does not work /!!!!\\\
    ///!!!!\ does not work /!!!!\\\
    ///!!!!\ does not work /!!!!\\\
    ///!!!!\ does not work /!!!!\\\
    ///!!!!\ does not work /!!!!\\\
    ///!!!!\ does not work /!!!!\\\
    M += A * X;
    M += O * Y;
    M -= Mf;
    let [d, x1, y1] = euclid(X, Y);
    if(M < 0 || M % d !== 0) {
        exit();
    } else {
        let solution = diophantineEquation(X/d, Y/d, M/d);
        if(solution === null) {
            exit();
        } else {
            let [x1, y1] = solution;
            console.log((M - y1 * Y) / X, (M - x1 * X) / Y);
        }
    }
}

// a*x + b*y = c
function diophantineEquation(a, b, c) {
    // if(a * b - 0.5 * (a - 1) * (b - 1) < 1) {
    //     exit();
    // }

    let q = Math.floor(c / (a * b));
    let r = c % (a * b);

    // a*x1 + b*y1 = d in Z
    let [d, x1, y1] = euclid(a, b);
    // console.log(a+"*"+x1+" + "+b+"*"+y1+" = "+d);
    // if(r % d !== 0) {
    //     exit();
    // }
    // a*x2 + b*y2 = r in Z
    let x2 = x1 * r / d;
    let y2 = y1 * r / d;
    // console.log(a+"*"+x2+" + "+b+"*"+y2+" = "+r);

    // a*x3 + b*y3 = r in N
    // a*x4 + b*y4 = r in N
    let tmp = (a * y2 - b * x2) / (a*a+b*b);
    let k1 = Math.floor(tmp);
    let k2 = Math.ceil(tmp);
    let x3 = x2 + b * k1;
    let y3 = y2 - a * k1;
    let x4 = x2 + b * k2;
    let y4 = y2 - a * k2;
    // console.log(a+"*"+x3+" + "+b+"*"+y3+" = "+r);
    // console.log(a+"*"+x4+" + "+b+"*"+y4+" = "+r);

    if(x3 >= 0 && y3 >= 0 && Math.floor(x3) === x3 && Math.floor(y3) === y3) {
        return [x3, y3];
    }
    if(x4 >= 0 && y4 >= 0 && Math.floor(x4) === x4 && Math.floor(y4) === y4) {
        return [x4, y4];
    }

    return null;
}

function exit() {
    console.log(" Impossible ");
}