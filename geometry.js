/**
 * https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
 *
 * Line-line intersection
 *
 * @param pt a1 = [ x1, y1]}
 * @param pt a2 = [ x2, y2]}
 * @param pt b1 = [ x3, y3]}
 * @param pt b2 = [ x4, y4]}
 * @param bool aIsSegment, optionnal, default : a is a line
 * @param bool bIsSegment, optionnal, default : b is a line
 * @returns Intersection point [x, y] or null if the lines doesn't intersect
 */
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


/*
Test :
var a = [ [ 0, 2 ], [ 4, 2 ] ];
var b = [ [ 1, 0 ], [ 5, 0 ] ];
console.log(lineLineIntersection(...a, ...b));

var a = [ [ 0, 2 ], [ 4, 2 ] ];
var b = [ [ 1, 0 ], [ 5, 4 ] ];
console.log(lineLineIntersection(...a, ...b));

var a1 = [ 0, 2 ];
var a2 = [ 4, 2 ];
var b1 = [ 1, 0 ];
var b2 = [ 5, 4 ];
console.log(lineLineIntersection(a1, a2, b1, b2));


var a1 = [ 0, 2 ];
var a2 = [ 4, 2 ];
var b1 = [ 4, 0 ];
var b2 = [ 9, 4 ];
console.log(lineLineIntersection(a1, a2, b1, b2));
console.log(lineLineIntersection(a1, a2, b1, b2, false, true));
console.log(lineLineIntersection(a1, a2, b1, b2, true, false));

*/


/**
 * Segment-segment intersection
 *
 * @param line a1 = [ x1, y1]}
 * @param line a2 = [ x2, y2]}
 * @param line b1 = [ x3, y3]}
 * @param line b2 = [ x4, y4]}
 * @returns Intersection point [x, y] or null if the segments doesn't intersect
 */
function segmentSegmentIntersection( [ x1, y1 ], [ x2, y2 ], [ x3, y3 ], [ x4, y4 ]  ) {
	return lineLineIntersection( [ x1, y1 ], [ x2, y2 ], [ x3, y3 ], [ x4, y4 ], true, true);   
}