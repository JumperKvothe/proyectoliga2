<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<link rel="shortcut icon" href="imagenes/icono.jpg">
	<link rel="stylesheet" type="text/css" href="../estilos.css">
	<title>Formulario Elite</title>

</head>
<body>

<h1 class="center">Formulario</h1>

<div class="container">
<form action="../php/funciones.php" method="POST" enctype="multipart/form-data">
	<div class="row">
    	<div class="col-33 center">
  			<label>Nombre</label><br>
  		</div>
  		<div class="col-33 center">
  			<label>Apellidos</label><br>
  		</div>
  		<div class="col-33 center">
  			<label>DNI</label><br>
  		</div>
  	</div>
  	<div class="row">
  		<div class="col-33">
			<input type="text" name="Nombre" pattern="[A-Za-z]{1,15}" title="Introduzca solo texto" required>
		</div>
		<div class="col-33">
  			<input type="text" name="Apellidos" pattern="[A-Za-z ]{1,}" title="Introduzca solo texto" required>
  		</div>
  		<div class="col-33">
 			<input type="text" name="DNI" pattern="([0-9]{8})([-]?)([A-Za-z]{1})" title="Introduzca 8 dígitos y una letra mayúscula" required>
 		</div>
 	</div>


