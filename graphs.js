///////////////////////////////////////////////////
///////////////////// graphs //////////////////////

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
            // if(nodesToDiscover.has(v)) si on veut un seul passage, on regarde si on a pas déjà choisi ce noeud
            let alt = u.dist + u.weight.get(v);
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
 * Idem que dijkstra mais plus lent et gère les poids négatifs
 * @param nodes
 * @param source
 * @param target
 * @returns {number}
 */
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
                if(u.dist + u.weight.get(v) < v.dist) {
                    v.dist = u.dist + u.weight.get(v);
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

////////////////// end of graphs //////////////////
///////////////////////////////////////////////////