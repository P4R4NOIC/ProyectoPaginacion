let ptrid = 0;

class PTR {
    constructor(pid,size){
        this.pid = pid;
        this.size = size;
    }

}

class PAGE {
    constructor(id, pointer, flag, mark){
        this.idPage = id;
        this.pointerPage = pointer;
        this.flag = flag; // 0-FISICA / 1-VIRTUAL
        this.mark = mark;
    }
}
/*ts = [{"3":[PTR, PTR]}]
    1, PTR  ,
    2, PTR, PTR

    PTR: 1, 240 
    PTR: 2, 345
    PTR: 3, 546

      new (2, 240); PTR1
      new(1, 345); PTR2
      new (2, 546); PTR3
*/
//mp = [ptr1:[page, page], ptr2:[page, page]]

// [pid, [PTR, PTR]] id del Proceso y punteros
// ts = [[1, [PTR, PTR]], [2, [PTR, PTR]]] 

//[ptr.pid, [PAGE, PAGE]] id del puntero y paginas
// memoryMap = [[1, [PAGE, PAGE]], [2, [PAGE, PAGE]]] 


class MMU {
    constructor(algorithm){
        this.memoryMap = [];
        this.symbolTable = [];
        this.ram = 409600; // 400 KB
        this.paginas = 0;
        this.realPages = 0;
        this.thrashing =0;
        this.fragmentation = 0;
        this.clock = 0;
        this.algorithm = algorithm;
        this.tablaPaginasFisicas = [];

        /*let pnt = new PTR(1,250);
        let pnt2 = new PTR(2,50);
        let pnt3 = new PTR(3,5320);
        let pnt4 = new PTR(4,345);
        this.symbolTable.push([1, [pnt, pnt2]]);
        this.symbolTable.push([2, [pnt3]]);
        this.symbolTable.push([3, [pnt4]]);

        let page = new PAGE(1,0,0);
        let page2 = new PAGE(1,1,0);
        let page3 = new PAGE(2,2,0);
        let page4 = new PAGE(3,3,0);
        

        this.memoryMap.push([1, [page, page2]]);
        this.memoryMap.push([2, [page3]]);
        this.memoryMap.push([3, [page4]]);*/
    }
    
    miss(){
        this.clock += 5;
        this.thrashing += 5;
    }
    hit(){
        this.clock++;
    }

    generarPID(){
        return ptrid++;
    }
    /* Solicita nueva memoria de tamaño size en B y recibe de
    vuelta la dirección del puntero lógico (ptr)
    */
    
    
    //---------------------------
    //ME FALTAN VARIAS COSAS
    //-----------------------------
    
    

    new(pid, size){
        let flag = 1;
        let newPTR = new PTR(this.generarPID(),size);
        //console.log(pid)
        this.symbolTable.forEach(element => {
            console.log(element[0])
            console.log(pid)
            if(element[0]==pid){
                element[1].push(newPTR);
                flag = 0;
            }
        });
        if(flag){
            console.log("Process not Found");
            return;
            /*
            let symbol = [];
            symbol.push(this.generarPID());
            symbol.push([newPTR]);
            this.symbolTable.push(symbol);*/
        }
        /*
        this.memoryMap.forEach(element => {
            console.log(element[0]);
            if(element[0]== newPTR.pid){
                for (let i = 0; i< Math.ceil(size/pageSize); i++){
                    let newPagina = new PAGE(this.paginas, this.assignSegment(this.paginas), 0);
                    this.pagesForOPT.push(this.paginas);
                    this.paginas++;
                    this.realPages++;
                    element[1].push(newPagina);                        
                }
                flag = 0;
            }
        });*/
        
        let nmMap = [newPTR.pid, []];
        for (let i = 0; i< Math.ceil(size/400); i++){
            let newPagina = new PAGE(this.paginas, this.assignSegment(this.paginas), 0, 1);
            nmMap[1].push(newPagina);
            this.paginas++;
        }
        this.memoryMap.push(nmMap);
        
        
            
        
        /*
        
        
        //this.tablaPaginasFisicas.push(newPagina.idPage);
        
        
        //this.memoryMap.push()
        //symbol.push(newPagina);
        //this.memoryMap.push(symbol);
        */
        return newPTR;
    }

