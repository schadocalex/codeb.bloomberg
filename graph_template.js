// sample
/*

Input

8 8
XXXXXXXX
____X__X
XX_XX_XX
XX_____X
XXXX_XXX
X_____XX
X_XXX___
XXXXXXXX

Output

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

getInput(["| i-R i-C", "s-maze[R]|"], main);

function main() {
    // log(maze);
    g = inputToGraph();

    astarCompute(g, "1,0", name => distance(name.split(","), [R-2, C-1]));
    path = astarShortestPathTo(g, (R - 2) + "," + (C - 1));
    
    // dfsCompute(g, "1,0");
    // path = dfsShortestPathTo(g, (R - 2) + "," + (C - 1));

    // log(g);
    log(path.join("\n"));
}

function inputToGraph(){
    // TODO : ajouter un champs info diverses
    // preparer noeuds :
    /*
    {
        "11" : ["12, 13"],
        ....
    }
    */
    nodes = {}
    travalable = "_"
    neighbors = [[-1, 0], [0, -1], [+1, 0], [0, +1]];
    for (var r = 0; r < maze.length; r++) {
        for (var c = 0; c < maze[r].length; c++) {
            if (maze[r][c] == travalable) {
                var nodeName = getNodeName(r, c);
                nodes[nodeName] = []

                for (var i = 0; i < neighbors.length; i++) {
                    var neighbor = {};
                    neighbor.r = r + neighbors[i][0];
                    neighbor.c = c + neighbors[i][1];
                    if (maze[neighbor.r][neighbor.c] == travalable) {
                        nodes[nodeName].push( {
                            name: getNodeName(neighbor.r, neighbor.c),
                            weight: 1 // if unweighted graph
                        });
                        // nodes[nodeName].push( getNodeName(neighbor.r, neighbor.c) );
                    }
                }
            }
        }
    }
    // log(nodes);

    // Construire le graphe
    graph = buildGraph(nodes);
    return graph;
}

function getNodeName(r, c) {
    return (r) + "," + (c);
}

///////////////////////////////////////////////////
//////////////////// Graph ////////////////////
/*
graph {
    node1: {
        adjacent: [ { node: node2, weight: 12}, ...]
    }
    ...
}
*/

function buildGraph(links) {
    var graph = {};

    // Add nodes
    for(var key in links) {
        if(links.hasOwnProperty(key)) {
            graph[key] = {
                name: key,
                adjacent: [],
                data: {}
            }
        }
    }

    // Add links
    for(var key in links) {
        graph[key].adjacent = links[key].map(x => ({ node: graph[x.name], weight: x.weight }));
        // graph[key].adjacent = links[key].map(x => graph[x]);
    }
    
    return graph;
}

function astarCompute(graph, start, heuristic) {
    // graph : a buildGraph result
    // start : the node name to begin with
    // heuristic : a function(nodeName) that gives an heuristic of the distance to the goal. Return const to use A* as Dijkstra

    /*
    g : distance from start
    h : heuristic score
    f : g + h

    push startNode onto openList
    while(openList is not empty) {
        currentNode = find lowest f in openList
        // if currentNode is final, return the successful path
        push currentNode onto closedList and remove from openList
        foreach neighbor of currentNode {
            if neighbor is not in openList {
                save g, h, and f then save the current parent
                add neighbor to openList
            }
            if neighbor is in openList but the current g is better than previous g {
                save g and f, then save the current parent
            }
        }
    }
    */

    // Init/resert astar data
    for(var key in graph) {
        if(graph.hasOwnProperty(key)) {
            graph[key].data.astar = {
                distance: Infinity,
                h: Infinity,
                f: Infinity,
                parent: null
            }
        }
    }

    var openList   = []; // nodes to visit
    var closedList = []; // visited nodes
    openList.push(graph[start]);
    graph[start].data.astar.distance = 0;

    while(openList.length > 0) {
        var currentNode = openList.sort(function (a, b) {
            if (a.data.astar.f > b.data.astar.f) {
                return 1;
            } else if (a.data.astar.f < b.data.astar.f) {
                return -1;
            } else /* a.data.astar.f == b.data.astar.f */ {
                return 0;
            }
        }).shift();
        closedList.push(currentNode);

        for(var i=0; i<currentNode.adjacent.length;i++) {
            var neighbor = currentNode.adjacent[i].node;
            if(closedList.indexOf(neighbor) != -1) {
                // not a valid node to process, skip to next neighbor
                continue;
            }

            var distance = currentNode.data.astar.distance + currentNode.adjacent[i].weight;

            if(distance < neighbor.data.astar.distance) {
                // Found an optimal (so far) path to this node.  Store info on how we got here and
                //  just how good it really is...

                if(openList.indexOf(neighbor) == -1) {
                    neighbor.data.astar.h = heuristic(neighbor.name);
                    openList.push(neighbor);
                }

                // `distance` is the shortest distance from start to current node, we need to check if
                //   the path we have arrived at this neighbor is the shortest one we have seen yet
                neighbor.data.astar.distance = distance;

                neighbor.data.astar.parent = currentNode;
                neighbor.data.astar.f = distance + neighbor.data.astar.h;

            }
        }
    }
}

