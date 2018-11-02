<?php
    include('./conexion.php');
 //Comprobamos que los datos estén bien introducidos
    if (isset($_POST['registrodatos'])) {
        //Con htmlspecialchars nos aseguramos que los datos introducidos no nos lo coja como datos especiales y nos de error por ello
      function controlar_caracteres_especiales($data) {
        $data = htmlspecialchars($data);
        return $data;
    }
    //Creamos e introducimos las variables provenientes del tpl
      $nombre = controlar_caracteres_especiales($_POST["Nombre"]);
      $apellidos = controlar_caracteres_especiales($_POST["Apellidos"]);
      $dni = controlar_caracteres_especiales($_POST["DNI"]);
      $telefono = controlar_caracteres_especiales($_POST["Teléfono"]);
      $direccion = controlar_caracteres_especiales($_POST["Dirección"]);
      $instagram = controlar_caracteres_especiales($_POST["Instagram"]);
      $email = controlar_caracteres_especiales($_POST["Email"]);
      $facebook = controlar_caracteres_especiales($_POST["Facebook"]);
      $imagen = $_FILES["Imagen"];
      $nombrebbdd =NULL;
      

      //Variable "error" para la comprobación de que el formulario no haya tenido errores en las validaciones
      $error = FALSE;

      //Llamada a las funciones de cada validación de datos e Imagen subida
      validarNombre($nombre);
      validarApellidos($apellidos);
      validarDNI($dni);
      validarTelefono($telefono);
      validarImagen($imagen);
      validarDireccion($direccion);
      validarInstagram($instagram);
      validarEmail($email);
      validarFacebook($facebook);

      //Si hay algún error en la validación no mandará los datos. Si no lo hay se hará esa consulta y se informará si se ha almacenado en la base de datos
      if($error===FALSE){

            //Consulta para insertar datos en la base de datos
            $consulta = "INSERT INTO usuario (nombre, apellidos, dni, telefono, fotoperfil, direccion, instagram, email, facebook)
            VALUES ('$nombre', '$apellidos', '$dni', '$telefono', '$nombrebbdd', '$direccion', '$instagram', '$email', '$facebook')";
            $resultado = mysqli_query($conexion,$consulta);
            if ($resultado) {
                echo "Usuario almacenado correctamente en la Base de Datos</br>";
            }
            else {
                echo "Error en la consulta</br>";
            }
            
            if (mysqli_close($conexion)){ 
                echo "Desconexión realizada</br>";
            } 
            else {
                echo "Error en la desconexión";
            }
            
      }else{
        exit;
      }

    }


        if($error===FALSE && $resultado){
            mandarEmail();
        }

        //Vamos a realizar la función para el pattern del nombre del formulario
        function validarNombre($n)
        {
            global $error;
            if(empty($n))
            {
                echo "Introduzca un nombre</br>";
                $error = TRUE;
            }
            else
            {
                if (!preg_match("/^[A-Za-z]{1,15}$/",$n))
                {
                    echo "Sólo letras en la variable nombre</br>";
                    $error = TRUE;
                }
            }
        }
        //Vamos a realizar la función para el pattern de los apellidos
        function validarApellidos($a)
        {
            global $error;
            if(empty($a))
            {
                echo "Introduzca sus apellidos</br>";
                $error = TRUE;
            }
            else
            {
                if (!preg_match("/^[A-Za-z ]+$/",$a))
                {
                    echo "Sólo letras y espacios en la varibale apellidos</br>";
                    $error = TRUE;
                }
            }
        }

        //Función para comprobar el DNI
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

        //Función para la comprobación del teléfono
        function validarTelefono($t)
        {
            global $error;
            if(empty($t))
            {
                echo "Introduzca un telefono</br>";
                $error = TRUE;
            }
            else
            {
                if (!preg_match("/^[0-9]{9}$/",$t))
                {
                    echo "Introduzca 9 números para el teléfono</br>";
                    $error = TRUE;
                }
            }
        }

        //Funcion comprobar direccion
        function validarDireccion($d)
        {
            global $error;
            if(empty($d))
            {
                echo "Introduzca una dirección</br>";
                $error = TRUE;
            }
            else
            {
                if (!preg_match("/^[A-Za-z 0-9\/\ºª:ç|]+$/",$d))
                {
                    echo "Introduzca su dirección correcta por favor</br>";
                    $error = TRUE;
                }
            }
        }

        //Función para validar el valor introducido en el campo instagram
        function validarInstagram($i)
        {
            global $error;
            if (!empty($i))
            {
                if (!preg_match("/^@[A-Za-z._0-9]+$/",$i))
                {
                    echo "Introduzca su instagram correcto por favor</br>";
                    $error = TRUE;
                }
            }
            
        }

        //Función para validar el valor introducido en el campo email
        function validarEmail($e){
            global $error;
            if(empty($e))
            {
                echo "Introduzca un email</br>";
                $error = TRUE;
            }
            else
            {
                if (!preg_match("/^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/",$e))
                {
                    echo "Introduzca un email correcto por favor</br>";
                    $error = TRUE;
                }
            }
        }

        //Función para validar el valor introducido en el campo facebook
        function validarFacebook($f)
        {
            global $error;
            if (!empty($f))
            {
                if (!preg_match("/^[A-Za-z 0-9\/\ºª:ç|]+$/",$f))
                {
                    echo "Introduzca su facebook correcto por favor</br>";
                    $error = TRUE;
                }
            }
        }

        function validarImagen($im)
        {
            global $dni;
            $nombreimg = $im['name'];
            $tipo = pathinfo($nombreimg, PATHINFO_EXTENSION);
            $tamano = $im['size'];
            // Ponemos global la variable del nombre para poder usarla en la base de datos
            global $nombrebbdd;
            $nombrebbdd = $dni.'.'.$tipo;

            //Elegimos qué tipos de archivos queremos y su tamaño máximo en bytes
            $permitidos = array("image/jpg", "image/jpeg", "image/gif", "image/png");
            //16MB
            $limite_b = 16384*1024;
            
            if ($tipo===NULL OR $tipo=="")
            {
                $nombrebbdd="";
            }
            else{
            if ($nombreimg == !NULL && $im['size'] <= $limite_b && in_array($im['type'], $permitidos))
            {
                //Creamos una variable directorio la cual indicará dónde se guardará la imagen subida
                $directorio = $_SERVER['DOCUMENT_ROOT'].'/imagenesBD/';

                //Movemos la imagen temporal y la movemos al directorio indicado
                move_uploaded_file($im['tmp_name'],$directorio.$nombrebbdd);
            }
            else if ($im['size'] > $limite_b)
            {
                echo "El tamaño es superior al permitido</br>";
            }
            else if ($nombreimg == NULL)
            {

            }
            else
            {
                echo "El formato no es válido</br>";
            }
        }
        }

        function mandarEmail()
        {
            global $email, $nombre;
            $asunto = "Registro plataforma";
            $emailorigen = "emailpruebasevilla@gmail.com";
            $mensaje = "Hola ".$nombre.", su registro se hizo con éxito.<br>
            Link del Login: http://192.168.0.6/html/crearpass.html";

            require '../phpmailer/PHPMailerAutoload.php';
              $mail = new PHPMailer;                            // Passing `true` enables exceptions
            
                //Server settings                            // Enable verbose debug output
                $mail->isSMTP();                                      // Set mailer to use SMTP
                $mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
                $mail->SMTPAuth = true;                                 // SMTP password
                $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
                $mail->Port = 465;                                     // Enable SMTP authentication
                $mail->Username = $emailorigen;     // SMTP username
                $mail->Password = 'prueba123';                        // TCP port to connect to

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

