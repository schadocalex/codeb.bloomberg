/**
 * https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
 *
 * Line-line intersection
 *
 * @param pt a1 = { x: x1, y: y1 }
 * @param pt a2 = { x: x2, y: y2 }
 * @param pt b1 = { x: x3, y: y3 }
 * @param pt b2 = { x: x4, y: y4 }
 * @param bool aIsSegment, optionnal, default : a is a line
 * @param bool bIsSegment, optionnal, default : b is a line
 * @returns Intersection point [x, y] or null if the lines doesn't intersect
 */
function lineLineIntersection( { x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }, { x: x4, y: y4 }, aIsSegment = false, bIsSegment = false) {
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


/**
 * Segment-segment intersection
 *
 * @param line a1 = { x: x1, y: y1 }
 * @param line a2 = { x: x2, y: y2 }
 * @param line b1 = { x: x3, y: y3 }
 * @param line b2 = { x: x4, y: y4 }
 * @returns Intersection point [x, y] or null if the segments doesn't intersect
 */
function segmentSegmentIntersection( { x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }, { x: x4, y: y4 } ) {
	return lineLineIntersection( { x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }, { x: x4, y: y4 }, true, true);   
}