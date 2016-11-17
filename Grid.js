global.Grid = class {
    constructor(grid) {
        this.w = grid.length;
        this.h = grid[0].length;
        this.grid = grid;
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
                    if(!availablePoints.has(n)) {
                        availablePoints.delete(n);
                        pointsInCluster.push(n);
                    }
                }
            }

            clusters.push(sparse);
        }

        return clusters;
    }

    fill(x, y, value) {
        if(this.grid[x][y] === value) {
            return;
        }

        const pointsToDiscover = [[x, y]];
        const closePoints = new Set();
        closePoints.add(pointsToDiscover[0].toString());

        while(pointsToDiscover.length > 0) {
            const [x, y] = pointsToDiscover.shift();
            this.grid[x][y] = value;

            const neighbours = this.getNeighbours(x, y, { notEquals: value });
            for(let neighbour of neighbours) {
                if(!closePoints.has(neighbour.toString())) {
                    closePoints.add(neighbour.toString());
                    pointsToDiscover.push(neighbour);
                }
            }
        }
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

    fill(x, y, value) {
        if(this.grid[x][y] === value) {
            return;
        }

        const pointsToDiscover = [[x, y]];
        const closePoints = new Set();
        closePoints.add(pointsToDiscover[0].toString());

        while(pointsToDiscover.length > 0) {
            const [x, y] = pointsToDiscover.shift();
            this.grid[x][y] = value;

            const neighbours = this.getNeighbours(x, y, { notEquals: value });
            for(let neighbour of neighbours) {
                if(!closePoints.has(neighbour.toString())) {
                    closePoints.add(neighbour.toString());
                    pointsToDiscover.push(neighbour);
                }
            }
        }
    }

    getNeighbours(_x, _y, opt = {}) {
        const offsets = [
            {x: -1, y: -1},
            {x: 0, y: -1},
            {x: 1, y: -1},
            {x: -1, y: 0},
            {x: 1, y: 0},
            {x: -1, y: 1},
            {x: 0, y: 1},
            {x: 1, y: 1}
        ];

        const  neighbours = [];

        for(let offset of offsets) {
            let x = parseInt(_x, 10) + offset.x;
            let y = parseInt(_y, 10) + offset.y;

            if(x >= 0 && x < this.w && y >= 0 && y < this.h) {
                if( (opt.equals === undefined || opt.equals === this.grid[x][y]) &&
                    (opt.notEquals === undefined || opt.notEquals !== this.grid[x][y])) {
                    neighbours.push([x, y]);
                }
            }
        }

        return neighbours;
    }

    draw() {
        console.log("\n");
        for(let y = 0; y < this.h; y++) {
            var s = "";
            for(let x = 0; x < this.w; x++) {
                s += this.grid[x][y];
            }
            console.log(s);
        }
    }
}
