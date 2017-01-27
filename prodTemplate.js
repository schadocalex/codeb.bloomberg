// sample
/*

Input



Output



 */

getInput(["| i-A i-O", "i-Y", "s-graph[Y]|"], main);


function main() {
    
}




/**
 * https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Pseudocode
 *
 * Dijkstra algorithm. Set "dist" and "parent" properties on all nodes. Default values are Infinity and null.
 * Usage :
 * disjktra(nodes, nodes[nodesStartIndex])
 * getPath(disjktra(nodes, nodes[nodesStartIndex], nodes[nodesEndIndex]))
 * getPath(disjktra(nodes, nodes[nodesStartIndex], nodes[nodesEndIndex]))
 *
 * @param {Node[]} nodes - Array of nodes with the following properties: neighbors, weight (Map)
 * @param {Node} source - The node to start from
 * @param {Node} [target] - If it find this node, it will stop
 * @returns {Node} - The target if defined and found, else the farest node.
 * @need _min
 */
function dijkstra(nodes, source, target) {
    let nodesToDiscover = new Set();

    for(let u of nodes) {
        u.dist = Infinity;
        u.parent = null;
        nodesToDiscover.add(u);
    }

    source.dist = 0;

    let max = source;

    while(nodesToDiscover.size > 0) {
        let u = _min(nodesToDiscover, "dist");
        if(u === target) {
            return target;
        }
        nodesToDiscover.delete(u);
        for(let v of u.neighbors) {
            // if(nodesToDiscover.has(v)) si on veut un seul passage, on regarde si on a pas deja choisi ce noeud
            let alt = u.dist + isCorner(v, u, u.parent);
            if (alt < v.dist) {
                v.dist = alt;
                v.parent = u;
                if (v.dist > max.dist) {
                    max = v;
                }
            }
        }
    }

    return max;
}



/**
 * https://en.wikipedia.org/wiki/A*_search_algorithm#Pseudocode
 *
 * A* algorithm. Set "dist" and "parent" properties on all nodes. Default values are Infinity and null.
 * Usage :
 * astar(nodes, nodes[nodesStartIndex])
 * astar(nodes, nodes[nodesStartIndex], (n) => { R - n.y + C - n.x; })
 * getPath(astar(nodes, nodes[nodesStartIndex], (n) => { R - n.y + C - n.x; }, nodes[nodesEndIndex]))
 *
 * @param {Node[]} nodes - Array of nodes with the following properties: neighbors, weight (Map)
 * @param {Node} source - The node to start from
 * @param {Node} [heuristic] - Consistent heuristic function that takes a node as argument.
 * @param {Node} [target] - If it finds this node, it will stop
 * @returns {Node} - The target if defined and found, else the furthest node.
 */
function astar(nodes, source, heuristic = (n) => {return 0;}, target) {
    let openNodes = new Set();      // queue of nodes to be computed
    let closedNodes = new Set();    // list of node for which we are sure of our result

    nodes.forEach(v => {
        v.dist = Infinity;
        v.heuristic = Infinity;
        v.score = Infinity;
        v.parent = null;
    });

    source.dist = 0;
    openNodes.add(source);

    let max = source;

    while(openNodes.size > 0) {
        let u = _min(openNodes, "score");
        if(u === target) {
            return target;
        }
        openNodes.delete(u);
        closedNodes.add(u);
        for(let v of u.neighbors) {
            if(!closedNodes.has(v)) {
                let alt = u.dist + u.weight.get(v);
                if (alt < v.dist) {
                    openNodes.add(v);

                    v.dist = alt;
                    v.heuristic = heuristic(v);
                    v.score = v.dist + v.heuristic;
                    v.parent = u;
                    if (v.dist > max.dist) {
                        max = v;
                    }
                }
            }
        }
    }

    return max;
}