    use(ptr){
        let flag = 0;
        this.symbolTable.forEach(element =>{
            element[1].forEach(pointer =>{
                console.log(pointer[0]);
                if (pointer.pid == ptr){
                    flag = 1;
                }
            });
        });
        
        if (flag){
            this.memoryMap.forEach(element =>{
                if (element[0]== ptr){
                    element[1].forEach(page =>{
                        if (page.flag){
                            let replaceFlag = 1;
                            for (let i = 0; i < this.tablaPaginasFisicas.length; i++){
                                if (this.tablaPaginasFisicas[i] == -1){
                                    this.tablaPaginasFisicas[i] = page.idPage;
                                    page.pointerPage = i;
                                    page.flag = 0;
                                    replaceFlag = 0;
                                    this.realPages++;
                                    this.miss();
                                }
                            }
                            if (replaceFlag){
                                page.pointerPage = this.replaceAlgorithm(page.idPage);
                                this.miss();
                            }
                        }else{
                            this.hit();
                        }
                    });
                    return;
                }
            });
        }else{
            console.log("Pointer not found.")
        }
    }

    // elimina el ptr de la ts
    // eliminar toda las paginas del ptr y el ptr del memoMap
    // en la parte de creacion de operaciones este existira si existe un ptr en la ts
    delete(ptr){
        //update de dylan cambio en la tablaPaginasFisicas
        this.memoryMap.forEach(element =>{
            if (ptr == element[0]){
                element[1].forEach(page =>{
                    this.tablaPaginasFisicas[page.pointerPage] = -1;
                });   
            }
        });
        //-------------------------------------------------
        let lista = this.symbolTable;
        let mensaje = "No se encontro el puntero";
        lista.forEach(ptrList => {
            // Filtrar los punteros que no coinciden con el ptr pasado
            let originalLength = ptrList[1].length;
            ptrList[1] = ptrList[1].filter(pointer => pointer.pid !== ptr);
    
            // Si la longitud original es mayor que la nueva, significa que se eliminó un puntero
            if (originalLength > ptrList[1].length) {
                mensaje = "Puntero: " + ptr + " eliminado";
                let memoryMap = this.memoryMap;
                for (let i = 0; i < memoryMap.length; i++) {
                    if (memoryMap[i][0] == ptr) {
                        memoryMap.splice(i, 1); // Elimina el elemento en la posición i
                        console.log(`Elemento con ptr ${ptr} eliminado del memoryMap.`);
                        break; // Sale del bucle una vez que el elemento es eliminado
                    }
                }
            }
        });

        
        console.log(mensaje);
    }

    // elimina el proceso de la tabla de simbolos con sus respectivos ptr que a su ves deberan borrarse del memoMap con sus respectivas paginas
    // en la parte de creacion de operaciones este saldra solo una vez por pid y aparecer solo al final del proceso es decir no pueden haber operaciones con ese proceso despues de su kill
    // deletedPIDs.push(pid);
    kill(pid){
        let listaSimbolos = this.symbolTable;
        
        
        listaSimbolos.forEach(element => {
            if(element[0]==pid){
                element[1].forEach(ptr => {
                    this.delete(ptr.pid);
                });
                
            }
        });

        this.symbolTable = listaSimbolos.filter(element => element[0] !== pid);

        // deletedPIDS.push(pid);
    }

    replaceAlgorithm(pagetoPlace){
        //FIFO
        if (this.algorithm==1){
            let pageReplaced = this.tablaPaginasFisicas.shift();
            for (let i = 0; i < this.tablaPaginasFisicas.length;i++){
                this.memoryMap.forEach(element =>{
                    element[1].forEach(page =>{
                        if(page.idPage == this.tablaPaginasFisicas[i]){
                            page.pointerPage = i;
                        }
                        if(page.idPage == pageReplaced){
                            page.pointerPage = (page.idPage*-1)-1;
                            page.flag = 1;
                        }
                        if (page.idPage == pagetoPlace){
                            page.flag = 0;
                        }
                    });
                });
            }
            let segmentpos = this.tablaPaginasFisicas.length;
            this.tablaPaginasFisicas.push(pagetoPlace);
            return segmentpos;

            /*this.memoryMap.forEach(element =>{
                let pos = 0
                element[1].forEach(page => {
                    if (page.pointerPage == pos){
                        
                    }
                });
            });
            return this.memoryMap*/
            //return this.paginas;
        }
        //SC
        if (this.algorithm==2){
            let pageReplaced;
            let segmentpos;
            for (let i = 0; i < 4; i++){
                let done = 0;
                pageReplaced = this.tablaPaginasFisicas.shift();
                this.memoryMap.forEach(element =>{
                    element[1].forEach(page =>{
                        if(pageReplaced == page.idPage){
                            if(page.mark){
                                page.mark = 0;
                                this.tablaPaginasFisicas.push(page.idPage);
                            }else{
                                this.tablaPaginasFisicas.push(pagetoPlace);
                                done = 1;
                            }
                        }
                        
                    });
                });
                if (done){
                    break;
                }
            }
            for (let i = 0; i < this.tablaPaginasFisicas.length;i++){
                this.memoryMap.forEach(element =>{
                    element[1].forEach(page =>{
                        if (page.idPage == this.tablaPaginasFisicas[i]){
                            page.pointerPage = i;
                        }
                        if (page.idPage == pageReplaced){
                            page.flag = 1;
                            page.pointerPage = (page.idPage*-1)-1;
                            page.mark = 1;
                        }
                        if (page.idPage == pagetoPlace){
                            page.flag = 0;
                            page.mark = 1;
                            segmentpos = i;

                        }
                    });
                });
            }
            return segmentpos;
        }
        //MRU
        if (this.algorithm==3){
            return this.paginas;
        }
        //RND
        if (this.algorithm==4){
            return this.paginas;
        }
        //OPT
        if (this.algorithm==5){
            return this.paginas;
        }
    }
    
