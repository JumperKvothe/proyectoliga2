<?php
	session_start();
	include('./conexion.php');

	$dni = $_SESSION['dni'];
	$id = $_POST['id'];

	if ($id == 1){
    	$coin = $_POST['coin'];
		coin();
	}
	else if ($id == 2){
		$nombre=$_POST['nombre'];
		agregaramigo();
	}
	else if ($id == 3){
		recibirpeticion();
	}
	else if ($id == 4){
		$confirmacion=$_POST['confirm'];
		$idr=$_POST['idr'];
		$idp=$_POST['idp'];
		cambiarestado();
	}
	else if ($id==5){
		genteonline();
	}
	else if ($id==6)
	{
		amigosconectados();
	}
	else if ($id==7)
	{ 
		$nombre=$_POST['nombre'];
		cargarchat();
	}
	else if ($id == 8){
		$msj=$_POST['msj'];
		$nombre=$_POST['nombre'];
		insertarmsj();
	}else{

	}

	function coin(){
		//ID=1
    	global $conexion, $dni, $coin;
	    $consulta = "UPDATE usuario SET coin = $coin WHERE dni = '$dni'";
	    $resultado = mysqli_query($conexion,$consulta) or die (mysqli_error($conexion));
    }

	function agregaramigo(){
		//ID=2
		global $conexion, $dni, $nombre, $nombrep;	
		$consulta7 = "SELECT nombre FROM usuario WHERE dni='$dni'";
		$resultado7 = mysqli_query($conexion,$consulta7) or die (mysqli_error($conexion));
		if($row = mysqli_fetch_array($resultado7)){
			$nombrep = $row["nombre"];
		}
		if ($nombrep!=$nombre)	
		{
			$consulta = "SELECT dni FROM usuario WHERE nombre = '$nombre'";
			$resultado = mysqli_query($conexion,$consulta) or die (mysqli_error($conexion));
				if ($resultado->num_rows == 0){
					// No hay un usuario con ese dni
					$error = 1;
					// Para mostrar el error
					//$consulta5 = "INSERT INTO amigos (id_p, id_r) VALUES ('0', '0')";
					//$resultado5 = mysqli_query($conexion,$consulta5) or die (mysqli_error($conexion));
				}else{
					// Hay un usuario con ese dni
					$error = 0;
					// Saco el id del usuario que agrega y lo guardo en una variable
					$consulta2 = "SELECT id FROM usuario WHERE dni = '$dni'";
					$resultado2 = mysqli_query($conexion,$consulta2) or die (mysqli_error($conexion));
					if($row = mysqli_fetch_array($resultado2)){
						$id1 = $row["id"];
					}
					// Saco el id del usuario al que agrego y lo guardo en una variable
					$consulta3 = "SELECT id FROM usuario WHERE nombre = '$nombre'";
					$resultado3 = mysqli_query($conexion,$consulta3) or die (mysqli_error($conexion));
					
					if($row = mysqli_fetch_array($resultado3)){
						$id2 = $row["id"];
					}
					//Compruebo el estado de la petición para ver si existe ya esa petición
					$consulta6 = "SELECT estado FROM amigos WHERE id_p='$id1' AND id_r='$id2'";
					$resultado6 = mysqli_query($conexion,$consulta6) or die (mysqli_error($conexion));
					$consulta7 = "SELECT estado FROM amigos WHERE id_p='$id2' AND id_r='$id1'";
					$resultado7 = mysqli_query($conexion,$consulta7) or die (mysqli_error($conexion));
					if ($resultado6->num_rows == 0 && $resultado7->num_rows == 0)
					{
					$consulta4 = "INSERT INTO amigos (id_p, id_r) VALUES ('$id1', '$id2')";
					$resultado4 = mysqli_query($conexion,$consulta4) or die (mysqli_error($conexion));
					}else{
						// Existe esa tupla
						if($row = mysqli_fetch_array($resultado6)){
							$estado = $row["estado"];
						}
						if($row = mysqli_fetch_array($resultado7)){
							$estado = $row["estado"];
						}
						if ($estado == 0){
							$error = 3;
						}else{
							$error = 4;
						}
					}
				}
		}
		else
		{
			//Error por escribir tu propio nombre
			$error=2;

		}

		$obj = ["error" => $error, "nombre" => $nombre];
		echo json_encode($obj);
		/*Mensaje de error:
		0: No hay error
		1: No existe el nombre de usuario
		2: No puedes escribir tu propio nombre
		3: Ya existe la petición de amistad y sigue pendiente
		4: Ambos usuarios son ya amigos*/
	}

	function recibirpeticion(){
		global $conexion, $dni;

		//ID=3
		//Saco el id del usuario que está logueado en el perfil, el cuál recibirá la petición de amistad.
		$consulta = "SELECT id FROM usuario WHERE dni='$dni'";
		$resultado = mysqli_query($conexion,$consulta) or die (mysqli_error($conexion));
		if($row = mysqli_fetch_array($resultado)){
			$idr = $row["id"];
		}

		//Compruebo que hay 1 fila con petición de amistad.
		$consulta2 = "SELECT * FROM amigos WHERE id_r='$idr' AND estado=0 limit 1";
		$resultado2 = mysqli_query($conexion,$consulta2) or die (mysqli_error($conexion));
		if ($resultado2->num_rows == 0)
		{
			$pet = 0;
			$nombre = "c";
			$idp = 0;
			$idr = 0;
		}
		else
		{
			//Si hay una fila con la petición de amistad saco el nombre del que envió la petición.
			$pet = 1;
			$consulta3 = "SELECT nombre FROM usuario WHERE id= (SELECT id_p FROM amigos WHERE id_r='$idr' AND estado=0 limit 1)";
			$resultado3 = mysqli_query($conexion, $consulta3) or die (mysqli_error($conexion));
			if($row = mysqli_fetch_array($resultado3)){
				$nombre = $row["nombre"];
			}

			//Saco el id del usuario que envió la petición.
			$consulta4 = "SELECT id FROM usuario WHERE nombre='$nombre'";
			$resultado4 = mysqli_query($conexion, $consulta4) or die (mysqli_error($conexion));
			if($row = mysqli_fetch_array($resultado4)){
				$idp = $row["id"];
			}

		}
		$obj = ["error" => $pet, "nombre" => $nombre, "idr" => $idr, "idp" => $idp];
		echo json_encode($obj);
	}

	function cambiarestado()
	{
		global $conexion, $confirmacion, $idr, $idp;
		//ID=4

		//Si el usuario ha confirmado  ha petición de amistad.
		if($confirmacion==1)
		{
			//Ponemos el estado de la petición a 1, que significa que son amigos.
			$consulta = "UPDATE amigos SET estado=1 WHERE id_r='$idr' AND id_p='$idp'";
			$resultado = mysqli_query($conexion, $consulta) or die (mysqli_error($conexion));
		}
		//Si ha rechazado la petición de amistad.
		else
		{
			//Borramos esa tupla con la petición de la base de datos.
			$consulta2 = "DELETE FROM amigos WHERE id_r='$idr' AND id_p='$idp'";
			$resultado2 = mysqli_query($conexion, $consulta2) or die (mysqli_error($conexion));
		}
	}

	function genteonline()
	{
		global $conexion, $dni;
		//ID=5

		$consulta = "SELECT id FROM usuario WHERE dni = '$dni'";
			$resultado = mysqli_query($conexion,$consulta) or die (mysqli_error($conexion));
				if($row = mysqli_fetch_array($resultado)){
					$id = $row["id"];
				}
		// Tiempo máximo de espera
		$time = 1 ;

		// Momento que entra en línea
		$date = time() ;

		// Tiempo Limite de espera 
		$limite = $date-$time*5 ;

		// si se supera el tiempo limite (3 minutos) lo borramos
		$consulta2 = "DELETE FROM gente_online WHERE fecha < $limite";
		$resultado2 = mysqli_query($conexion,$consulta2) or die (mysqli_error($conexion));

		// tomamos todos los usuarios en linea
		$consulta3 = "SELECT * FROM gente_online WHERE id='$id'";
		$resultado3 = mysqli_query($conexion,$consulta3) or die (mysqli_error($conexion));

		// Si son los mismo actualizamos la tabla gente_online
		if ($resultado3->num_rows != 0) {
		$consulta4 = "UPDATE gente_online SET fecha='$date' WHERE id='$id'";
		$resultado4 = mysqli_query($conexion,$consulta4) or die (mysqli_error($conexion));
		}

		// de lo contrario insertamos los nuevos
		else {
			
		$consulta5 = "INSERT INTO gente_online (id,fecha) VALUES ('$id','$date')";
		$resultado5 = mysqli_query($conexion,$consulta5) or die (mysqli_error($conexion));
		}
		
		// almacenamos la consulta en la variable $usuarios
		$consulta6 = "SELECT * FROM gente_online";
		$resultado6 = mysqli_query($conexion,$consulta6) or die (mysqli_error($conexion));
		$usuarios = $resultado6->num_rows;

			$obj = ["id" => $id, "fecha" => $date];
			echo json_encode($obj);
	}

	function amigosconectados()
	{
		global $conexion, $dni;
		//ID=6

		//creamos unos arrays para los id tanto de los que pueden estar en la columna que reciben como los que puede estar en los que envían
		$arrayidp=array();
		$arrayidr=array();
		//Creamos un array tipo JSON para poder tener la lista de amigos
		$arraynombre= array();

		//Sacamos el id del usuario que está en el perfil
		$consulta = "SELECT id FROM usuario WHERE dni='$dni'";
		$resultado = mysqli_query($conexion,$consulta) or die (mysqli_error($conexion));
		if($row = mysqli_fetch_array($resultado)){
			$id = $row["id"];
		}

		//Sacamos los id de los que estan en la columna que reciben peticiones del usuario del perfil
		$consulta2 = "SELECT id_r FROM amigos WHERE id_p=$id AND estado = 1";
		$resultado2 = mysqli_query($conexion,$consulta2) or die (mysqli_error($conexion));
		while($row = mysqli_fetch_array($resultado2)){
			array_push($arrayidr, $row["id_r"]);
		}

		//Sacamos los id de los que estan en la columna que enviaron petición al usuario del perfil
		$consulta3 = "SELECT id_p FROM amigos WHERE id_r=$id AND estado = 1";
		$resultado3 = mysqli_query($conexion,$consulta3) or die (mysqli_error($conexion));
		while($row = mysqli_fetch_array($resultado3)){
			array_push($arrayidp, $row["id_p"]);
		}

		if($arrayidr)
			{
			foreach ($arrayidr as $valor)
		   		{
		   			$valor = intval($valor);
			   		$consulta4 = "SELECT nombre FROM usuario WHERE id=$valor AND id = (SELECT id FROM gente_online WHERE id=$valor)";
					$resultado4 = mysqli_query($conexion,$consulta4) or die (mysqli_error($conexion));
					if($row = mysqli_fetch_array($resultado4)){
						array_push($arraynombre, $row["nombre"]);
					}	
		   		}
			}

		if($arrayidp)
			{
			foreach ($arrayidp as $valor)
		   		{
		   			$valor = intval($valor);
			   		$consulta4 = "SELECT nombre FROM usuario WHERE id=$valor AND id = (SELECT id FROM gente_online WHERE id=$valor)";
					$resultado4 = mysqli_query($conexion,$consulta4) or die (mysqli_error($conexion));
					if($row = mysqli_fetch_array($resultado4)){
						array_push($arraynombre, $row["nombre"]);
					}
		   		}
			}
			
		//Enviamos los datos mediante JSON
		echo json_encode($arraynombre);
	}

	function cargarchat()
	{
		//ID=7
		global $conexion, $dni, $nombre;
		$arraymensaje=array();
		$cont=1;

		$consulta= "SELECT id FROM usuario WHERE nombre='$nombre'";
		$resultado = mysqli_query($conexion,$consulta) or die (mysqli_error($conexion));
		if($row = mysqli_fetch_array($resultado)){
			$idr = $row["id"];
		}

		$consulta2= "SELECT id FROM usuario WHERE dni='$dni'";
		$resultado2 = mysqli_query($conexion,$consulta2) or die (mysqli_error($conexion));
		if($row = mysqli_fetch_array($resultado2)){
			$idp = $row["id"];
		}

		$consulta3= "SELECT emisor, mensaje FROM mensajes WHERE (emisor=$idp AND receptor=$idr) OR (receptor=$idp AND emisor=$idr) ORDER BY hora DESC LIMIT 13";
		$resultado3 = mysqli_query($conexion,$consulta3) or die (mysqli_error($conexion));
		while($row = mysqli_fetch_array($resultado3)){
			
			if($row["emisor"] == $idp){
				$arraymensaje["e$cont"] = $row["mensaje"];
			}else{
				$arraymensaje["d$cont"] = $row["mensaje"];
			}
			$cont += 1;
		}

		//echo json_encode($arraymensajep + $arraymensajer);
		echo json_encode($arraymensaje);
	}

	function insertarmsj(){
		//ID=8
		global $conexion, $dni, $msj, $nombre;

		$time = time();

		$consulta= "SELECT id FROM usuario WHERE nombre='$nombre'";
		$resultado = mysqli_query($conexion,$consulta) or die (mysqli_error($conexion));
		if($row = mysqli_fetch_array($resultado)){
			$idr = $row["id"];
		}

		$consulta2= "SELECT id FROM usuario WHERE dni='$dni'";
		$resultado2 = mysqli_query($conexion,$consulta2) or die (mysqli_error($conexion));
		if($row = mysqli_fetch_array($resultado2)){
			$idp = $row["id"];
		}

		$consulta3 = "INSERT INTO mensajes (emisor, receptor, mensaje, hora) VALUES ('$idp', '$idr', '$msj', '$time')";
		$resultado3 = mysqli_query($conexion,$consulta3) or die (mysqli_error($conexion));

		$obj = ["msj" => $msj, "nombre" => $nombre];
		echo json_encode($obj);
	}

?>