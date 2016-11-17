global.Sparse = class {
    constructor(w = 0, h = 0, arr = []) {
        this.w = w;
        this.h = h;
        this.points = new Map();
        for(let el of arr) {
            this.add(el);
        }
    }

    get(x, y) {
        return this.points.get(x + " " + y);
    }

    add(el) {
        this.points.set(el.x + " " + el.y, el);
        return el;
    }

    getClusters(value) {
        const clusters = [];

        const availablePoints = new Set();
        for(let point of this.points.values()) {
            if(point.value === value) {
                availablePoints.add(point);
            }
        }

        while(availablePoints.size > 0) {
            const sparse = new Sparse(this.w, this.h);
            let pointsInCluster = [availablePoints.pop()];

            while(pointsInCluster.length > 0) {
                let point = pointsInCluster.pop();
                sparse.add(point);
                let neighbours = this.getNeighbours(point, { equals: value }).filter(el => availablePoints.has(el));
                for(let neighbour of neighbours) {
                    availablePoints.delete(neighbour);
                    pointsInCluster.push(neighbour);
                }
            }

            clusters.push(sparse);
        }

        return clusters;
    }

    fill(x, y, value) {
        let source = this.get(x, y);

        if(!source) {
            source = this.add(new Point(x, y));
        }
        if(source.value === value) {
            return;
        }

        const visitedPoints = new Set();

        const pointsToDiscover = [source];

        while(pointsToDiscover.length > 0) {
            const point = pointsToDiscover.shift();
            point.value = value;
            const neighbours = this.getNeighbours(point, { notEquals: value, createIfUndefined: true });
            for(let neighbour of neighbours) {
                if(!visitedPoints.has(el)) {
                    visitedPoints.add(neighbour);
                    pointsToDiscover.push(neighbour);
                }
            }
        }
    }

    getNeighbours(point, opt = {}) {
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

        var neighbours = [];
        for(let offset of offsets) {
            let x = point.x + offset.x;
            let y = point.y + offset.y;
            let adj = this.get(x, y);

            if(!adj && opt.createIfUndefined && x >= 0 && x < this.w && y >= 0 && y < this.h) {
                adj = new Point(x, y);
                this.add(adj);
            }

            if(adj
                && (opt.equals === undefined || opt.equals === adj.value)
                && (opt.notEquals === undefined || opt.notEquals !== adj.value)) {
                neighbours.push(adj);
            }
        }

        return neighbours;
    }

    minimizeSize() {
        let minX, maxX, minY, maxY;
        for(let el of this.points.values()) {
            if(minX === undefined || el.x < minX) minX = el.x;
            if(maxX === undefined || el.x > maxX) maxX = el.x;
            if(minY === undefined || el.y < minY) minY = el.y;
            if(maxY === undefined || el.y > maxY) maxY = el.y;
        }

        var newPoints = this.points.map(el => new Point(el.x - minX, el.y - minY, el.value));

        return new Sparse(maxX - minX + 1, maxY - minY + 1, newPoints);
    }

    draw() {
        console.log("\n");
        for(let y = 0; y < this.h; y++) {
            var s = "";
            for(let x = 0; x < this.w; x++) {
                s += this.get(x, y) ? "X" : "_";
            }
            console.log(s);
        }
    }
}

global.Point = class {
    constructor(x, y, value) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
        this.value = value;
    }

    clone() {
        return new Point(this.x, this.y, this.value);
    }
}
