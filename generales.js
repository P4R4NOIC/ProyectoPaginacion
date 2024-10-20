
var selectedFile
var algo = 5;
var simulado = false;
var archivo;
var data;
var texto;
var blob;
var pausado = false;
var firstTimeMMU;
var selectedMMU;
var optMMU;
var currentIndex = 0;
var contadorNews = 0;
var colors;
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
    const procesos = parseInt(document.getElementById("inputProcesos").value);
    const operaciones = parseInt(document.getElementById("inputOp").value);
    const semilla = parseInt(document.getElementById("inputRandom").value);

    if (isNaN(procesos) || procesos <= 0) {
        alert("Por favor introduzca un número superior a cero procesos para simular");
    } else if (isNaN(operaciones) || operaciones <= 0) {
        alert("Por favor introduzca un número superior a cero operaciones para simular");
    } else if (isNaN(semilla) || semilla <= 0) {
        alert("Por favor escoja una semilla mayor a cero");
    } else {
        simulado = true;
        let resultado = generarOperaciones(procesos, operaciones, semilla);
        archivo = "data.txt"
        //data = "new(1, 250):new(1, 345):use(1):use(1):delete(0):kill(1)".split(':');
        data = resultado.split(':');
        texto = data.join('\n')
        //console.log(texto);
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

    contadorNews = lines.filter(command => command.startsWith("new")).length;
    colors = generateColors(contadorNews);
    //CREACION MMU
    let nombreAlgoritmo = localStorage.getItem("algoritmo");
    let semilla = +localStorage.getItem("semilla");

    let numeroAlgoritmo = 0;
    if(nombreAlgoritmo=="FIFO"){
        numeroAlgoritmo=1;
    }
    if(nombreAlgoritmo=="SC2"){
        numeroAlgoritmo=2;
    }
    if(nombreAlgoritmo=="MRU"){
        numeroAlgoritmo=3;
    }
    if(nombreAlgoritmo=="RND"){
        numeroAlgoritmo=4;
    }
    
    firstTimeMMU = new MMU(numeroAlgoritmo, semilla);
    firstTimeMMU.symbolTable.push([1, []]);
    selectedMMU = new MMU(numeroAlgoritmo, semilla);
    selectedMMU.symbolTable.push([1, []]);
    //FIN MMU

    lines.forEach(line => {
        //console.log(line); 
        if (line.startsWith("new")) {
            const args = line.match(/\(([^)]+)\)/);
            if (args) {
                const [arg1, arg2] = args[1].split(',').map(Number);
                newP(firstTimeMMU, arg1, arg2);
            }
        } else if (line.startsWith("use")) {
            const args = line.match(/\(([^)]+)\)/);
            if (args) {
                const [arg] = args[1].split(',').map(Number);
                use(firstTimeMMU, arg);
            }
        }else if(line.startsWith("delete")){
            const args = line.match(/\(([^)]+)\)/);
            if (args) {
                const [arg] = args[1].split(',').map(Number);
                deleteP(firstTimeMMU, arg);
            }
            
        }else if(line.startsWith("kill")){
            const args = line.match(/\(([^)]+)\)/);
            if (args) {
                const [arg] = args[1].split(',').map(Number);
                kill(firstTimeMMU, arg);
            }
        }
        
    });
    optMMU = new MMU(5, semilla);
    optMMU.symbolTable.push([1, []]);
    optMMU.pagesForOPT = firstTimeMMU.pagesForOPT;


}

