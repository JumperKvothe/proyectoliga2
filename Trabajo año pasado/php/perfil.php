<?php
session_start();
include('./conexion.php');

        function controlar_caracteres_especiales($data) {
            $data = htmlspecialchars($data);
            return $data;
        }

        $dni=$_SESSION['dni'];
        $consulta = "SELECT* FROM usuario WHERE dni='$dni'";
        $resultado = mysqli_query($conexion,$consulta) or die (mysqli_error($conexion));
        if($row = mysqli_fetch_array($resultado)){
            $nombre = $row["nombre"];
            $apellido = $row["apellidos"];
            $telefono = $row["telefono"];
            $fotoperfil = $row["fotoperfil"];
            $direccion = $row["direccion"];
            $instagram = $row["instagram"];
            $email = $row["email"];
            $facebook = $row["facebook"];
            $coin = $row["coin"];
        }

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">    
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="shortcut icon" href="../imagenes/icono.jpg">
    <link rel="stylesheet" type="text/css" href="../estilos.css">
    <script type="text/javascript" src="../funciones.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <title>Perfil</title>
</head>
<body onload="setInterval('inicio()',1000)">
    <h1 class="center">Perfil</h1>

<div class="container">
<form method="POST" enctype="multipart/form-data">
    <div class="row">
            <div class="col-33 center" style= 'height:260.5px;'>
              <div class="verticalcenter">
                  <input type="button" value="Añadir Amigo" class="buttonamigo" onclick="mostrarmenu()">
                  <div id="oculto" class="oculto" style='display:none;'>
                      <input type="text" id="amigo" placeholder= "Introduce el nombre" style='position:relative; top:-80px;'>
                      <input type="button" value="Enviar" style='position:relative; top:-260px;' onclick="agregaramigo()">
                  </div>

              </div>
            </div>
            <div class="col-33 center perfil borde">
              <label>Imagen de perfil</label><br>
              <div>
              <?php
              if($fotoperfil == "" OR $fotoperfil === NULL)
              {
                echo "-";
              }else
              {
                echo "<img class='perfil' src='../imagenesBD/$fotoperfil'>" . "<br>";
              }
              ?>
              </div>
            </div>
            <div class="col-33 center">
              <div class="verticalcenter">
            <img src="../imagenes/coin.jpg">
            
            <?php
            echo "<label id='coin' name='coin'>$coin</label>";
            ?>
              </div>
            </div>
    </div>
    <div class="row">
      <div class="col-33 center borde">
              <label>Nombre</label><br>
              <?php
              echo $nombre;
              ?>
      </div>
      <div class="col-33 center borde">
              <label>Apellidos</label><br>
              <?php
              echo $apellido;
              ?>
      </div>
      <div class="col-33 center borde">
              <label>DNI</label><br>
              <?php
              echo $dni;
              ?>
      </div>
    </div>
      <div class="row">
      <div class="col-33 center borde">
              <label>Telefono</label><br>
              <?php
              echo $telefono;
              ?>
          </div>
          <div class="col-33 center borde">
              <label>Email</label><br>
              <?php
              echo $email;
              ?>
      </div>
      <div class="col-33 center borde">
              <label>Dirección</label><br>
              <?php
              echo $direccion;
              ?>
      </div>
    </div>
      <div class="row">
      <div class="col-49 center borde">
              <label>Instagram</label><br>
              <?php
              if ($instagram == "" OR $instagram === NULL)
              {
                echo "-";
              }else
              {
              echo $instagram;
              }
              ?>
      </div>
      <div class="col-49 center borde">
              <label>Facebook</label><br>
              <?php
              if ($facebook == "" OR $facebook === NULL)
              {
                echo "-";
              }else
              {
                echo $facebook;
              }
              ?>
      </div>
    </div>
    <div class="row">
      <h4>CHAT: (pulsa en un amigo para iniciar la conversación)</h4>
      <div id="chat" class="container" style='display:none;'>
  <div class="row">
    <div class="col-md-4">
          <div class="panel panel-primary">
              <div class="panel-heading"><b id="nombre"></b> <small>online</small></div>
              <div id="panel-body" class="panel-body" style="background:url('http://subtlepatterns.com/patterns/geometry2.png');height: 300px; }">
              </div>
            </div>
        </div>
        <div id="chatbox"></div>  
            <input id="enviar" name="usermsg" type="text" size="63" />  
            <input name="submitmsg" type="button" class="buttonenviar" id="submitmsg" onclick="mandarmensajes()" value="Enviar" />  
  </div>
</div>
      <div class="amigos borde"><ul id="lista"></ul></div>
    </div>

</form>
</div>
</body>
</html>