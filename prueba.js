
class Random {
    constructor(seed) {
        this.seed = seed;
    }

    random(min, max) {
        // Generador de congruencia lineal
        this.seed = (this.seed * 48271) % 2147483647;
        return Math.floor((this.seed / 2147483647)*(max-min+1)) + min; // Devuelve un número entre 0 y 1
    }
}

class PTR {
    constructor(pid,size){
        this.pid = pid;
        this.size = size;
    }

}

class PAGE {
    constructor(id, pointer, flag, mark, pSize){
        this.idPage = id;
        this.pointerPage = pointer;
        this.flag = flag; // 0-FISICA / 1-VIRTUAL
        this.mark = mark;
        this.timestamp = 0;
        this.pagePTRSize = pSize;
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
    constructor(algorithm, seed){
        this.memoryMap = [];
        this.symbolTable = [];
        this.ram = 0; // 400 KB
        this.vram = 0;
        this.paginas = 0;
        this.realPages = 0;
        this.thrashing =0;
        this.fragmentation = 0;
        this.clock = 0;
        this.algorithm = algorithm;
        this.tablaPaginasFisicas = [];
        this.pagesForOPT = [];
        this.ptrid = 0;

        this.randomGenerator = new Random(seed);
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
        return this.ptrid++;
    }
    /* Solicita nueva memoria de tamaño size en B y recibe de
    vuelta la dirección del puntero lógico (ptr)
    */
    
    new(pid, size){
        let flag = 1;
        let newPTR = new PTR(this.generarPID(),size);
        //console.log(pid)
        this.symbolTable.forEach(element => {
            //console.log(element[0])
            //console.log(pid)
            if(element[0]==pid){
                element[1].push(newPTR);
                flag = 0;
            }
        });
        if(flag){
            this.symbolTable.push([pid, [newPTR]]);
            console.log("Process not Found");
            
        }
        
        
        let nmMap = [newPTR.pid, []];
        this.memoryMap.push(nmMap);
        let pageSize = size;
        let newPagina;
        for (let i = 0; i< Math.ceil(size/4096); i++){
            if (pageSize >= 4096){
                newPagina = new PAGE(this.paginas, this.assignSegment(this.paginas, newPTR.pid, 4096, pid), 0, this.setMark(), 4096);
                pageSize -= 4096;
            }else{
                newPagina = new PAGE(this.paginas, this.assignSegment(this.paginas, newPTR.pid, pageSize, pid), 0, this.setMark(), pageSize);
            }
            this.memoryMap[this.memoryMap.length-1][1].push(newPagina);
            this.paginas++;
            this.simulationInformation(newPagina, pid);
        }
        return newPTR;
    }

    use(ptr){
        let flag = 0;
        let processId;
        this.symbolTable.forEach(element =>{
            element[1].forEach(pointer =>{
                console.log(pointer);
                if (pointer.pid == ptr){
                    flag = 1;
                    processId = element[0];
                }
            });
        });
        
        if (flag){
            this.memoryMap.forEach(element =>{
                if (element[0]== ptr){
                    if(this.algorithm==5){
                        for (let i = 0; i < element[1].length; i++) {
                            console.log(this.pagesForOPT);
                            this.pagesForOPT.shift();
                            console.log(this.pagesForOPT);
                        }
                    }
                    element[1].forEach(page =>{
                        this.simulationInformation(page, processId);
                        if (page.flag){
                            let replaceFlag = 1;
                            for (let i = 0; i < this.tablaPaginasFisicas.length; i++){
                                if (this.tablaPaginasFisicas[i] == -1){
                                    this.tablaPaginasFisicas[i] = page.idPage;
                                    page.pointerPage = i;
                                    page.flag = 0;
                                    replaceFlag = 0;
                                    this.realPages++;
                                    this.hit();
                                    this.runMRUClock(ptr);
                                    if(this.algorithm!=5){
                                        this.pagesForOPT.push(page.idPage);
                                    }
                                    break;
                                }
                            }
                            if (replaceFlag){
                                page.pointerPage = this.replaceAlgorithm(page.idPage, ptr);
                                this.miss();
                            }
                        }else{
                            //SC
                            if (this.algorithm == 2){
                                page.mark = 1;
                            }
                            if(this.algorithm!=5){
                                this.pagesForOPT.push(page.idPage);
                            }
                            this.runMRUClock(ptr);
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
                    if (page.flag == 0){
                        this.tablaPaginasFisicas[page.pointerPage] = -1;
                        this.realPages--;
                    }
                    
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
        this.runMRUClock(-1);
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
                    console.log(this.tablaPaginasFisicas);
                    this.delete(ptr.pid);
                    
                });
                
            }
        });

        this.symbolTable = listaSimbolos.filter(element => element[0] !== pid);
        this.runMRUClock(-1);
        // deletedPIDS.push(pid);
    }
    setMark(){
        //FIFO
        if (this.algorithm == 1){
            return 0;
        }
        //SC
        if (this.algorithm == 2){
            return 1;
        }
        //MRU
        if (this.algorithm == 3){
            return 0;
        }
        //RND
        if (this.algorithm == 4){
            return 0;
        }
        //OPT
        if (this.algorithm == 5){
            return 0;
        }
    }
    runMRUClock(ptr){
        this.tablaPaginasFisicas.forEach(pageS=>{
            for(let i =0; i < this.memoryMap.length; i++){
                this.memoryMap[i][1].forEach(page =>{
                    if (pageS == page.idPage){
                        if (this.memoryMap[i][0] != ptr){
                            page.timestamp++;
                        }else{
                            page.timestamp = 0;
                        }
                    }
                });
            }
        });
    }
    //funcion que asigna la direccion inicial de memoria de la pagina
    //esta direccion depende si hay espacio en memoreal si no replaceAlgorithm
    assignSegment(pageIdentifier, ptrIdentifier, pageSize){
        if (this.paginas < 4){
            this.realPages++;
            this.tablaPaginasFisicas.push(pageIdentifier);
            console.log(pageIdentifier);
            this.hit();
            if(this.algorithm!=5){
                this.pagesForOPT.push(pageIdentifier);
            }
            if(this.algorithm==5){
                this.pagesForOPT.shift();
            }
            this.runMRUClock(ptrIdentifier);
            this.ram += pageSize;
            //this.simulationInformation(newPagina, ptr);
            return this.paginas;
        }else{
            if (this.realPages < 4){
                console.log(pageIdentifier);
                for (let i = 0; i< this.tablaPaginasFisicas.length;i++){
                    if (this.tablaPaginasFisicas[i] == -1){
                        this.tablaPaginasFisicas[i] = pageIdentifier;
                        this.realPages++;
                        this.runMRUClock(ptrIdentifier);
                        this.hit();
                        this.ram += pageSize;
                        if(this.algorithm!=5){
                            this.pagesForOPT.push(pageIdentifier);
                        }
                        if(this.algorithm==5){
                            this.pagesForOPT.shift();
                        }
                        return i;
                    }
                }
            }else{
            //la memoria virtual esta llena por lo que se necesita el algoritmo de ramplazo
                this.miss();
                return this.replaceAlgorithm(pageIdentifier, ptrIdentifier, pageSize);
            }
        }

    }

    replaceAlgorithm(pagetoPlace, ptrOfPage, pageSize = 0){
        if(this.algorithm!=5){
            this.pagesForOPT.push(pagetoPlace);
        }
        //FIFO
        if (this.algorithm==1){
            let done = 1;
            let pageReplaced;
            while (done){
                pageReplaced = this.tablaPaginasFisicas.shift();
                this.memoryMap.forEach(element =>{
                    element[1].forEach(page =>{
                        if(page.idPage == pageReplaced ){
                            if(element[0] == ptrOfPage){
                                this.tablaPaginasFisicas.push(pageReplaced);
                            }else{
                                done =  0;
                            }
                        }
                    
                    });
                });
            }
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
            let pageRSize;
            let pagePSize;
            this.memoryMap.forEach(element =>{
                element[1].forEach(page =>{
                    if(page.idPage == pageReplaced){
                        pageRSize = page.pagePTRSize;
                    }
                    if (page.idPage == pagetoPlace){
                        pagePSize = page.pagePTRSize;
                    }
                });
            });
            this.ram += (pageSize == 0 ? pagePSize - pageRSize : pageSize - pageRSize);
            this.vram += (pageSize == 0 ? pageRSize - pagePSize : pageRSize);
            let segmentpos = this.tablaPaginasFisicas.length;
            this.tablaPaginasFisicas.push(pagetoPlace);
            this.runMRUClock(ptrOfPage);
            return segmentpos;
        }
        //SC
        if (this.algorithm==2){
            let pageReplaced;
            let segmentpos;
            let pageRSize;
            let pagePSize;
            let done = 1;
            while(done){
                pageReplaced = this.tablaPaginasFisicas.shift();
                this.memoryMap.forEach(element =>{
                    element[1].forEach(page =>{
                        if(pageReplaced == page.idPage){
                            if(page.mark){
                                if (element[0] != ptrOfPage){
                                    page.mark = 0;
                                }
                                this.tablaPaginasFisicas.push(page.idPage);
                            }else{                                
                                this.tablaPaginasFisicas.push(pagetoPlace);
                                done = 0;
                            }
                        }            
                    });
                });
            }
            for (let i = 0; i < this.tablaPaginasFisicas.length;i++){
                this.memoryMap.forEach(element =>{
                    element[1].forEach(page =>{
                        if (page.idPage == this.tablaPaginasFisicas[i]){
                            page.pointerPage = i;
                        }
                        if (page.idPage == pageReplaced){
                            pageRSize = page.pagePTRSize;
                            page.flag = 1;
                            page.pointerPage = (page.idPage*-1)-1;
                            page.mark = 1;
                        }
                        if (page.idPage == pagetoPlace){
                            pagePSize = page.pagePTRSize;
                            page.flag = 0;
                        }
                    });
                });
                if (this.tablaPaginasFisicas[i] == pagetoPlace){
                    segmentpos = i;

                }
            }
            this.ram += (pageSize == 0 ? pagePSize - pageRSize : pageSize - pageRSize);
            this.vram += (pageSize == 0 ? pageRSize - pagePSize : pageRSize);
            this.runMRUClock(ptrOfPage);
            return segmentpos;
        }
        //MRU
        if (this.algorithm==3){
            let pageRSize;
            let pagePSize;
            let segmentpos = -1;
            let recent = 1000;
            let pageReplaced;
            for (let i = 0; i<this.tablaPaginasFisicas.length; i++){
                for(let element of this.memoryMap){
                    if (element[0] != ptrOfPage){
                        element[1].forEach(page =>{
                            if (this.tablaPaginasFisicas[i] == page.idPage && page.timestamp < recent){
                                segmentpos = i;
                                recent = page.timestamp;
                                pageReplaced = this.tablaPaginasFisicas[i];
                            }
                        });
                    }
                }
            }
            this.tablaPaginasFisicas[segmentpos] = pagetoPlace;
            for(let element of this.memoryMap){
                element[1].forEach(page =>{
                    if (page.idPage == pagetoPlace){
                        pagePSize = page.pagePTRSize;
                        page.flag = 0;
                    }
                    if(page.idPage == pageReplaced){
                        pageRSize = page.pagePTRSize;
                        page.flag = 1;
                        page.pointerPage = (page.idPage*-1)-1;
                    }
                });
                
            }
            this.ram += (pageSize == 0 ? pagePSize - pageRSize : pageSize - pageRSize);
            this.vram += (pageSize == 0 ? pageRSize - pagePSize : pageRSize);
            this.runMRUClock(ptrOfPage);
            return segmentpos;
        }
        //RND
        //-----------------------------------------------------------------------------------------
        if (this.algorithm==4){
            let pageRSize;
            let pagePSize;
            let segmentpos;
            let pageReplaced;
            let done = 1;
            while(done){
                let replaceFlag = 1;
                segmentpos = this.randomGenerator.random(0, this.tablaPaginasFisicas.length-1);
                console.log(segmentpos);
                pageReplaced = this.tablaPaginasFisicas[segmentpos];
                for(let element of this.memoryMap){
                    element[1].forEach(page =>{
                        if (page.idPage == pageReplaced){
                            if(element[0] == ptrOfPage){
                                replaceFlag = 0;       6
                            }
                        }
                    });
                }
                if (replaceFlag){
                    done = 0;
                }    
            }
            this.tablaPaginasFisicas[segmentpos] = pagetoPlace;
            for(let element of this.memoryMap){
                element[1].forEach(page =>{
                    if (page.idPage == pagetoPlace){
                        pagePSize = page.pagePTRSize;
                        page.flag = 0;
                    }
                    if(page.idPage == pageReplaced){
                        pageRSize = page.pagePTRSize;
                        page.flag = 1;
                        page.pointerPage = (page.idPage*-1)-1;
                    }
                });
                
            }
            this.ram += (pageSize == 0 ? pagePSize - pageRSize : pageSize - pageRSize);
            this.vram += (pageSize == 0 ? pageRSize - pagePSize : pageRSize);
            this.runMRUClock(ptrOfPage);
            return segmentpos;
        }
        //----------------------------------------------------------
        //OPT
        if (this.algorithm==5){
            let pageToPlace = this.pagesForOPT.shift();  // Página a colocar
            let pageToReplace = -1;  // Índice de la página que será reemplazada
            let farthestUse = -1;    // Índice más lejano de reutilización

            // Buscar la página que será reemplazada en tablaPaginasFisicas
            this.tablaPaginasFisicas.forEach((idPage, index) => {
                let futureIndex = this.pagesForOPT.indexOf(idPage);  // Próxima aparición del ID

                if (futureIndex === -1) {
                    // Si la página no se usará más, marcar para reemplazo inmediato
                    pageToReplace = index;
                    farthestUse = Infinity;  // Priorizar esta página para reemplazo
                } else if (futureIndex > farthestUse) {
                    // Encontrar la página cuyo uso está más lejos en el futuro
                    farthestUse = futureIndex;
                    pageToReplace = index;
                }
            });

            // Realizar el reemplazo en tablaPaginasFisicas
            let replacedPage = this.tablaPaginasFisicas[pageToReplace];
            this.tablaPaginasFisicas[pageToReplace] = pageToPlace;

            // Actualizar el memoryMap para reflejar el reemplazo
            this.memoryMap.forEach(segment => {
                segment[1].forEach(page => {
                    if (page.idPage == replacedPage) {
                        // Marcar la página reemplazada como inactiva
                        page.flag = 1;
                        page.pointerPage = (page.idPage * -1) - 1;
                    }
                    if (page.idPage == pageToPlace) {
                        // Marcar la nueva página como activa
                        page.flag = 0;
                    }
                });
            });

            console.log(`Página colocada: ${pageToPlace}, Página reemplazada: ${replacedPage}`);
            return pageToReplace;  // Retornar la posición del segmento afectado
        }
    }
    simulationInformation(page, ptr){
        let a = [];
        a.push([page.idPage, ptr, page.flag?"":"x", page.flag?"_":page.pointerPage, page.flag?page.pointerPage:"_", 
            (this.algorithm== 2||this.algorithm==3)?(this.algorithm==2?page.mark:page.timestamp):" "]);
        
        a.push([this.symbolTable.length, this.clock, this.ram, parseFloat(((this.ram/409600)*100).toFixed(1)), 
            this.vram, parseFloat(((this.vram/this.ram)*100).toFixed(1)), 
            this.thrashing, parseFloat(((this.thrashing/this.clock)*100).toFixed(1))]);
        console.log (a);
    }
    
}



// Ejemplo de uso:
let newMMU = new MMU(1, 6234);
newMMU.new(1,5096);
console.log(newMMU.tablaPaginasFisicas);
console.log(newMMU.memoryMap);
console.log(newMMU.ram);
console.log(newMMU.vram);
newMMU.new(2,5000);
console.log(newMMU.tablaPaginasFisicas);
console.log(newMMU.memoryMap);
console.log(newMMU.ram);
console.log(newMMU.vram);
newMMU.new(1,2500);
console.log(newMMU.tablaPaginasFisicas);
console.log(newMMU.memoryMap);
console.log(newMMU.ram);
console.log(newMMU.clock);
newMMU.use(0);
console.log(newMMU.tablaPaginasFisicas);
console.log(newMMU.memoryMap);
console.log(newMMU.ram);
console.log(newMMU.clock);
newMMU.new(1,8006);
console.log(newMMU.tablaPaginasFisicas);
console.log(newMMU.memoryMap);
console.log(newMMU.ram);
console.log(newMMU.vram);

/*newMMU.new(1,250);
console.log(newMMU.tablaPaginasFisicas);
console.log(newMMU.memoryMap);

newMMU.use(1);
console.log(newMMU.tablaPaginasFisicas);
console.log(newMMU.memoryMap);
newMMU.new(1,250);
console.log(newMMU.tablaPaginasFisicas);
console.log(newMMU.memoryMap);
newMMU.delete(1);
console.log(newMMU.tablaPaginasFisicas);
console.log(newMMU.memoryMap);
newMMU.new(1,250);
console.log(newMMU.tablaPaginasFisicas);
console.log(newMMU.memoryMap);
newMMU.use(1);
console.log(newMMU.tablaPaginasFisicas);
console.log(newMMU.memoryMap);
newMMU.use(2);
console.log(newMMU.tablaPaginasFisicas);
console.log(newMMU.memoryMap);
console.log(newMMU.thrashing);*/

let newMMU2 = new MMU(5);
newMMU2.symbolTable.push([1, []]);
newMMU2.pagesForOPT = newMMU.pagesForOPT;
console.log(newMMU2.pagesForOPT)
newMMU2.new(1,250);
console.log(newMMU2.tablaPaginasFisicas);
console.log(newMMU2.memoryMap);
newMMU2.new(1,500);
console.log(newMMU2.tablaPaginasFisicas);
console.log(newMMU2.memoryMap);
newMMU2.new(1,250);
console.log(newMMU2.tablaPaginasFisicas);
console.log(newMMU2.memoryMap);
newMMU2.new(1,500);
console.log(newMMU2.tablaPaginasFisicas);
console.log(newMMU2.memoryMap);
console.log(newMMU2.clock);
// newMMU.new(1,50);
// newMMU.new(2,5320);
// newMMU.new(3,345);
// newMMU.use(1);
// newMMU.use(3);
// newMMU.use(2);
// newMMU.use(1);
//console.log(newMMU.memoryMap);
//console.log(newMMU.tablaPaginasFisicas);
//newMMU.delete(1);
//newMMU.kill(1);
//newMMU.kill(2);
//newMMU.kill(3);
//console.log(newMMU);

