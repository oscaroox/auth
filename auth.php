<?php
session_start();
$auth = [];
if(isset($_SESSION['AUTHENTICATED'])) {
  $auth['authenticated'] = true;
}else{
  $auth['authenticated'] = false;
}

echo json_encode($auth);
