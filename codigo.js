function call(){
    console.log("se ha llamado a una funcion de codigo.js dentro de generales.js")
}

function newP(pid, size){
    console.log("llamada a new")
    console.log("pid = " +pid)
    console.log("size = " + size)
    
}

function use(ptr){
    console.log("llamada a use")
    console.log("ptr = " + ptr)
}

function deleteP(ptr){
    console.log("llamada a delete")
    console.log("ptr = "+ ptr)
}

function kill(pid){
    console.log("llamada a kill")
    console.log("pid = " + pid )
}