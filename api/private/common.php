<?php
  ini_set( 'display_errors', 1 );
  //mb_internal_encoding("UTF-8");
  function hecho($str){
    echo htmlspecialchars($str);
  }
  try{#データベース初期化{{{
    $pdo=new PDO('mysql:host=localhost;dbname=ham;charset=utf8',"hamlog","",
      array(PDO::ATTR_EMULATE_PREPARES => false));
  }catch(PDOException $e){
    print "データベースに接続できません $e";
    exit;
  }//}}}
  header("Content-Type:text/json; charset=utf-8");
  header('Access-Control-Allow-Origin: *');
  $json_string = file_get_contents('php://input');
  $obj = json_decode($json_string,true);
?>
