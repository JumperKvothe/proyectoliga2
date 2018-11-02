<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

//https://cybmeta.com/ajax-con-json-y-php-ejemplo-paso-a-paso

$url="";


$json = file_get_contents($url);
$json_data = json_decode($json, true);
$items = array();
$cont=0;
foreach ($json_data as $result) {
	if($result['ActiveUserName'] > '-1'){
        $cont++;
        //echo '<pre>' . print_r($result, true) . '</pre>';
        $name[1][$cont] = $result['ComputerID'];        
        //$items[] = $result['Total'];
        
        //echo $result->resultado[1]->Name; //5004
        //echo $result->resultado[$cont]->ActiveUserName; //5004
    }
}
$mateslocas=(100*$cont)/50;
echo '[{"CPUON":"';
echo $mateslocas.'"}]';
echo json_encode($json);
?>