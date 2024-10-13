
var selectedFile
var algo = 5;
var simulado = false;
var archivo;
var data;
var texto;
var blob;
var pausado = false;
function simular() {
    

    if(localStorage.getItem("sim") ==  1){
        selectedFile = document.getElementById("inputFile").files[0];;
     
    if (selectedFile) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
         
            localStorage.setItem("fileContent", JSON.stringify(event.target.result));
            if(algo === 3 ){
            
               
                if(parseInt(document.getElementById("inputRandom").value) <= 0 || document.getElementById("inputRandom").value == ""){
                    alert("Por favor escoja una semilla mayor a cero")
                    return;
                }else{

                    localStorage.setItem("semilla", document.getElementById("inputRandom").value)
                    document.location.href = "visual.html";
                }
               
            
                
                
            }
    
            if(algo === 5){
                alert("Por favor escoja un algoritmo para simular")
            }else{
                
              
                    document.location.href = "visual.html";
                
    
            }
           
                  
            
            
        };

        reader.onerror = function(error) {
            console.error("Error reading file:", error);
        };

        reader.readAsText(selectedFile); 
    } else {
        
        
        alert("Necesita ingresar un archivo para visualizarlo")
       

        }
    }

    else{
    if(!simulado){

    }else{

    
    selectedFile = blob;
    
    
    if (selectedFile) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            // Store the file content as a string in localStorage
            localStorage.setItem("fileContent", JSON.stringify(event.target.result));
            if(algo === 3 ){
            
                if(parseInt(document.getElementById("inputRandom").value) <= 0 || document.getElementById("inputRandom").value == ""){
                    alert("Por favor escoja una semilla mayor a cero")
                }
                else{
                    localStorage.setItem("semilla", document.getElementById("inputRandom").value)
                    document.location.href = "visual.html";
                }
                
            }
    
            if(algo === 5){
                alert("Por favor escoja un algoritmo para simular")
            }else{
                
             
                    document.location.href = "visual.html";
                
    
            }
          
      
        
           
            
            
        };

        reader.onerror = function(error) {
            console.error("Error reading file:", error);
        };

        reader.readAsText(selectedFile); 
    } else {
        if(algo === 3 ){
            
            if(parseInt(document.getElementById("inputRandom").value) <= 0 || document.getElementById("inputRandom").value == ""){
                alert("Por favor escoja una semilla mayor a cero")
            }
            else if(parseInt(document.getElementById("inputProcesos").value)<=0 || document.getElementById("inputProcesos").value == ""){
                alert("Por favor introduzca un numero superior a cero procesos para simular")
            }
            else if(parseInt(document.getElementById("inputOp").value)<=0  ||  document.getElementById("inputOp").value == ""){
                alert("Por favor introduzca un numero superior a cero operaciones para simular")
            }
            else{
                localStorage.setItem("semilla", document.getElementById("inputRandom").value)
                document.location.href = "visual.html";
            }
            
        }

        if(algo === 5){
            alert("Por favor escoja un algoritmo para simular")
        }else{
            
            if(parseInt(document.getElementById("inputProcesos").value)<=0 || document.getElementById("inputProcesos").value == ""){
                alert("Por favor introduzca un numero superior a cero procesos para simular")
            }
            if(parseInt(document.getElementById("inputOp").value)<=0  ||  document.getElementById("inputOp").value == ""){
                alert("Por favor introduzca un numero superior a cero operaciones para simular")
            }else{
                document.location.href = "visual.html";
            }

        }
        
       
        
        
       

    }
     
    }
}
           
}

function llamarFunc(){
    if(parseInt(document.getElementById("inputProcesos").value)<=0 || document.getElementById("inputProcesos").value == ""){
        alert("Por favor introduzca un numero superior a cero procesos para simular")
    }
    else if(parseInt(document.getElementById("inputOp").value)<=0  ||  document.getElementById("inputOp").value == ""){
        alert("Por favor introduzca un numero superior a cero operaciones para simular")
    }
    else if(parseInt(document.getElementById("inputRandom").value) <= 0 || document.getElementById("inputRandom").value == ""){
        alert("Por favor escoja una semilla mayor a cero")
    }else{
        simulado = true;
        call();
        archivo = "data.txt"
        data = "new(1, 250):new(3, 345):use(1):use(3):delete(1):kill(2)".split(':');
        texto = data.join('\n')
        blob = new Blob([texto], { type: 'text/plain' });

    }
    
}

