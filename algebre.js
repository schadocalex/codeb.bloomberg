/**
 * https://fr.wikipedia.org/wiki/Algorithme_d%27Euclide_%C3%A9tendu#L.27algorithme
 *
 * Extended Euclidean algorithm
 *
 * @param a
 * @param b
 * @returns Array [r, u, v] such as r = pgcd(a, b), r = a * u + b * v
 */
function euclid(a, b) {
    let [r, u, v, rp, up, vp] = [a, 1, 0, b, 0, 1];
    let q; // integer

    while(rp !== 0) {
        q = Math.floor(r / rp);
        [r, u, v, rp, up, vp] = [rp, up, vp, r - q *rp, u - q*up, v - q*vp];
    }

    return [r, u, v];
}
