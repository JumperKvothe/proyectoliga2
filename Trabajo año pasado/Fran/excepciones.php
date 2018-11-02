<?php

$centro= "Elite Sevilla";

function logs($msg, $centro, $filetype){
$log  = "Localizacion: ".$_SERVER['REMOTE_ADDR'].' - '.date("Y-m-d H:i:s").PHP_EOL.
        "Paso de ejecucion: ".$msg.PHP_EOL.
        "Centro: ".$centro.PHP_EOL.
        "-------------------------".PHP_EOL;      
file_put_contents('./logs/log_'.$centro.'_'.$filetype.'_'.date("Y-m-d H.i.s").'.txt', $log, FILE_APPEND);
}

// throw new Exception("."); 
try
{
	//Genero la fecha actual y el nombre del fichero
	$date = date('d-m-Y');
	$nombrefich=$date . "-onlinepc.json";

	//Primer dia del mes y ultimo dia del mes para hacer la llamada
	$dia1mes = date('Y/m/01 10:00:00');
	$today = date('Y/m/d 24:00:00');

	$dia1messtr = strtotime($dia1mes);
	$todaystr = strtotime($today);

	//Excepciones si ocurre algun error
	if(empty($dia1messtr)){
		$msg="Error obteniendo los datos del primer dia del mes.";
		$filetype="error";
		logs($msg, $centro, $filetype);		
		throw new Exception("Error obteniendo los datos del primer dia del mes."); 
	}else{
		if(empty($todaystr)){
			$msg="Error obteniendo los datos del ultimo dia del mes.";
			$filetype="error";
			logs($msg, $centro, $filetype);
			throw new Exception("Error obteniendo los datos del ultimo dia del mes."); 
		}else{
			$msg1="#1 correcto | ";
		}
	}
}catch(Exception $e){
	throw $e;
}try{
	//Hago la llamada a la BD
	$url = "http://xxxxxxxx/computers";
	$response = file_get_contents($url);

	//Excepciones si ocurre algun error
	if($url===FALSE){
		$msg="Error obteniendo los datos del servidor.";
		$filetype="error";
		logs($msg, $centro, $filetype);
		throw new Exception("Error obteniendo los datos del servidor 1."); 
	}else{
		if($response===FALSE){
		$msg="Error obteniendo los datos del servidor.";
		$filetype="error";
		logs($msg, $centro, $filetype);			
		throw new Exception("Error obteniendo los datos del servidor 2."); 
		}else{
			$msg2="#2 correcto | ";
		}
	}
}catch(Exception $e){
	throw $e;
}try{
	//Saco el resultado y lo guardo
	$data = json_decode($response);
	$arraygrabado= file_put_contents($nombrefich, $response);

	//Excepciones si ocurre algun error
	if(empty($arraygrabado)){
		$msg="Error obteniendo los datos del servidor.";
		$filetype="error";
		logs($msg, $centro, $filetype);		
		throw new Exception("Error obteniendo los datos del servidor 3."); 
	}else{
		$msg3="#3 correcto";
		$msgtotal=$msg1 . $msg2 . $msg3;
		echo "echo Correcto";
		$filetype="correcto";
		logs($msgtotal, $centro, $filetype);
	}
}catch(Exception $e){
	throw $e;
}
?>