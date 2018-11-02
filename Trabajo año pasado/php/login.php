<?php 
	session_start();
    include('./conexion.php');

    //Comprobamos que los datos estén bien introducidos
    if (isset($_POST['registrodatos'])) {

        //Con htmlspecialchars nos aseguramos que los datos introducidos no nos lo coja como datos especiales y nos de error por ello
      function controlar_caracteres_especiales($data) {
        $data = htmlspecialchars($data);
        return $data;
    }
    //Creamos e introducimos las variables provenientes del html
    $dni = controlar_caracteres_especiales($_POST["DNI"]);
    $contrasena = controlar_caracteres_especiales($_POST["Contrasena"]);
    //Variable "error" para la comprobación de que el formulario no haya tenido errores en las validaciones
    $error = FALSE;
    
    //Llamada a las funciones de cada validación de datos
    validarDNI($dni);
    validarContrasena($contrasena);
    if ($error === FALSE)
    {
    	validarsiExiste();
	}
}

	//Función para comprobar el DNI y que el DNI se encuentra en la base de datos
	    function validarDNI($dni)
	    {
	        global $error;
	        if(empty($dni))
	        {
	            echo "Introduzca un dni</br>";
	            $error = TRUE;
	        }
	        else
	        {
	            if (!preg_match("/^([0-9]{8})([-]?)([A-Za-z]{1})$/",$dni))
	            {
	                echo "Introduzca 8 números y una letra para el DNI</br>";
	                $error = TRUE;
	            }
	            
	        }
	          
	    }

	    function validarContrasena($contrasena)
	        {
	            global $error;
	            if(empty($contrasena))
	            {
	                echo "Introduzca una contraseña</br>";
	                $error = TRUE;
	            }
	            else
	            {
	                if (!preg_match("/^(?=.*\d)(?=.*[A-Z]).{2,8}$/",$contrasena))
	                {
	                    echo "8 letras con al menos 1 mayúscula y 1 número</br>";
	                    $error = TRUE;
	                }
	            }
	        }

	    function validarsiExiste()
	    {
	    	global $dni, $dbname, $contrasena, $conexion;
			mysqli_select_db($conexion, $dbname) or die('No pudo conectarse</br>'.mysqli_error());
			$pass = md5($contrasena);
	        //Preparar la consulta
	        $consulta = "SELECT * FROM login_elite WHERE dni = '$dni' AND contrasena = '$pass'";
	        //Ejecutar la consulta
	        $resultado = mysqli_query($conexion, $consulta) or die(mysqli_error($conexion));
	        if ($resultado->num_rows == 0){
	            //No existe ese DNI-pass en login_elite
	            $error = TRUE;
	            echo "No existe ese usuario o no tiene asignada contraseña</br>";
	        }
	        else
	        {
	            // Existe el DNI-pass en ambas tablas
				$_SESSION["dni"] = $dni;
				header("Location:https://192.168.0.11/php/perfil.php");
	        }

	    }


?>