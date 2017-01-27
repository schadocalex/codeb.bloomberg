/**
 * https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
 *
 * Line-line intersection
 *
 * @param line a1 = { x: x1, y: y1 }
 * @param line a2 = { x: x2, y: y2 }
 * @param line b1 = { x: x3, y: y3 }
 * @param line b2 = { x: x4, y: y4 }
 * @returns Intersection point [x, y] or null if the lines are parallel
 */
function lineLineIntersection( { x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }, { x: x4, y: y4 } ) {
    let denominator = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);

    if (denominator == 0) {
    	return null;
    }

    let px = (x1 * y2-y1 * x2) * (x3-x4) - (x1-x2) * (x3 * y4-y3 * x4);
    px /= denominator;

    let py = (x1 * y2-y1 * x2) * (y3-y4) - (y1-y2) * (x3 * y4-y3 * x4);
    py /= denominator;

    return [px, py];
}


/*
Test :
var a = [ { x: 0, y: 2 }, { x: 4, y: 2 } ];
var b = [ { x: 1, y: 0 }, { x: 5, y: 0 } ];
console.log(lineLineIntersection(...a, ...b));

var a = [ { x: 0, y: 2 }, { x: 4, y: 2 } ];
var b = [ { x: 1, y: 0 }, { x: 5, y: 4 } ];
console.log(lineLineIntersection(...a, ...b));

var a1 = { x: 0, y: 2 };
var a2 = { x: 4, y: 2 };
var b1 = { x: 1, y: 0 };
var b2 = { x: 5, y: 4 };
console.log(lineLineIntersection(a1, a2, b1, b2));

*/