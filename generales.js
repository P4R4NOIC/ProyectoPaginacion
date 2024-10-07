
var selectedFile
var algo = 5;

function simular() {

    selectedFile = document.getElementById("inputFile").files[0];
    
    if (selectedFile) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            // Store the file content as a string in localStorage
            localStorage.setItem("fileContent", JSON.stringify(event.target.result));
          
            document.location.href = "sim.html";
        
            parseFile();
            
            
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
                document.location.href = "sim.html";
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
                document.location.href = "sim.html";
            }

        }
        
       
        
        
       

    }
     
           
}

function prueba(){
    call();
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
        
    });
}

function pausar(){

    if(document.getElementById("pausa").textContent === "Pausar"){
        document.getElementById("pausa").textContent = "Continuar"
    }else{
        document.getElementById("pausa").textContent = "Pausar"
    }
}

function generateCells(){
    prueba();
    var texto = localStorage.getItem("algoritmo")
    console.log(texto)
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

    document.getElementById('downloadBtn').addEventListener('click', function() {
        const data = "Hello World";
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}




