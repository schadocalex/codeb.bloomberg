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
 * _min([1, 2, 3, 4]) // 1
 * _min([{val: 1}, {val: 2}, {val: 3}, {val: 4}], "val") // {val: 1}
 *
 * @param {*[]|Set} arr - The first array
 * @param {string} prop - The property shorthand
 * @returns {*}
 */
function _min(arr, prop) {
    let min = null;
    for(let el of arr) {
        if(min === null || (!prop ? el < prop : el[prop] < min[prop])) {
            min = el;
        }
    }
    return min;
}

/**
 * Get the maximum value of an array. If prop is defined, get the maximum value by the prop.
 * Usage:
 * _max([1, 2, 3, 4]) // 4
 * _max([{val: 1}, {val: 2}, {val: 3}, {val: 4}], "val") // {val: 4}
 *
 * @param {*[]|Set} arr - The first array
 * @param {string} prop - The property shorthand
 * @returns {*}
 */
function _max(arr, prop) {
    let max = null;
    for(let el of arr) {
        if(max === null || (!prop ? el > prop : el[prop] > max[prop])) {
            max = el;
        }
    }
    return max;
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


Set.prototype.first = function() {
    return this.values().next().value;
};

Set.prototype.pop = function() {
    let el = this.first();
    this.delete(el);
    return el;
};
Set.prototype.shift = Set.prototype.pop;

Set.prototype.map = function(fn) {
    let arr = [];
    this.forEach((el) => arr.push(fn(el)));
    return arr;
};

Map.prototype.first = Set.prototype.first;
Map.prototype.pop = Set.prototype.pop;
Map.prototype.shift = Set.prototype.pop;
Map.prototype.map = Set.prototype.map;

//////////////// end of shortcuts /////////////////
///////////////////////////////////////////////////