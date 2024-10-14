function call(){
    console.log("se ha llamado a una funcion de codigo.js dentro de generales.js")
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