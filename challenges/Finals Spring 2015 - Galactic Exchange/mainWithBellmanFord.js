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

    console.log(bellmanford(nodes, source));
}

function bellmanford(nodes, source, target) {
    let nodesToDiscover = new Set();

    nodes.forEach(v => {
        v.dist = Infinity;
        v.parent = null;
    });

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

    return -min.dist;
}

function getPath(node, prop = "parent") {
    let path = [node];
    while(path[0][prop]) {
        path.unshift(path[0][prop]);
    }
    return path;
}

function _min(arr, prop) {
    let min = null;
    for(let el of arr) {
        if(min === null || (!prop ? el < prop : el[prop] < min[prop])) {
            min = el;
        }
    }
    return min;
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