//Problem        : 2016 Qualifiers - Uncle's Super Birthday Party
//Language       : Javascript
//Compiled Using : V8
//Version        : Node 6.3.1
//Input for your program will be provided from STDIN
//Print out all output from your program to STDOUT

/*
INPUT
5
0 0
6 6
7 6
6 0
0 0
OUTPUT
15

INPUT
7
1 1
2 1
1 2
4 2
4 0
1 0
1 1
OUTPUT
5
*/
const abs = Math.abs;
const min = Math.min;
const max = Math.max;

getInput(["i-N", "i-points[N]| "], main);

function main() {
    let [min, max] = getBounds();
    points = points.map(p => [p[0] + 1 - min.x, p[1] + 1 - min.y]);
    let grid = Grid.fromWH(max.x - min.x + 2, max.y - min.y + 2);
    let [xSegs, ySegs, segs] = getSegments();
    segs.forEach(s => fillSeg(grid, s));

    grid.fill(0, 0, 1, check);
    console.log(grid.nbOf(0));

    function check(x1, y1, x2, y2) {
        let segs;
        if(x1 !== x2) {
            segs = ySegs;
        } else {
            segs = xSegs;
        }
        return segs.every(seg => segmentSegmentIntersection([x1 + 0.5, y1 + 0.5], [x2 + 0.5, y2 + 0.5], seg[0], seg[1]) === null);
    }
}

function getBounds() {
    let min = {x: Infinity, y: Infinity};
    let max = {x: -Infinity, y: -Infinity};
    for(let p of points) {
        if(p[0] < min.x) min.x = p[0];
        if(p[0] > max.x) max.x = p[0];
        if(p[1] < min.y) min.y = p[1];
        if(p[1] > max.y) max.y = p[1];
    }
    return [min, max];
}

function getSegments() {
    let xSegs = [], ySegs = [], segs = [];
    for(let i = 0; i < points.length - 1; i++) {
        let A = points[i];
        let B = points[i+1];
        if(A[0] === B[0]) ySegs.push([A, B]);
        else if(A[1] === B[1]) xSegs.push([A, B]);
        else segs.push([A, B]);
    }
    return [xSegs, ySegs, segs];
}

function fillSeg(grid, [[x1, y1], [x2, y2]], value = 1) {
    let dy = y2 - y1;
    let dx = x2 - x1;
    let a = dy/dx;
    let b = y1 - a * x1;
    if(abs(dx) > abs(dy)) {
        for(let x = min(x1,x2) + 0.5; x < max(x1,x2); x += 1) {
            let y = a * x + b;
            grid.set(Math.floor(x), Math.floor(y), value);
        }
    } else {
        for(let y = min(y1, y2) + 0.5; y < max(y1, y2); y += 1) {
            let x = (y - b) / a;
            grid.set(Math.floor(x), Math.floor(y), value);
        }
    }
}

function lineLineIntersection( [ x1, y1 ], [ x2, y2 ], [ x3, y3 ], [ x4, y4 ], aIsSegment = false, bIsSegment = false) {
    let denominator = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);

    if (denominator == 0) {
        return null;
    }

    let px = (x1 * y2-y1 * x2) * (x3-x4) - (x1-x2) * (x3 * y4-y3 * x4);
    px /= denominator;

    let py = (x1 * y2-y1 * x2) * (y3-y4) - (y1-y2) * (x3 * y4-y3 * x4);
    py /= denominator;

    // px is in ([x1, x2] or [x1, x2]) and in ([x3, x4] or [x4, x3])
    if (   (aIsSegment
            && (px < Math.min(x1, x2)
                || px > Math.max(x1, x2)
                || py < Math.min(y1, y2)
                || py > Math.max(y1, y2)
                )
            )
        || (bIsSegment
            && ( px < Math.min(x3, x4)
                || px > Math.max(x3, x4)
                || py < Math.min(y3, y4)
                || py > Math.max(y3, y4)
                )
            )
        ) {
        return null;
    }

    return [px, py];
}

function segmentSegmentIntersection( [ x1, y1 ], [ x2, y2 ], [ x3, y3 ], [ x4, y4 ]  ) {
    return lineLineIntersection( [ x1, y1 ], [ x2, y2 ], [ x3, y3 ], [ x4, y4 ], true, true);   
}

