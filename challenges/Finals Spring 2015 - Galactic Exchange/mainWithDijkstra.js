//Problem        : Finals Spring 2015 - Galactic Exchange
//Language       : Javascript
//Compiled Using : V8
//Version        : Node 6.3.1
//Input for your program will be provided from STDIN
//Print out all output from your program to STDOUT

// sample
/*
 INPUT
 6
 1,1,1,2.2,Alpha
 2,2,2,2.2,Beta
 3,3,3,2.2,Orion
 1,2,3,3,Eta
 6,5,22,1,Gamma
 6,5,24,3,Omicron

 OUTPUT
 Alpha,Beta,Eta,Orion

 EXPLANATION
 In this universe, planet's Launchers can reach the following other planets:
 Alpha: Beta
 Beta: Alpha, Eta, Orion
 Eta: Alpha, Beta, Orion
 Orion: Beta
 Omicron: Gamma
 Omicron can only reach Gamma, and Gamma cannot reach anywhere else.
 Starting at Alpha, we can go to Beta, then Eta, then Orion (there are a number of other ways to bounce between these four, as well.)
 Therefore, the largest number of planets reachable (sorted alphabetically) is Alpha, Beta, Eta, & Orion.
 */

eval('var fs = require("fs")');
eval(fs.readFileSync('../../getInput.js').toString());
eval(fs.readFileSync('../../shortcuts.js').toString());
eval(fs.readFileSync('../../graphs.js').toString());


getInput(["i-K", "s-planets[K]|,"], main);

function main() {
    let nodes = inputToGraph();

    var nodesInPath = new Set(nodes);
    var max = null;

    while(nodesInPath.size > 0) {
        let node = nodesInPath.values().next().value;
        dijkstra(nodes, node);
        let path1 = getPath(_min(nodes, "dist"));
        let othersNode = _difference(nodes, path1);
        othersNode.push(node);
        dijkstra(othersNode, node);
        let path2 = getPath(_min(othersNode, "dist"));
        path2.shift();

        let path = path1.concat(path2);
        for(let el of path) {
            nodesInPath.delete(el);
        }

        if(max === null || path.length > max.length) {
            max = path;
        }
    }

    console.log(max.map(el => el.name).sort().join(","));
}

function inputToGraph() {
    var nodes = planets.map(planet => {
        let [x, y, z, r, name] = planet;
        return {
            x: parseFloat(x),
            y: parseFloat(y),
            z: parseFloat(z),
            r: parseFloat(r),
            name,
            weight: new WeakMap()
        };
    });

    nodes.forEach(node => {
        node.neighbors = nodes.filter(node2 => node !== node2 && norm(node, node2) <= node.r);
        node.neighbors.forEach(neighbor => node.weight.set(neighbor, -1));
    });

    return nodes;
}

function norm(node1, node2) {
    return Math.sqrt(Math.pow(node2.x - node1.x, 2) + Math.pow(node2.y - node1.y, 2) + Math.pow(node2.z - node1.z, 2));
}
