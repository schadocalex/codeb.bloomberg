/**
 * Disjktra algorythm. Set "dist" and "parent" properties on all nodes. Default values are Infinity and null.
 * Usage :
 * disjktra(nodes, nodes[nodesStartIndex])
 * getPath(disjktra(nodes, nodes[nodesStartIndex], nodes[nodesEndIndex]))
 * getPath(disjktra(nodes, nodes[nodesStartIndex], nodes[nodesEndIndex]))
 *
 * @param {Node[]} nodes - Array of nodes with the following properties: neighbors, weight (Map)
 * @param {Node} source - The node to start from
 * @param {Node} [target] - If dijkstra choose this node, it will stop
 * @returns {Node} - The target if defined and found, else the farest node.
 * @constructor
 */
function dijkstra(nodes, source, target) {
    let Q = new Set();

    nodes.forEach(v => {
        v.dist = Infinity;
        v.parent = null;
        Q.add(v);
    });

    source.dist = 0;

    let min = source;

    while(Q.size > 0) {
        let u = _min(Q, "dist");
        if(target && target === u) {
            return target;
        }
        Q.delete(u);
        for(let v of u.neighbors) {
            if(Q.has(v)) {
                let alt = u.dist + u.weight.get(v);
                if (alt < v.dist) {
                    v.dist = alt;
                    v.parent = u;
                    if (v.dist < min.dist) {
                        min = v;
                    }
                }
            }
        }
    }

    return min;
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