/**
 * https://en.wikipedia.org/wiki/Depth-first_search#Pseudocode
 *
 * DFS (Deep First Search) algorithm. Set "dist" and "parent" properties on all nodes. Default values are Infinity and null.
 * Usage :
 * dfs(nodes, nodes[nodesStartIndex])
 * getPath(dfs(nodes, nodes[nodesStartIndex], nodes[nodesEndIndex]))
 * getPath(dfs(nodes, nodes[nodesStartIndex], nodes[nodesEndIndex]))
 *
 * @param {Node[]} nodes - Array of nodes with the following properties: neighbors
 * @param {Node} source - The node to start from
 * @param {Node} [target] - If it find this node, it will stop
 * @returns {Node} - The target if defined and found, else the farest node.
 */
function dfs(nodes, source, target) {
    for(let node of nodes) {
        node.dist = Infinity;
        node.parent = null;
    }

    const S = [];

    S.push(source);
    source.dist = 0;

    let max = source;

    while(S.length > 0) {
        let v = S.pop();
        for(let w of v.neighbors) {
            if(w.dist === Infinity) {
                w.dist = v.dist + 1;
                w.parent = v;

                if(w === target) {
                    return target;
                }
                if(w.dist > max.dist) {
                    max = w;
                }

                S.push(w);
            }
        }
    }

    return max;
}




/**
 * Get the path from a given node. The algorithm will put the given node at the end.
 * Usage:
 * var node1 = {
 *      id: 'node1'
 * };
 * var node2 = {
 *      id: 'node2',
 *      parent: node1
 * };
 * getPath(node2); // [node1, node2]
 *
 * @param {Node} node
 * @param {string} prop - The property name to get the next node
 * @returns {Node[]}
 */
function getPath(node, prop = "parent") {
    let path = [node];
    while(path[0][prop]) {
        path.unshift(path[0][prop]);
    }
    return path;
}





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

function c (o) {
    console.log(o);
}

function removeArrayElem (array, elem){
    var index = array.indexOf(elem);

    if (index > -1) {
        array.splice(index, 1);
    }
}

/**
 * Get the minimum value of an array. If prop is defined, get the minimum value by the prop.
 * Usage:
 * _min([1, 2, 3, 4]) // 1
 * _min([{val: 1}, {val: 2}, {val: 3}, {val: 4}], "val") // {val: 1}
 *
 * @param {*[]|Set} arr - The first array
 * @param {string} prop - The property shorthand
 * @returns {*}
 */
function _min(arr, prop) {
    let min = null;
    for(let el of arr) {
        if(min === null || (!prop ? el < prop : el[prop] < min[prop])) {
            min = el;
        }
    }
    return min;
}

/**
 * Get the maximum value of an array. If prop is defined, get the maximum value by the prop.
 * Usage:
 * _max([1, 2, 3, 4]) // 4
 * _max([{val: 1}, {val: 2}, {val: 3}, {val: 4}], "val") // {val: 4}
 *
 * @param {*[]|Set} arr - The first array
 * @param {string} prop - The property shorthand
 * @returns {*}
 */
function _max(arr, prop) {
    let max = null;
    for(let el of arr) {
        if(max === null || (!prop ? el > prop : el[prop] > max[prop])) {
            max = el;
        }
    }
    return max;
}

/**
 * Get the first array without the second array elements
 * Usage:
 * difference([1, 2, 3, 4], [2, 4, 6]) // [1, 3]
 *
 * @param {*[]} arr - The first array
 * @param {*[]} arr2 - The second array
 * @returns {*[]}
 */
function _difference(arr, arr2) {
    var res = new Set(arr);
    for(let el of arr2) {
        res.delete(el);
    }
    return [...res];
}


Set.prototype.first = function() {
    return this.values().next().value;
};

Set.prototype.pop = function() {
    let el = this.first();
    this.delete(el);
    return el;
};
Set.prototype.shift = Set.prototype.pop;

Set.prototype.map = function(fn) {
    let arr = [];
    this.forEach((el, i, arr) => arr.push(fn(el, i, arr)));
    return arr;
};

Map.prototype.first = Set.prototype.first;
Map.prototype.pop = Set.prototype.pop;
Map.prototype.shift = Set.prototype.pop;
Map.prototype.map = Set.prototype.map;

//////////////// end of shortcuts /////////////////
///////////////////////////////////////////////////