///////////////////////////////////////////////////
/////////////////////// Grid //////////////////////

class Grid{
    constructor(grid) {
        this.w = grid.length;
        this.h = grid[0].length;
        this.grid = grid;
    }

    static fromWH(w, h, defaultValue = 0, Type = Uint8Array) {
        var grid = new Array(w);
        for(let x = 0; x < w; x++) {
            grid[x] = new Type(h);
            for(let y = 0; y < h; y++) {
                grid[x][y] = defaultValue;
            }
        }

        return new Grid(grid);
    }

    static fromSparse(sparse, defaultValue = 0, Type = Uint8Array) {
        var grid = new Array(sparse.w);
        for(let x = 0; x < sparse.w; x++) {
            grid[x] = new Type(sparse.h);
            for(let y = 0; y < sparse.h; y++) {
                let el = sparse.get(x, y);
                let value = defaultValue;
                if(el) {
                    value = el.value;
                }
                grid[x][y] = value;
            }
        }

        return new Grid(grid);
    }

    get(x, y) {
        return this.grid[x][y];
    }

    set(x, y, value) {
        this.grid[x][y] = value;
    }

    getClusters(value) {
        const clusters = [];

        const availablePoints = new Set();
        for(let x = 0; x < this.w; x++) {
            for(let y = 0; y < this.h; y++) {
                if(this.grid[x][y] === value) {
                    availablePoints.add([x, y].toString());
                }
            }
        }

        while(availablePoints.size > 0) {
            const sparse = new Sparse(this.w, this.h);
            let pointsInCluster = [availablePoints.pop()];

            while(pointsInCluster.length > 0) {
                let [x, y] = pointsInCluster.pop().split(",");
                sparse.add(new Point(x, y));
                let neighbours = this.getNeighbours(x, y, { equals: value });
                for(let neighbour of neighbours) {
                    let n = neighbour.toString();
                    if(availablePoints.has(n)) {
                        availablePoints.delete(n);
                        pointsInCluster.push(n);
                    }
                }
            }

            clusters.push(sparse);
        }

        return clusters;
    }

    fill(x, y, value, checkFn) {
        if(this.grid[x][y] === value) {
            return;
        }

        const pointsToDiscover = [[x, y]];
        const closePoints = new Set();
        closePoints.add(pointsToDiscover[0].toString());

        while(pointsToDiscover.length > 0) {
            const [x, y] = pointsToDiscover.shift();
            this.grid[x][y] = value;

            const neighbours = this.getNeighbours(x, y, { notEquals: value, checkFn });
            for(let neighbour of neighbours) {
                if(!closePoints.has(neighbour.toString())) {
                    closePoints.add(neighbour.toString());
                    pointsToDiscover.push(neighbour);
                }
            }
        }
    }

    getNeighbours(_x, _y, opt = {}) {
        /*const offsets = [
            {x: -1, y: -1},
            {x: 0, y: -1},
            {x: 1, y: -1},
            {x: -1, y: 0},
            {x: 1, y: 0},
            {x: -1, y: 1},
            {x: 0, y: 1},
            {x: 1, y: 1}
        ];*/
        const offsets = [
            {x: 0, y: -1},
            {x: -1, y: 0},
            {x: 1, y: 0},
            {x: 0, y: 1}
        ];

        const neighbours = [];

        for(let offset of offsets) {
            let x = parseInt(_x, 10) + offset.x;
            let y = parseInt(_y, 10) + offset.y;

            if(x >= 0 && x < this.w && y >= 0 && y < this.h) {
                if( (opt.equals === undefined || opt.equals === this.grid[x][y]) &&
                    (opt.notEquals === undefined || opt.notEquals !== this.grid[x][y]) &&
                    (opt.checkFn === undefined || opt.checkFn(_x, _y, x, y))) {
                    neighbours.push([x, y]);
                }
            }
        }

        return neighbours;
    }

    drawMath() {
        console.log("\n");
        for(let y = this.h - 1; y >= 0; y--) {
            var s = "";
            for(let x = 0; x < this.w; x++) {
                s += this.grid[x][y];
            }
            console.log(s);
        }
    }

    nbOf(value) {
        let nb = 0;
        for(let y = 0; y < this.h; y++) {
            for(let x = 0; x < this.w; x++) {
                if(this.grid[x][y] === value) nb++;
            }
        }
        return nb;
    }
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