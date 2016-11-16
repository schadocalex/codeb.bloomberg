//Problem        : Finals Spring 2015 - Ring of Fungi
//Language       : Javascript
//Compiled Using : V8
//Version        : Node 6.3.1
//Input for your program will be provided from STDIN
//Print out all output from your program to STDOUT

// sample
/*
INPUT
5 10 26
0 3
0 6
1 1
1 2
1 3
1 4
1 5
1 6
1 7
1 9
2 0
2 1
2 3
2 6
3 0
3 2
3 3
3 4
3 6
3 9
4 0
4 1
4 2
4 4
4 5
4 6

OUTPUT
0 0 2

EXPLANATION
In the diagram below, X/Y/Z mark fungus pixels, and the letters refer to the different colonies the pixels belong to.
Inside of the X colony the non-fungus pixels are marked with letters to show which ring contains them (a/b).
Thus we have two colonies of size 0 and one colony of size 2.
X  X
XXXXXXX Y
XXaXbbX
XaXXXbX  Z
XXX XXX
 */

eval('var fs = require("fs")');
eval(fs.readFileSync('../../getInput.js').toString());
eval(fs.readFileSync('../../shortcuts.js').toString());
eval(fs.readFileSync('../../Sparse.js').toString());
eval(fs.readFileSync('../../Grid.js').toString());

getInput(["| i-H i-W i-N", "s-fungus[N]"], main);

function main() {
    var sparse = new Sparse(W, H, fungus.map(el => {
        let [y, x] = el.split(" ");
        return new Point(x, y, 1);
    }));

    var clusters = sparse.getClusters(1).map(cluster => Grid.fromSparse(cluster.minimizeSize(), 0));

    var sizes = clusters.map(cluster => {

        for(let x = 0; x < cluster.w; x++) {
            cluster.fill(x, 0, 1);
            cluster.fill(x, cluster.h - 1, 1);
        }
        for(let y = 1; y < cluster.h - 1; y++) {
            cluster.fill(0, y, 1);
            cluster.fill(cluster.w - 1, y, 1);
        }

        // cluster.draw();

        return cluster.getClusters(0).length;
    });

    console.log(sizes.sort().join(" "));
}