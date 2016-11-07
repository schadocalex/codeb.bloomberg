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
    dijkstraCompute(g, "1,0");
    path = dijkstraShortestPathTo(g, "6,7");
    log(path.join("\n"));
}

function inputToGraph(){
    // TODO : ajouter un champs info diverses
    // préparer noeuds :
    /*
    {
        "11" : ["12, 13"],
        ....
    }
    */
    nodes = {}
    travalable = "_"
    neighboors = [[-1, 0], [0, -1], [+1, 0], [0, +1]];
    for (var r = 0; r < maze.length; r++) {
        for (var c = 0; c < maze[r].length; c++) {
            if (maze[r][c] == travalable) {
                var nodeName = getNodeName(r, c);
                nodes[nodeName] = []

                for (var i = 0; i < neighboors.length; i++) {
                    var neighboor = {};
                    neighboor.r = r + neighboors[i][0];
                    neighboor.c = c + neighboors[i][1];
                    if (maze[neighboor.r][neighboor.c] == travalable) {
                        nodes[nodeName].push(getNodeName(neighboor.r, neighboor.c));
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
        adjacent: [node2, ...]
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
        graph[key].adjacent = links[key].map(x => graph[x])
    }
    
    return graph;
}

function dijkstraCompute(graph, start) {
    // graph : a buildGraph result
    // start : the node name to begin with

    /*
    push startNode onto openList
    while(openList is not empty) {
        currentNode = openList.pop
        push currentNode onto closedList
        foreach neighbor of currentNode {
            if neighbor is not in openList {
                   save distance + previous node (= currentNode) then save the current parent
                   add neighbor to openList
            }
            if neighbor is in openList but the current g is better than previous g {
                   save distance + previous node (= currentNode) then save the current parent
            }
        }
    }
    */

    // Init/resert Dijkstra data
    for(var key in graph) {
        if(graph.hasOwnProperty(key)) {
            graph[key].data.dijkstra = {
                distance: Infinity,
                parent: null
            }
        }
    }

    var openList   = []; // nodes to visit
    var closedList = []; // visited nodes
    openList.push(graph[start]);
    graph[start].data.dijkstra.distance = 0;

    while(openList.length > 0) {
        var currentNode = openList.pop();
        closedList.push(currentNode);

        for(var i=0; i<currentNode.adjacent.length;i++) {
            var neighbor = currentNode.adjacent[i];
            if(closedList.indexOf(neighbor) != -1) {
                // not a valid node to process, skip to next neighbor
                continue;
            }

            // `distance` is the shortest distance from start to current node, we need to check if
            //   the path we have arrived at this neighbor is the shortest one we have seen yet
            var distance = currentNode.data.dijkstra.distance + 1; // 1 is the distance from a node to it's neighbor
            var distanceIsBest = false;

            if(openList.indexOf(neighbor) == -1) {
                // This the the first time we have arrived at this node, it must be the best

                distanceIsBest = true;
                openList.push(neighbor);
            }
            else if(distance < neighbor.data.dijkstra.distance) {
                // We have already seen the node, but last time it had a worse g (distance from start)
                distanceIsBest = true;
            }

            if(distanceIsBest) {
                // Found an optimal (so far) path to this node.  Store info on how we got here and
                //  just how good it really is...
                neighbor.data.dijkstra.parent = currentNode;
                neighbor.data.dijkstra.distance = distance;
            }
        }
    }
}

function dijkstraShortestPathTo(graph, end) {
    // graph : a dijkstraCompute result
    // end : the node name to go to. Start has been defined in dijkstraCompute

    var currentNode = graph[end];
    var path = [];

    while (currentNode != null) {
        path.push(currentNode);

        currentNode = currentNode.data.dijkstra.parent;
    }

    return path.reverse().map(x => x.name);
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

//////////////// end of shortcuts /////////////////
///////////////////////////////////////////////////