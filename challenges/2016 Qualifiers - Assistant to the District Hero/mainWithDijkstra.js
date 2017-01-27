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

    console.log(-dijkstra(nodes, source).dist);
}

function dijkstra(nodes, source, target) {
    let nodesToDiscover = new Set();

    nodes.forEach(v => {
        v.dist = Infinity;
        v.parent = null;
    });

    source.dist = 0;
    nodesToDiscover.add(source);

    let min = source;

    while(nodesToDiscover.size > 0) {
        let u = _min(nodesToDiscover, "dist");
        if(u === target) {
            return target;
        }
        nodesToDiscover.delete(u);
        for(let v of u.neighbors) {
            nodesToDiscover.add(v);
            let alt = u.dist - 1;
            if (alt < v.dist) {
                v.dist = alt;
                v.parent = u.x + " " + u.y;
                if (v.dist < min.dist) {
                    min = v;
                }
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