function processNextLine() {
    
    
    const fileContent = JSON.parse(localStorage.getItem("fileContent"));
    
    if (!fileContent) {
        console.error("No file content found.");
        return;
    }

    const lines = fileContent.split('\n'); 
    if (!pausado && currentIndex < lines.length) { // Solo ejecuta si no está en pausa y hay líneas por procesar
        const line = lines[currentIndex];
        //console.log(line);
        
        if (line.startsWith("new")) {
            const args = line.match(/\(([^)]+)\)/);
            if (args) {
                const [arg1, arg2] = args[1].split(',').map(Number);
                newP(selectedMMU, arg1, arg2);
                newP(optMMU, arg1, arg2);
            }
        } else if (line.startsWith("use")) {
            const args = line.match(/\(([^)]+)\)/);
            if (args) {
                const [arg] = args[1].split(',').map(Number);
                use(selectedMMU, arg);
                use(optMMU, arg);
            }
        } else if (line.startsWith("delete")) {
            const args = line.match(/\(([^)]+)\)/);
            if (args) {
                const [arg] = args[1].split(',').map(Number);
                deleteP(selectedMMU, arg);
                deleteP(optMMU, arg);
            }
        } else if (line.startsWith("kill")) {
            const args = line.match(/\(([^)]+)\)/);
            if (args) {
                const [arg] = args[1].split(',').map(Number);
                kill(selectedMMU, arg);
                kill(optMMU, arg);
            }
        }

        //console.log("SELECTED");
        //console.log(JSON.parse(JSON.stringify(selectedMMU)));
        //console.log("OPTIMO");
       // console.log(JSON.parse(JSON.stringify(optMMU)));
        //console.log(optMMU.mmuInformation())
        //console.log(optMMU.mmuInformation().length)

        var body1 = document.getElementById("body1");
        var body2 = document.getElementById("body2");
      

        while (body1.children.length > 1) {
            body1.removeChild(body1.lastChild);
        }

        while (body2.children.length > 1) {
            body2.removeChild(body2.lastChild);
        }

        var x = optMMU.mmuInformation()
        var y = selectedMMU.mmuInformation();
        



        for (var i = 0; i < x.length; i++) {
            var tr = document.createElement("tr");
            tr.id = "trOPT" + i; 


            if(x.length < 100 && x[4] != undefined){
                if(i > x.length && i < 100){
                    if(x[i][4] == 0)
                        document.getElementById("td" + 0).style.backgroundColor = "#000000"

                    if(x[i][4] != ' ' && x[i][4] != undefined &&  x[i][4] >= 0)
                        document.getElementById("td" + x[i][4]).style.backgroundColor = "#000000"
                   
                }else if(optMMU.tablaPaginasFisicas[i] === -1){
                    if(x[i][4] == 0)
                        document.getElementById("td" + 0).style.backgroundColor = "#000000"

                    if(x[i][4] != ' ' && x[i][4] != undefined &&  x[i][4] >= 0)
                        document.getElementById("td" + x[i][4]).style.backgroundColor = "#000000"
                    
                }else{
                    if(x[i][4] == 0)
                        document.getElementById("td" + 0).style.backgroundColor = colors[x[i][1]]

                    if(x[i][4] != ' ' && x[i][4] != undefined &&  x[i][4] >= 0)
                        document.getElementById("td" + x[i][4]).style.backgroundColor = colors[x[i][1]]
                   

                }

            }else if(i<100 && x[4] != undefined){

                if(optMMU.tablaPaginasFisicas[i] === -1 ){
                    if(x[i][4] == 0)
                        document.getElementById("td" + 0).style.backgroundColor = "#000000"

                    if(x[i][4] != ' ' && x[i][4] != undefined &&  x[i][4] >= 0)
                        document.getElementById("td" + x[i][4]).style.backgroundColor = "#000000"
                    
                }else {
                    if(x[i][4] == 0)
                        document.getElementById("td" + 0).style.backgroundColor = colors[x[i][1]]
                    
                    if(x[i][4] != ' ' && x[i][4] != undefined &&  x[i][4] >= 0)
                        document.getElementById("td" + x[i][4]).style.backgroundColor = colors[x[i][1]]
                }

                
            }

            

            
         
            for (var j = 0; j < 8; j++) {

                var td = document.createElement("td");
                td.style.backgroundColor = colors[x[i][1]]
     
                td.textContent = x[i][j];
               // console.log(x[i][j])
    
                tr.appendChild(td);


            }


            

    
            body1.appendChild(tr);
           
        }

        for (var i = 0; i < y.length; i++) {
            

            var tr2 = document.createElement("tr");
            tr2.id = "trALG" + i; 
       

           
           
             
            if(y.length < 100 && y[4] != undefined){
                if(i > x.length && i < 100){
                    if(y[i][4] == 0)
                        document.getElementById("tm" + 0).style.backgroundColor = "#000000"

                    if(y[i][4] != ' ' && y[i][4] != undefined &&  y[i][4] >= 0)
                        document.getElementById("tm" + y[i][4]).style.backgroundColor = "#000000"
                   
                }else if(optMMU.tablaPaginasFisicas[i] === -1){
                    if(y[i][4] == 0)
                        document.getElementById("tm" + 0).style.backgroundColor = "#000000"

                    if(y[i][4] != ' ' && y[i][4] != undefined &&  y[i][4] >= 0)
                        document.getElementById("tm" + y[i][4]).style.backgroundColor = "#000000"
                    
                }else{
                    if(y[i][4] == 0)
                        document.getElementById("tm" + 0).style.backgroundColor = colors[y[i][1]]

                    if(y[i][4] != ' ' && y[i][4] != undefined && y[i][4] >= 0)
                       
                        document.getElementById("tm" + y[i][4]).style.backgroundColor = colors[y[i][1]]
                   

                }

            }else if(i<100 && y[4] != undefined){
                if(optMMU.tablaPaginasFisicas[i] === -1){
                    if(y[i][4] == 0)
                        document.getElementById("tm" + 0).style.backgroundColor = "#000000"


                    if(y[i][4] != ' ' && y[i][4] != undefined &&  y[i][4] >= 0)
                        document.getElementById("tm" + y[i][4]).style.backgroundColor = "#000000"
                    
                }else{
                    if(y[i][4] == 0)
                        document.getElementById("tm" + 0).style.backgroundColor = colors[y[i][1]]

                    if(y[i][4] != ' ' && y[i][4] != undefined &&  y[i][4] >= 0)
                        document.getElementById("tm" + y[i][4]).style.backgroundColor = colors[y[i][1]]
                }

                
            }

            

            
         
            for (var j = 0; j < 8; j++) {


                var td2 = document.createElement("td"); 
                td2.style.backgroundColor = colors[y[i][1]]
     
                td2.textContent = y[i][j];
                
    
                tr2.appendChild(td2);
            }


            

            body2.appendChild(tr2);
        }

        

        var thrashingOPT = parseFloat(((optMMU.thrashing/optMMU.clock)*100).toFixed(1))
         //Carga de info OPT
        
        document.getElementById("procOPT").textContent = optMMU.symbolTable.length
        document.getElementById("simTOPT").textContent = optMMU.clock + "s"
        document.getElementById("RAMOPT").textContent = optMMU.ram / 1000
        document.getElementById("RAMPOPT").textContent = parseFloat(((optMMU.ram/400000)*100).toFixed(1)) + "%"
        document.getElementById("VRAMOPT").textContent = optMMU.vram / 1000
        document.getElementById("VRAMPOPT").textContent = parseFloat(((optMMU.vram/optMMU.ram)*100).toFixed(1))+ "%"
        document.getElementById("loadOPT").textContent = optMMU.realPages;
        document.getElementById("unloadOPT").textContent =optMMU.virtualPages;
        document.getElementById("trashOPT").textContent = optMMU.thrashing + "s"
        document.getElementById("trashPOPT").textContent = thrashingOPT + "%"
        document.getElementById("fragOPT").textContent = optMMU.fragmentation/1000 + "KB"
        
        if(thrashingOPT>50){
            document.getElementById("trashPOPT").classList = "rojo"
            document.getElementById("trashOPT").classList = "rojo"
        }else{
            document.getElementById("trashPOPT").classList = ""
            document.getElementById("trashOPT").classList = ""
        }

        var thrashingALG = parseFloat(((selectedMMU.thrashing/selectedMMU.clock)*100).toFixed(1))
        //Carga info ALG
        document.getElementById("procALG").textContent = selectedMMU.symbolTable.length
        document.getElementById("simTALG").textContent = selectedMMU.clock + "s"
        document.getElementById("RAMALG").textContent = selectedMMU.ram / 1000
        document.getElementById("RAMPALG").textContent = parseFloat(((selectedMMU.ram/400000)*100).toFixed(1)) + "%"
        document.getElementById("VRAMALG").textContent = selectedMMU.vram / 1000
        document.getElementById("VRAMPALG").textContent = parseFloat(((selectedMMU.vram/selectedMMU.ram)*100).toFixed(1))+ "%"
        document.getElementById("loadALG").textContent = selectedMMU.realPages;
        document.getElementById("unloadALG").textContent = selectedMMU.virtualPages;
        document.getElementById("trashALG").textContent = selectedMMU.thrashing + "s"
        document.getElementById("trashPALG").textContent = thrashingALG + "%"
        document.getElementById("fragALG").textContent = selectedMMU.fragmentation/1000 + "KB"

        if(thrashingALG>50){
            document.getElementById("trashALG").classList = "rojo"
            document.getElementById("trashPALG").classList = "rojo"
        }else{
            document.getElementById("trashALG").classList = ""
            document.getElementById("trashPALG").classList = ""
        }
       
        

      

        

       // console.log(selectedMMU.processMRList())
       // console.log("colores opt")
        //console.log(optMMU.processMRList())
        //console.log(selectedMMU)
       


        currentIndex++; // Incrementar el índice después de procesar la línea
    }

    // Si aún hay líneas por procesar, volver a ejecutar processNextLine después de 5 segundos
    if (currentIndex < lines.length) {
        setTimeout(processNextLine, 0); // Espera 5 segundos para procesar la siguiente línea
    } else {
        console.log("Todas las líneas han sido procesadas."); // Mensaje opcional cuando se completan todas las líneas
        for(var i = 0; i<100; i++){
            document.getElementById("tm" + i).style.backgroundColor = "#000000"
            document.getElementById("td" + i).style.backgroundColor = "#000000"
        }
    }
}

