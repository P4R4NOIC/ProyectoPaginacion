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

class MMU {
    constructor(){
        this.memoryMap = [];
        this.symbolTable = [];
        this.ram = 409600; // 400 KB
        this.paginas = 0;
        this.thrashing =0;
        this.fragmentation = 0;
        this.clock = 0;
        this.algorithm = 0;
        this.tablaPaginasFisicas = [];

        let pnt = new PTR(1,250);
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
        this.memoryMap.push([3, [page4]]);
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
                element[1].push([newPTR]);
                flag = 0;
            }
        });
        if(flag){
            console.log("Process not Found");
            /*
            let symbol = [];
            symbol.push(this.generarPID());
            symbol.push([newPTR]);
            this.symbolTable.push(symbol);*/
        }
        
        this.memoryMap.forEach(element => {
            console.log(element[0]);
            if(element[0]== newPTR.pid){
                for (let i = 0; i< Math.ceil(size/pageSize); i++){
                    let newPagina = new PAGE(this.paginas, this.assignSegment(this.paginas), 0);
                    this.paginas++;
                    element[1].push(newPagina);                        
                }
                flag = 0;
            }
        });
        
        if(flag){
            let nmMap = [newPTR.pid, []];
            for (let i = 0; i< Math.ceil(size/400); i++){
                nmMap[1].push(newPagina);
            }
            this.memoryMap.push(nmMap);
        }
        
            
        
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
                            this.replaceAlgorithm(page);
                            this.miss();
                        }else{
                            this.hit();
                        }
                    });
                }
            });
        }
    }

    // elimina el ptr de la ts
    // eliminar toda las paginas del ptr y el ptr del memoMap
    // en la parte de creacion de operaciones este existira si existe un ptr en la ts
    delete(ptr){
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

    replaceAlgorithm(pagePlace){
        //FIFO
        if (this.algorithm==1){
            
            /*this.memoryMap.forEach(element =>{
                let pos = 0
                element[1].forEach(page => {
                    if (page.pointerPage == pos){
                        
                    }
                });
            });
            return this.memoryMap*/
            return this.paginas;
        }
        //SC
        if (this.algorithm==2){
            return this.paginas;
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
    assignSegment(){
        if (this.paginas < 100){
            return this.paginas;
        }else{
            //la memoria virtual esta llena por lo que se necesita el algoritmo de ramplazo
            return replaceAlgorithm();
        }

    }
}


// Ejemplo de uso:
let newMMU = new MMU();
// newMMU.new(1,250);
// newMMU.new(1,50);
// newMMU.new(2,5320);
// newMMU.new(3,345);
// newMMU.use(1);
// newMMU.use(3);
// newMMU.use(2);
// newMMU.use(1);
console.log(newMMU);
newMMU.delete(1);
newMMU.kill(1);
newMMU.kill(2);
newMMU.kill(3);
console.log(newMMU);
