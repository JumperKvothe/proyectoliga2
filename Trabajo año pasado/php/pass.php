<?php
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
    $confcontrasena = controlar_caracteres_especiales($_POST["Confirmarcontrasena"]);

    //Variable "error" para la comprobación de que el formulario no haya tenido errores en las validaciones
    $error = FALSE;
    
    //Llamada a las funciones de cada validación de datos
    validarDNI($dni);
    validarContrasena($contrasena);
    validarConfContrasena($confcontrasena);
    comprobarContrasenas();

    //Si hay algún error en la validación no mandará los datos. Si no lo hay se hará esa consulta y se informará si se ha almacenado en la base de datos
    if($error===FALSE){

        //Encriptar password
        $pass = md5($contrasena);
        //Consulta para insertar datos en la base de datos
        $consulta = "INSERT INTO login_elite (dni, contrasena) VALUES ('$dni', '$pass')";
        $resultado = mysqli_query($conexion,$consulta) or die (mysqli_error($conexion));
        if ($resultado) {
            echo "Usuario almacenado correctamente en la Base de Datos</br>";
        }
        else {
            echo "Error en la consulta</br>";
        }
        
        mandarEmail();
        
        if (mysqli_close($conexion)){ 
            echo "Desconexión realizada</br>";
        } 
        else {
            echo "Error en la desconexión</br>";
        }

        
  }else{
    exit;
  }

}   
    //Función para comprobar el DNI y que el DNI se encuentra en la base de datos
    function validarDNI($dni)
    {
        global $error, $dbname, $conexion;
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

            if($error===FALSE)
            {
                mysqli_select_db($conexion, $dbname) or die('No pudo conectarse</br>'.mysqli_error());
                //Preparar la consulta
                $consulta = "SELECT dni FROM login_elite WHERE dni = (SELECT dni FROM usuario WHERE dni = '$dni')";
                //Ejecutar la consulta
                $resultado = mysqli_query($conexion, $consulta) or die(mysqli_error($conexion));
                if ($resultado->num_rows == 0){
                    //No existe ese DNI en una o en ambas tablas
                    $consulta = "SELECT dni FROM usuario WHERE dni='$dni'";
                    $resultado = mysqli_query($conexion, $consulta) or die(mysqli_error($conexion));
                    if($resultado->num_rows == 0){
                        //No existe ese DNI en la tabla usuario
                        $error = TRUE;
                        echo "No existe ese DNI</br>";
                    }else{
                        //Existe ese DNI en la tabla usuario pero no en la tabla login_elite
                    }
                }
                else
                    {
                    $error = TRUE;
                    echo "Ya existe ese DNI en la BBDD</br>";
                }

                
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
    function validarConfContrasena($confcontrasena)
        {
            global $error;
            if(empty($confcontrasena))
            {
                echo "Introduzca una contraseña</br>";
                $error = TRUE;
            }
            else
            {
                if (!preg_match("/^(?=.*\d)(?=.*[A-Z]).{2,8}$/",$confcontrasena))
                {
                    echo "8 letras con al menos 1 mayúscula y 1 número</br>";
                    $error = TRUE;
                }
            }
        }

    function comprobarContrasenas()
        {
            global $contrasena, $confcontrasena, $error;
            if($contrasena==$confcontrasena)
                {
                }
                else
                {

                    echo "Las contraseñas no coinciden</br>";
                    $error = TRUE;

                }
        }
    
    function mandarEmail()
        {
            global $dni, $conexion, $contrasena;
            $consulta = "SELECT nombre, email FROM usuario WHERE dni = '$dni'";
            $resultado = mysqli_query($conexion, $consulta) or die(mysqli_error($conexion));
            if($row = mysqli_fetch_array($resultado)){
                $nombre = $row["nombre"];
                $email = $row["email"];
            }
            $asunto = "Confirmar Datos";
            $emailorigen = "emailpruebasevilla@gmail.com";
            $mensaje = "Hola ".$nombre.", sus datos de login han sido confirmados.<br>
            usuario: $dni <br>
            password: $contrasena <br>
            Link del Login: http://192.168.0.6/html/verificar.html";

            require '../phpmailer/PHPMailerAutoload.php';
              $mail = new PHPMailer;
            
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->SMTPSecure = 'ssl';
                $mail->Port = 465;                                   
                $mail->Username = $emailorigen;     
                $mail->Password = 'prueba123';                       

                $mail->setFrom($emailorigen);
                $mail->addAddress(''.$email.'');

                $mail->isHTML(true);
                $mail->Subject = $asunto;
                $mail->Body    = $mensaje;
            if(!$mail->Send()){
              ?>

              <?php
            }
            
        }
 ?>
