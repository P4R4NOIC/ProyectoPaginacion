let itPid = 0;

class PTR {
    constructor(pid,size){
        this.pid = pid;
        this.size = size;
    }

}

class PAGE {
    constructor(id, pointer, flag){
        this.idPage = id;
        this.pointerPage = pointer;
        this.flag = flag; // 0-FISICA / 1-VIRTUAL
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
        this.tablaPaginasFisicas = [];
        this.tablaPaginasVirtuales = [];
    }

    generarPID(){
        return itPid++;
    }
    /* Solicita nueva memoria de tamaño size en B y recibe de
    vuelta la dirección del puntero lógico (ptr)
    */
    

    new(pid, size){
        let flag = 1;
        let newPTR = new PTR(pid,size);
        console.log(pid)
        this.symbolTable.forEach(element => {
            console.log(element[0])
            console.log(pid)
            if(element[0]==pid){
                element[0].push([newPTR]);
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
        

        //let newPagina = new PAGE(this.paginas, tablaPaginasFisicas.length, 0);
        //this.paginas++;

        //this.tablaPaginasFisicas.push(newPagina.idPage);
        /*this.memoryMap.forEach(element => {
            console.log(element[0]);
            console.log();
            if(element[0]==pid){
                element[0].push([newPTR]);
                flag = 0;
            }
        });*/
        //this.memoryMap.push()
        //symbol.push(newPagina);
        //this.memoryMap.push(symbol);
    
        return newPTR;
    }

    use(PTR){
        for (let i = 0; i < this.memoryMap.length; i++) {
            if(this.memoryMap[i][0] == PTR){
                //console.log("PUNTERO "+PTR+" USADO");
            }
            
        }
    }

    delete(PTR){
        for (let i = 0; i < this.memoryMap.length; i++) {
            if(this.memoryMap[i][0] == PTR){
                this.memoryMap.splice(i,1);
                //console.log("PUNTERO "+PTR+" ELIMINADO");
            }
        }
    }

    kill(pid){
        for (let i = 0; i < this.memoryMap.length; i++) {
            // if(this.tabla[i][1].pid == pid){
            //     this.tabla.splice(i,1);
            //     console.log("PUNTERO "+pid+" MATADO");
            // }
        }
    }
}

// Ejemplo de uso:
let newMMU = new MMU();
newMMU.new(1,250);
newMMU.new(1,50);
newMMU.new(2,5320);
newMMU.new(3,345);
newMMU.use(1);
newMMU.use(3);
newMMU.use(2);
newMMU.use(1);
//console.log(newMMU);
newMMU.delete(1);
newMMU.kill(1);
newMMU.kill(2);
newMMU.kill(3);
console.log(newMMU);
