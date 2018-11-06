	var cont = 0;

	function inicio(){
		contador();
        updatecoin();
        comprobarpeticiones();
        genteonline();
        amigosonline();
        if($('#chat').is(':visible')){
        	var n = $('#nombre').text();
        	iniciarchat(n, false);
        }
	}

	function contador() {
		cont = parseInt(document.getElementById("coin").textContent);
		cont=cont+50;
		document.getElementById("coin").innerHTML= cont;
		localStorage.setItem("coin", cont);
	}

	function updatecoin(){
		var updatecoin = localStorage.getItem("coin");
		$.ajax({
	        url: 'amigos.php',
	        data: 'coin='+updatecoin+'&id=1',
	        type: "POST",            
	        dataType: "html"
    	});
	}  

	function mostrarmenu(){
		if (document.getElementById('oculto').style.display == 'none'){
			document.getElementById('oculto').style.display = 'block';
		}else{
			document.getElementById('oculto').style.display = 'none';
		}
	}

	function agregaramigo(){
		var amigo = document.getElementById('amigo').value;
		if (amigo != null){
			$.ajax({
				url: 'amigos.php',
				data: 'nombre='+amigo+'&id=2',
				type: "POST",
				dataType: "html", 
		        success: function(data, status){
		            //alert("JSON: " + data + "\nStatus: " + status);
		            var obj = JSON.parse(data);
		            var error = obj.error;
		            var nombre = obj.nombre;
		            if (error == 1){
						alert("No existe ese usuario");
					}else if (error == 2){
						alert("Estás intentando agregarte a ti mismo");
					}else if (error == 3){
						alert("Aún no aceptó ni rechazó tu petición de amistad");
					}else if (error == 4){
						alert("Ya sois amigos");
					}else{
						alert("Tu amigo " + nombre + " ha recibido la petición");
					}
		        }
			});
		}
	}

	function comprobarpeticiones(){
		$.ajax({
	        url: 'amigos.php',
	        data: 'id=3',
	        type: "POST",            
	        dataType: "html",
	        success: function(data){
				//alert(data);
		        var obj = JSON.parse(data);
		        var error = obj.error;
		        var nombre = obj.nombre;
		        var idr = obj.idr;
		        var idp = obj.idp;
		        
				if (error == 1){
		    		// Hay petición
		    		var b = confirm("El usuario " + nombre + " te ha mandado una petición de amistad");
		    		if (b){
						$.ajax({
						        url: 'amigos.php',
						        data: 'id=4&confirm=1'+'&idr='+idr+'&idp='+idp,
						        type: "POST",            
						        dataType: "html",
						        success: function(data){
						        	// convertir string en objeto
						        }
						    });
		    		}else{
		    			$.ajax({
						        url: 'amigos.php',
						        data: 'id=4&confirm=0'+'&idr='+idr+'&idp='+idp,
						        type: "POST",            
						        dataType: "html",
						        success: function(data){
						        	// convertir string en objeto
						        }
						    });
		    		}
		    	}else{
		    		// No hay petición - No hace nada

		    	}
		    }
    	});
    }

    function genteonline(){
    	$.ajax({
				url: 'amigos.php',
				data: 'id=5',
				type: "POST",
				dataType: "html", 
		        success: function(data, status){
		        	//alert("JSON: " + data + "\nStatus: " + status);
				}
    	});
    }

    function amigosonline(){
    	var lista = document.getElementById("lista");
    	$.ajax({
				url: 'amigos.php',
				data: 'id=6',
				type: "POST",
				dataType: "html", 
		        success: function(data, status){
		        	//alert("JSON: " + data + "\nStatus: " + status);
		        	var obj = JSON.parse(data);

		        	$("#lista").empty();

		        	for (var i = 0; i < obj.length; i++){
		        		$("#lista").append('<li class="hover" id="' + i + '" onclick="abrirchat(' + i + ')">' + obj[i] + '</li>');

		        	}
				}
    	});
    }

    function abrirchat(valor){
		if (document.getElementById('chat').style.display == 'none'){
			document.getElementById('chat').style.display = 'block';
		}else{
			document.getElementById('chat').style.display = 'none';
		}
    	iniciarchat(valor, true);
    }

    function iniciarchat(valor, bool){

    	if (bool == true){
    		var nombre = document.getElementById(valor).textContent;
			$("#nombre").html(nombre);
			localStorage.setItem("destinatario", nombre);
    	}else{
			var nombre = localStorage.getItem("destinatario");
    	}

		$.ajax({
				url: 'amigos.php',
				data: 'id=7&nombre='+nombre,
				type: "POST",
				dataType: "html", 
		        success: function(data, status){
		        	//alert("JSON: " + data + "\nStatus: " + status);
		        		var obj = JSON.parse(data);

		        	$("#panel-body").empty();
		        	if (data !== null && data !== ""){
		        		for (x in obj) {
			        		// Recibe el mensaje
			        		if (x.substring(0, 1) === "d"){
			        			$("#panel-body").prepend('<div class="clearfix"><blockquote class="me">' + obj[x] +
			        			 '</blockquote></div>');
			        		// Manda el mensaje
			        		}else{
			        			$("#panel-body").prepend('<div class="clearfix"><blockquote class="you">' + obj[x] +
			        			 '</blockquote></div>');
			        		}
		        		}
		        	}
		        }
		});
	}

	function mandarmensajes(){
		var msj = document.getElementById('enviar').value;
		var dest = localStorage.getItem("destinatario");
		if(msj !== null && msj !== ""){
			$.ajax({
					url: 'amigos.php',
					data: 'id=8&msj='+msj+'&nombre='+dest,
					type: "POST",
					dataType: "html", 
				    success: function(data, status){
				        //alert("JSON: " + data + "\nStatus: " + status);

				    }
			});
			document.getElementById('enviar').value = "";
		}
		
	}
	


    