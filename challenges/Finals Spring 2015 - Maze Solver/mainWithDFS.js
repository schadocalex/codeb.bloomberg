//Problem        :
//Language       : Javascript
//Compiled Using : V8
//Version        : Node 6.3.1
//Input for your program will be provided from STDIN
//Print out all output from your program to STDOUT

// sample
/*
INPUT
8 8
XXXXXXXX
____X__X
XX_XX_XX
XX_____X
XXXX_XXX
X_____XX
X_XXX___
XXXXXXXX

OUTPUT
1,0
1,1
1,2
2,2
3,2
3,3
3,4
4,4
5,4
5,5
6,5
6,6
6,7
 */

eval('var fs = require("fs")');
eval(fs.readFileSync('../../getInput.js').toString());
eval(fs.readFileSync('../../shortcuts.js').toString());
eval(fs.readFileSync('../../graphs.js').toString());

getInput(["| i-R i-C", "s-graph[R]|"], main);

function main() {
    let nodes = inputToGraph();
    let path = getPath(dfs(nodes, graph[1][0], graph[R-2][C-1]));
    console.log(path.map(el => el.y + "," + el.x).join("\n"));
}

function inputToGraph() {
    let adjs = [
        {x: -1, y: 0},
        {x: +1, y: 0},
        {x: 0, y: -1},
        {x: 0, y: +1}
    ];

    graph = graph.map((line, y) => {
        return line.map((el, x) => {
            if(el === "_") {
                return {
                    x,
                    y,
                    neighbors: [],
                    weight: new WeakMap()
                };
            } else {
                return null;
            }
        });
    });

    var nodes = [];

    for(let y = 0; y < R; y++) {
        for(let x = 0; x < C; x++) {
            let node = graph[y][x];
            if(node) {
                nodes.push(node);
                for(let t of adjs) {
                    let adj = graph[y + t.y][x + t.x];
                    if(adj) {
                        node.neighbors.push(adj);
                        node.weight.set(adj, 1);
                    }
                }
            }
        }
    }

    return nodes;
}