//Problem        : 2016 Qualifiers - Assistant to the District Hero
//Language       : Javascript
//Compiled Using : V8
//Version        : Node 6.3.1
//Input for your program will be provided from STDIN
//Print out all output from your program to STDOUT

// sample
/*
INPUT
6
1 3
4 2
3 5
4 4
6 6
2 4

OUTPUT
4

INPUT
3
2 2
2 0
0 2

OUTPUT
2

 */

eval('var fs = require("fs")');
eval(fs.readFileSync('../../getInput.js').toString());
eval(fs.readFileSync('../../shortcuts.js').toString());

getInput(["i-N", "i-arr[N]| "], main);

function main() {
    let source = {
        x: 0,
        y: 0
    };
    var nodes = arr.map(el => {
        let [x, y] = el;
        return {
            x,
            y
        };
    });
    nodes.unshift(source);
    nodes.forEach(node => {
        node.neighbors = nodes.filter(node2 => node !== node2 && node2.x >= node.x && node2.y >= node.y);
    });

    console.log(-bellmanford(nodes, source).dist);
}

function bellmanford(nodes, source) {
    for(let u of nodes) {
        u.dist = Infinity;
        u.parent = null;
    }

    source.dist = 0;
    let min = source;

    for(let i = 1; i < nodes.length; i++) {
        for(let u of nodes) {
            for(let v of u.neighbors) {
                if(u.dist - 1 < v.dist) {
                    v.dist = u.dist - 1;
                    v.parent = u;
                    if (v.dist < min.dist) {
                        min = v;
                    }
                }
            }
        }
    }

    for(let u of nodes) {
        for(let v of u.neighbors) {
            if(u.dist - 1 < v.dist) {
                console.log("Graph contains a negative-weight cycle");
            }
        }
    }

    return min;
}

function getPath(node, prop = "parent") {
    let path = [node];
    while(path[0][prop]) {
        path.unshift(path[0][prop]);
    }
    return path;
}