function pausar(){

    if(document.getElementById("pausa").textContent === "Pausar"){
        document.getElementById("pausa").textContent = "Continuar"
        pausado = true;
        //console.log(pausado);
    }else{
        document.getElementById("pausa").textContent = "Pausar"
        pausado = false;
        processNextLine()
        //console.log(pausado);
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
    //console.log("selected mmu")
   // console.log(selectedMMU)
    //console.log("opt mmu")
    //console.log(optMMU)
    var texto = localStorage.getItem("algoritmo")
    document.getElementById("mmu").textContent = "MMU - " + texto
    document.getElementById("ram").textContent = "RAM - " + texto

    //Carga de info OPT
    document.getElementById("procOPT").textContent = optMMU.symbolTable.length
    document.getElementById("simTOPT").textContent = optMMU.clock + "s"
    document.getElementById("RAMOPT").textContent = optMMU.ram / 100
    document.getElementById("RAMPOPT").textContent = (optMMU.ram / 4000)*100 + "%"
    document.getElementById("VRAMOPT").textContent = optMMU.vram / 100
    document.getElementById("VRAMPOPT").textContent = (optMMU.vram / 4000)*100 + "%"
    document.getElementById("loadOPT").textContent = optMMU.tablaPaginasFisicas.length
    document.getElementById("unloadOPT").textContent = optMMU.virtualPages
    document.getElementById("trashOPT").textContent = optMMU.thrashing + "s"
    document.getElementById("trashPOPT").textContent = 0 +  "%"
    document.getElementById("fragOPT").textContent = optMMU.fragmentation

    //Carga de info ALG
    document.getElementById("procALG").textContent = selectedMMU.symbolTable.length
    document.getElementById("simTALG").textContent = selectedMMU.clock + "s"
    document.getElementById("RAMALG").textContent = selectedMMU.ram / 100
    document.getElementById("RAMPALG").textContent = (selectedMMU.ram / 4000)*100 + "%"
    document.getElementById("VRAMALG").textContent = selectedMMU.vram / 100
    document.getElementById("VRAMPALG").textContent = (selectedMMU.vram / 4000)*100 + "%"
    document.getElementById("loadALG").textContent = selectedMMU.tablaPaginasFisicas.length
    document.getElementById("unloadALG").textContent = selectedMMU.virtualPages
    document.getElementById("trashALG").textContent = selectedMMU.thrashing + "s"
    document.getElementById("trashPALG").textContent = 0 +  "%"
    document.getElementById("fragALG").textContent = selectedMMU.fragmentation

   
   
    for(var i = 0; i<100; i++){
        var td = document.createElement("td");
        td.id = "td"+i
        
        
     

        document.getElementById("prim1").appendChild(td);

        var tr = document.createElement("tr");
       
        tr.id = "trOPT"
    

        document.getElementById("body1").appendChild(tr);
        
    }
        
        
    
    for(var i = 0; i<100; i++){
        var td = document.createElement("td");
        
        
            td.id = "tm" + i
     

        document.getElementById("prim2").appendChild(td);

        var tr = document.createElement("tr");
       

       

        document.getElementById("body2").appendChild(tr);
        
    }
    

}


function generateColors(numColors) {
    const colors = [];
    
    for (let i = 0; i < numColors; i++) {
        // Generate a random hex color
        const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        colors.push(color);
    }
    
    return colors;
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