    //funcion que asigna la direccion inicial de memoria de la pagina
    //esta direccion depende si hay espacio en memoreal si no replaceAlgorithm
    assignSegment(pageIdentifier){
        if (this.paginas < 4){
            this.realPages++;
            this.tablaPaginasFisicas.push(pageIdentifier);
            this.hit();
            return this.paginas;
        }else{
            if (this.realPages < 4){
                for (let i = 0; i< this.tablaPaginasFisicas.length;i++){
                    if (this.tablaPaginasFisicas[i] == -1){
                        this.tablaPaginasFisicas[i] = pageIdentifier;
                        this.realPages++;
                        this.hit();
                        return i;
                    }
                }
            }else{
            //la memoria virtual esta llena por lo que se necesita el algoritmo de ramplazo
                this.miss();
                return this.replaceAlgorithm(pageIdentifier);
            }
        }

    }

    // Function to check whether a page exists
    // in a frame or not
    search(key, fr) {
        for (let i = 0; i < fr.length; i++) {
            if (fr[i] === key) {
                return true;
            }
        }
        return false;
    }

    // Function to find the frame that will not be used
    // recently in future after given index in pg[0..pn-1]
    predict(pg, fr, pn, index) {
        // Store the index of pages which are going
        // to be used recently in future
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

            // If a page is never referenced in future,
            // return it.
            if (j === pn) {
                return i;
            }
        }

        // If all of the frames were not in future,
        // return any of them, we return 0. Otherwise
        // we return res.
        return (res === -1) ? 0 : res;
    }

    optimalPage() {
        let pg = this.pagesForOPT;
        let pn = pg.length;
        let fn = 100;
        
        // Create an array for given number of
        // frames and initialize it as empty.
        let fr = [];

        // Traverse through page reference array
        // and check for miss and hit.
        let hit = 0;
        for (let i = 0; i < pn; i++) {

            // Page found in a frame : HIT
            if (this.search(pg[i], fr)) {
                hit++;
                continue;
            }

            // Page not found in a frame : MISS

            // If there is space available in frames.
            if (fr.length < fn) {
                fr.push(pg[i]);
            }

            // Find the page to be replaced.
            else {
                let j = this.predict(pg, fr, pn, i + 1);
                fr[j] = pg[i];
            }
        }
        console.log("No. of hits = " + hit);
        console.log("No. of misses = " + (pn - hit));
        
        //MISSES
        this.clock = 5*(pn-hit);
        this.thrashing = 5*(pn-hit);
    
        //HITS
        this.clock+= hit;

        console.log("Clock = " + this.clock);
        
    }

}


// Ejemplo de uso:
let newMMU = new MMU(2);
newMMU.symbolTable.push([1, []]);
newMMU.new(1,250);
console.log(newMMU.tablaPaginasFisicas);
newMMU.new(1,500);
console.log(newMMU.tablaPaginasFisicas);
newMMU.new(1,500);
console.log(newMMU.tablaPaginasFisicas);
newMMU.new(1,250);
console.log(newMMU.tablaPaginasFisicas);
newMMU.new(1,250);
console.log(newMMU.tablaPaginasFisicas);
newMMU.use(0);
console.log(newMMU.tablaPaginasFisicas);
newMMU.use(2);
console.log(newMMU.tablaPaginasFisicas);

// newMMU.new(1,50);
// newMMU.new(2,5320);
// newMMU.new(3,345);
// newMMU.use(1);
// newMMU.use(3);
// newMMU.use(2);
// newMMU.use(1);
console.log(newMMU.memoryMap);
console.log(newMMU.tablaPaginasFisicas);
//newMMU.delete(1);
//newMMU.kill(1);
//newMMU.kill(2);
//newMMU.kill(3);
console.log(newMMU);

