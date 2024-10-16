function seedRandom(seed) {
    return function() {
        // Utiliza un generador de números pseudoaleatorios (PRNG) simple
        seed = (seed * 48271) % 2147483647; // Generador de números aleatorios basado en la semilla
        return (seed - 1) / 2147483646; // Normaliza a rango [0, 1)
    }
}

function generarOperaciones(p, n, seed) {
    const operaciones = [];
    const symbolTable = {}; // Almacena punteros activos por proceso (pid)
    const procesosActivos = new Set(); // PIDs con al menos un 'new'
    const procesosTerminados = new Set(); // PIDs que recibieron 'kill'
    const punterosEliminados = new Set(); // Punteros que ya fueron eliminados
    let punteroGlobal = 0; // Contador global de punteros

    let totalOperaciones = 0;
    const random = seedRandom(seed); // Inicializa el generador con la semilla

    // Inicializamos estructuras para cada proceso
    for (let i = 1; i <= p; i++) {
        symbolTable[i] = [];
    }

    function agregarOperacion(op) {
        operaciones.push(op);
        totalOperaciones++;
    }

    function generarNew(pid) {
        if (procesosTerminados.has(pid)) return; // No se puede hacer 'new' si el proceso está terminado

        const size = Math.floor(random() * 1000) + 1; // Generar tamaño aleatorio
        const ptr = punteroGlobal++; // Asignar un nuevo puntero único

        symbolTable[pid].push(ptr); // Agregar puntero a la tabla del proceso
        procesosActivos.add(pid); // Marca como proceso activo

        agregarOperacion(`new(${pid}, ${size})`);
    }

    function generarUse(ptr) {
        if (punterosEliminados.has(ptr)) return; // No se puede usar un puntero eliminado
        agregarOperacion(`use(${ptr})`);
    }

    function generarDelete(pid) {
        const punteros = symbolTable[pid].filter(ptr => !punterosEliminados.has(ptr));
        if (punteros.length > 0) {
            const ptr = punteros.shift(); // Elimina el primer puntero disponible
            punterosEliminados.add(ptr); // Marca el puntero como eliminado
            agregarOperacion(`delete(${ptr})`);
        }
    }

    function generarKill(pid) {
        if (procesosTerminados.has(pid)) return; // No se puede matar un proceso ya terminado

        agregarOperacion(`kill(${pid})`);
        procesosTerminados.add(pid); // Marca el proceso como terminado
        procesosActivos.delete(pid); // Elimina de procesos activos
        symbolTable[pid] = []; // Limpia todos los punteros del proceso
    }

    // Generar al menos un 'new' inicial para cada proceso
    for (let i = 1; i <= p; i++) {
        generarNew(i);
    }

    // Generar operaciones mientras haya procesos activos y no superemos el límite
    while (totalOperaciones < n && procesosActivos.size > 0) {
        const pid = Array.from(procesosActivos)[Math.floor(random() * procesosActivos.size)];
        const op = random();

        if (op < 0.4) { // 40% probabilidad de 'new'
            generarNew(pid);
        } else if (op < 0.8) { // 40% probabilidad de 'use'
            const punteros = symbolTable[pid].filter(ptr => !punterosEliminados.has(ptr));
            if (punteros.length > 0) {
                const ptr = punteros[Math.floor(random() * punteros.length)];
                generarUse(ptr);
            }
        } else if (op < 0.95) { // 15% probabilidad de 'delete'
            // Reducción de delete: solo se ejecuta si hay punteros
            if (symbolTable[pid].length > 0) {
                generarDelete(pid);
            }
        } else if (random() < 0.005 && symbolTable[pid].length > 0) { // 0.5% probabilidad de 'kill'
            generarKill(pid);
        }
    }

    // Asegura que todos los procesos activos terminen con 'kill'
    for (const pid of procesosActivos) {
        generarKill(pid);
    }

    console.log("Operaciones generadas:", operaciones.join(':'));
    alert("HECHO");
    return operaciones.join(':');
}

function newP(mmu, pid, size){
    console.log("llamada a new")
    console.log("pid = " +pid)
    console.log("size = " + size)
    
    mmu.new(pid,size);
    
    // console.log(JSON.parse(JSON.stringify(mmu)));
}

function use(mmu, ptr){
    console.log("llamada a use")
    console.log("ptr = " + ptr)

    mmu.use(ptr);
    // console.log(JSON.parse(JSON.stringify(mmu)));
}

function deleteP(mmu, ptr){
    console.log("llamada a delete")
    console.log("ptr = "+ ptr)

    mmu.delete(+ptr);
    // console.log(JSON.parse(JSON.stringify(mmu)));
}

function kill(mmu, pid){
    console.log("llamada a kill")
    console.log("pid = " + pid )
   
    mmu.kill(+pid);
    // console.log(JSON.parse(JSON.stringify(mmu)));
}