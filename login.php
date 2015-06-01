<?php
session_start();
$postdata = file_get_contents("php://input");

$request = json_decode($postdata);
 $email = $request->username;
 $password = $request->password;
$data = [];
if($email == "oscar@test.nl" && $password == "test") {
  $_SESSION['AUTHENTICATED'] = true;
  $data['status'] = true;
}else{
  $data['false'] = false;
}

echo json_encode($data);
