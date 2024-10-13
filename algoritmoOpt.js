let fr = [];
let hit = 0;
let miss = 0;
function search(key, fr) {
    for (let i = 0; i < fr.length; i++) {
        if (fr[i] === key) {
            return true;
        }
    }
    return false;
}

function predict(pg, fr) {
    let res = -1, farthest = -1;

    // Predecir qué página será reemplazada
    for (let i = 0; i < fr.length; i++) {
        let j;
        for (j = 0; j < pg.length; j++) {
            if (fr[i] === pg[j]) {
                if (j > farthest) {
                    farthest = j;
                    res = i;
                }
                break;
            }
        }
        // Si la página no se usará de nuevo, devolver su posición
        if (j === pg.length) return i;
    }

    // Devolver la posición más lejana o la primera por defecto
    return (res === -1) ? 0 : res;
}

function optimalPage(pg, fn) {
    if (pg.length === 0) {
        console.log("No. of hits = " + hit);
        console.log("No. of misses = " + miss);
        console.log("Clock",hit+5*miss);
        return;
    }

    let currentPage = pg[0];  // Tomar la primera página sin eliminarla

    if (search(currentPage, fr)) {
        hit++;  // HIT: La página ya está en los marcos
    } else {
        if (fr.length < fn) {
            fr.push(currentPage);  // Agregar la página si hay espacio
            hit++;  // Considerar esto también como un HIT
        } else {
            miss++;
            let j = predict(pg.slice(1), fr);  // Predecir cuál reemplazar
            fr[j] = currentPage;  // Reemplazar la página predicha
        }
    }

    console.log(`Página: ${currentPage} | Estado de marcos:`, fr);

    pg.shift();  // Eliminar la primera página después de procesarla
}

let pg = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2];
pg = [ 0, 1, 2, 3, 4, 5, 6, 0, 3, 4 ];
let fn = 4;

// Llamas a optimalPage() tantas veces como iteraciones quieras
optimalPage(pg, fn);  // Primera iteración
optimalPage(pg, fn);  // Segunda iteración
optimalPage(pg, fn);
optimalPage(pg, fn);
optimalPage(pg, fn);
optimalPage(pg, fn);
optimalPage(pg, fn);
optimalPage(pg, fn);
optimalPage(pg, fn);
optimalPage(pg, fn);
optimalPage(pg, fn);