function astarShortestPathTo(graph, end) {
    // graph : a astarCompute result
    // end : the node name to go to. Start has been defined in astarCompute

    var currentNode = graph[end];
    var path = [];

    while (currentNode != null) {
        path.unshift(currentNode);

        currentNode = currentNode.data.astar.parent;
    }

    return path.map(x => x.name);
}

function dfsCompute(graph, start) {
    // graph : a buildGraph result
    // start : the node name to begin with
    // end : the node name to begin with

    // Init/reset DFS data
    for(var key in graph) {
        if(graph.hasOwnProperty(key)) {
            graph[key].data.dfs = {
                visited: false,
                parent: null // will be a node reference
            }
        }
    }

    dfsVisitNode(graph[start]);
}

function dfsVisitNode(node){
    // Mark node as visited
    node.data.dfs.visited = true;

    // For all neighbors
    for(var i=0; i<node.adjacent.length;i++) {
        var neighbor = node.adjacent[i].node;
        if(!neighbor.data.dfs.visited) {
            neighbor.data.dfs.parent = node;
            dfsVisitNode(neighbor);
        }
    }
}

function dfsShortestPathTo(graph, end) {
    // graph : a dfsCompute result
    // end : the node name to go to. Start has been defined in dfsCompute

    var currentNode = graph[end];
    var path = [];

    while (currentNode != null) {
        path.unshift(currentNode);
        currentNode = currentNode.data.dfs.parent;
    }

    return path.map(x => x.name);
}

//////////////// end of graph /////////////////
///////////////////////////////////////////////////

///////////////////////////////////////////////////
//////////////////// get Input ////////////////////

function getInput(rowDefs, cb) {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    var defs = rowDefs.map(_convertDef);
    var i = 0;
    var cbHasBeenCalled = false;
    rl.on('line', function (str) {
        if(i < defs.length) {
            i = defs[i](str.trim()) ? i + 1 : i;
            if (defs.length === i) {
                cbHasBeenCalled = true;
                cb();
            }
        }
    });
    rl.on('close', function() {
        if(!cbHasBeenCalled) {
            cb();
        }
        process.exit(0);
    });
    process.on('SIGINT', function() {
        rl.close();
    });
}

function _convertDef(def) {
    const inputRegExp = /^([a-z])-([a-zA-Z]+)(?:\[([a-zA-Z]+|\d+)\])?(?:\|(.?))?$/;
    const multiVarRegExp = /^\|(.)/;

    // c(def);
    var multiVarExec = multiVarRegExp.exec(def);
    // c(multiVarExec);
    if (multiVarExec !== null) {
        var multiVarSymbol = multiVarExec[1];
        var multiVar = def.split(multiVarSymbol).slice(1);
        let functions = multiVar.map(_convertDef);
        // c("multiVar");
        // c(multiVar);
        return function (str) {
            var strs = str.split(multiVarSymbol);
            // c("-- " + strs);
            // c("-- " + functions.length);
            for (var i = 0; i < functions.length; i++) {
                // c("---" + i);
                // c("--- " + strs[i]);
                // c("--- " + functions[i]);
                functions[i](strs[i]);
            }
            return true;
        }
    } else {
        let [type, name, nb, split] = inputRegExp.exec(def).slice(1);
        if(!nb) {
            return function(str) {
                global[name] = _convertStr(str, type, split);
                return true;
            }

        } else {
            const array = global[name] = [];
            return function(str) {
                array.push(_convertStr(str, type, split));
                if(nb === "Infinity") {
                    return false;
                } else if(!isNaN(+nb)) {
                    return array.length === parseInt(nb, 10);
                } else {
                    return array.length === global[nb];
                }
            }
        }
    }
}

function _convertStr(str, type, split) {
    if(split !== undefined) {
        return str.split(split).map(s => _convertStr(s, type));
    }

    switch(type) {
        case "i":
            return +str;
        case "s":
            return str.trim();
        case "f":
            return parseFloat(str);
    }
}

//////////////// end of get Input /////////////////
///////////////////////////////////////////////////

///////////////////////////////////////////////////
//////////////////// shortcuts ////////////////////
function log (o) {
    console.log(o);
}

function removeArrayElem (array, elem){
    var index = array.indexOf(elem);

    if (index > -1) {
        array.splice(index, 1);
    }
}

function distance(v1, v2){
    return Math.sqrt((v1[0] - v2[0]) * (v1[0] - v2[0]) + (v1[1] - v2[1]) * (v1[1] - v2[1]));
}

//////////////// end of shortcuts /////////////////
///////////////////////////////////////////////////