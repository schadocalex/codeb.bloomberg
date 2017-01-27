/*INPUT
gwgwwgbwwwbgbwgwwbwwb
gggwwbwwgbwwwwgwwgwbbbwgwwwbgwwwb
OUTPUT
gggwwbwwgbwwwwgwwbbgbwgwwbwbb*/

const n = 4;

function f(x) {
	return !Array.isArray(x);
}

function unserialize(s) {
	return _unserialize(s, 0)[0];
}

function _unserialize(s, i = 0) {
	let res = [];
	for(; i < s.length; i++) {
		let c = s[i];
		if(c === 'g') {
			let [r,newI] = _unserialize(s, i + 1);
			res.push(r);
			i = newI;
		} else {
			res.push(c);
		}
		if(res.length === n) break;
	}
	return [res, i];
}

function serialize(arr) {
	let str = "";
	for(let c of arr) {
		str += f(c) ? c : 'g' + serialize(c);
	}
	return str;
}

function merge(t1, t2) {
	var res = [];
	for(let i = 0; i < t1.length; i++) {
		let el1 = t1[i];
		let el2 = t2[i];
		if(el1 === 'b' || el2 === 'b') {
			res.push('b');
		} else if(el1 === 'w') {
			res.push(el2);
		} else if(el2 === 'w') {
			res.push(el1);
		} else {
			res.push(merge(el1, el2));
		}
	}
	return optimize(res);
}

function optimize(t) {
	if(f(t)) return t;
	var res = t.map(optimize);
	return res.every(el => res.length > 1 && el === res[0]) ? res[0] : res;
}

let tree1 = unserialize("gwgwwgbwwwbgbwgwwbwwb");
let tree2 = unserialize("gggwwbwwgbwwwwgwwgwbbbwgwwwbgwwwb");
let tree3 = merge(tree1, tree2);
console.log("gggwwbwwgbwwwwgwwbbgbwgwwbwbb");
console.log(serialize(tree3));

let t = "gggbbbbgbbbbgbbbbgbbbbggbbbbgbbbbgbbbbgbbbbggbbbbgbbbbgbbbbgbbbbggbbbbgbbbbgbbbbgbbbb";
console.log(serialize(optimize(unserialize(t)))); // "b"
console.log(merge(tree2, unserialize("b")));