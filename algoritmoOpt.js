let fr = [];
let hit = 0;
let i = 0;  // Almacena la posición actual en el array de páginas

function search(key, fr) {
    for (let i = 0; i < fr.length; i++) {
        if (fr[i] === key) {
            return true;
        }
    }
    return false;
}

function predict(pg, fr, pn, index) {
    let res = -1, farthest = index;
    for (let i = 0; i < fr.length; i++) {
        let j;
        for (j = index; j < pn; j++) {
            if (fr[i] === pg[j]) {
                if (j > farthest) {
                    farthest = j;
                    res = i;
                }
                break;
            }
        }
        if (j === pn) {
            return i;
        }
    }
    return (res === -1) ? 0 : res;
}

function optimalPage(pg, pn, fn) {
    if (i >= pn) {
        console.log("No. of hits = " + hit);
        console.log("No. of misses = " + (pn - hit));
        return;
    }

    // Page found in a frame : HIT
    if (search(pg[i], fr)) {
        hit++;
    } else {
        // Page not found in a frame : MISS
        if (fr.length < fn) {
            fr.push(pg[i]);
        } else {
            let j = predict(pg, fr, pn, i + 1);
            fr[j] = pg[i];
        }
    }

    i++;  // Incrementar la posición para la siguiente iteración
    console.log(`Iteración ${i}: Estado de marcos = `, fr);
}

let pg = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2];
let pn = pg.length;
let fn = 3;

// Llamas a optimalPage() tantas veces como iteraciones quieras
optimalPage(pg, pn, fn);  // Primera iteración
optimalPage(pg, pn, fn);  // Segunda iteración
optimalPage(pg, pn, fn);
optimalPage(pg, pn, fn);
optimalPage(pg, pn, fn);
optimalPage(pg, pn, fn);
optimalPage(pg, pn, fn);
optimalPage(pg, pn, fn);
optimalPage(pg, pn, fn);
optimalPage(pg, pn, fn);
optimalPage(pg, pn, fn);
optimalPage(pg, pn, fn);
optimalPage(pg, pn, fn);
optimalPage(pg, pn, fn);

// Continúa llamando a optimalPage() en cada iteración
