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
 * min([1, 2, 3, 4]) // 1
 * min([{val: 1}, {val: 2}, {val: 3}, {val: 4}], "val") // {val: 1}
 *
 * @param {*[]} arr - The first array
 * @param {*[]} prop - The property shorthand
 * @returns {*[]}
 */
function _min(arr, prop) {
    let min = null;
    for(let el of arr) {
        if(min === null || (prop != null ? el[prop] < min[prop] : el < prop)) {
            min = el;
        }
    }
    return min;
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

//////////////// end of shortcuts /////////////////
///////////////////////////////////////////////////