function setAlgoritmo(algoritmo){
  
   
    algo = algoritmo;
    if(algoritmo === 0){
        localStorage.setItem("algoritmo", "FIFO");
        document.getElementById("alg").textContent = "FIFO"
     
        
    }
    else if(algoritmo === 1){
        localStorage.setItem("algoritmo", "SC2");
    
        document.getElementById("alg").textContent = "SC2"
    }
    else if(algoritmo === 2){
        localStorage.setItem("algoritmo", "MRU");
        document.getElementById("alg").textContent = "MRU"
    }
    else if(algoritmo === 3){
        localStorage.setItem("algoritmo", "RND");
        document.getElementById("alg").textContent = "RND"
    }

}
function parseFile() {
    const fileContent = JSON.parse(localStorage.getItem("fileContent"));
    
    if (!fileContent) {
        console.error("No file content found.");
        return;
    }

    const lines = fileContent.split('\n'); 

   
    lines.forEach(line => {
        console.log(line); 
        if (line.startsWith("new")) {
            const args = line.match(/\(([^)]+)\)/);
            if (args) {
                const [arg1, arg2] = args[1].split(',').map(Number);
                newP(arg1, arg2);
            }
        } else if (line.startsWith("use")) {
            const args = line.match(/\(([^)]+)\)/);
            if (args) {
                const [arg] = args[1].split(',').map(Number);
                use(arg);
            }
        }else if(line.startsWith("delete")){
            const args = line.match(/\(([^)]+)\)/);
            if (args) {
                const [arg] = args[1].split(',').map(Number);
                deleteP(arg);
            }
            
        }else if(line.startsWith("kill")){
            const args = line.match(/\(([^)]+)\)/);
            if (args) {
                const [arg] = args[1].split(',').map(Number);
                kill(arg);
            }
        }
        
    });
}

function pausar(){

    if(document.getElementById("pausa").textContent === "Pausar"){
        document.getElementById("pausa").textContent = "Continuar"
        pausado = false;
    }else{
        document.getElementById("pausa").textContent = "Pausar"
        pausado = true;
    }
}

 
function hacerSim(cond){
    
    if(cond === 0){
        localStorage.setItem("sim", 0)
       
    }
    if(cond === 1){
        localStorage.setItem("sim", 1);
        
    }
    document.location.href = "sim.html"
}

function cargarSim(){
    
    if(localStorage.getItem("sim") == 0){
       document.getElementById("labelFile").style.display = "none"
       document.getElementById("inputFile").style.display = "none"
       
    }
    if(localStorage.getItem("sim") ==  1){
        document.getElementById("tituloSim").textContent = "Introduzca el archivo para visualizar"
        
        document.getElementById("simBtn").style.display = "none"
     
        document.getElementById("labelProc").style.display = "none"
        document.getElementById("inputProcesos").style.display = "none"
        document.getElementById("labelOP").style.display = "none"
        document.getElementById("inputOp").style.display = "none"
        document.getElementById("downloadBtn").style.display = "none"

    }

}

function generateCells(){
    parseFile();
    
    var texto = localStorage.getItem("algoritmo")
   
    document.getElementById("mmu").textContent = "MMU - " + texto
    document.getElementById("ram").textContent = "RAM - " + texto
    for(var i = 0; i<100; i++){
        var td = document.createElement("td");

        if(i<=15){
            td.classList = "verde"
        }
        
        if(15<i && i<=30){
            td.classList = "amarillo"
        }
        if(30<i && i<=45){
            td.classList = "rosa"
        }
        if(45<i && i<=60){
            td.classList = "azul"
        }
        if(60<i && i<=  75){
            td.classList = "naranja"
        }
        if(75<i && i<=  100){
            td.classList = "blanco"
        }
            

        document.getElementById("prim1").appendChild(td);

        var tr = document.createElement("tr");

        
       

        for(var j = 0; j<8; j++){
            var td2 = document.createElement("td");

            if(i<=15){
                td2.classList = "verde"
            }
            if(15<i && i<=30){
                td2.classList = "amarillo"
            }
            if(30<i && i<=45){
                td2.classList = "rosa"
            }
            if(45<i && i<=60){
                td2.classList = "azul"
            }
            if(60<i && i<=  75){
                td2.classList = "naranja"
            }
            if(75<i && i<=  100){
                td2.classList = "blanco"
            }
            if(j == 0)
                td2.textContent = i+1
            tr.appendChild(td2);
        }

        document.getElementById("body1").appendChild(tr);
        
        
    }
    for(var i = 0; i<100; i++){
        var td = document.createElement("td");
        
        if(i<=15){
            td.classList = "verde"
        }
        if(15<i && i<=30){
            td.classList = "amarillo"
        }
        if(30<i && i<=45){
            td.classList = "rosa"
        }
        if(45<i && i<=60){
            td.classList = "azul"
        }
        if(60<i && i<=  75){
            td.classList = "naranja"
        }
        if(75<i && i<=  100){
            td.classList = "blanco"
        }

        document.getElementById("prim2").appendChild(td);

        var tr = document.createElement("tr");
       

        for(var j = 0; j<8; j++){
            var td2 = document.createElement("td");

            if(i<=15){
                td2.classList = "verde"
            }
            if(15<i && i<=30){
                td2.classList = "amarillo"
            }
            if(30<i && i<=45){
                td2.classList = "rosa"
            }
            if(45<i && i<=60){
                td2.classList = "azul"
            }
            if(60<i && i<=  75){
                td2.classList = "naranja"
            }
            if(75<i && i<=  100){
                td2.classList = "blanco"
            }

            if(j == 0)
                td2.textContent = i+1
            tr.appendChild(td2);
        }

        document.getElementById("body2").appendChild(tr);
        
    }
    

}


function downloadFile(){
    if(!simulado){
        alert("Por favor cree una simulacion para poder descargar el archivo")
    }else{
        document.getElementById('downloadBtn').addEventListener('click', function() {
        
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = archivo;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
    
}




