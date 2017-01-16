<?php
  include_once("./private/common.php");
  if(! isset($obj["callsign"],$obj["password"])){
    http_response_code(400);
    print '{"status":false,"message":"wrong param"}';
    exit();
  }
  $obj["cs"]=strtoupper($obj["callsign"]);
  $passhash=hash("sha256",$obj["cs"].$obj["password"]);
  $stmt=$pdo->prepare("select * from stations where callsign=:cs AND password=:pass");
  $stmt->bindValue(":cs",$obj["cs"],PDO::PARAM_STR);
  $stmt->bindValue(":pass",$passhash,PDO::PARAM_STR);
  $stmt->execute();
  $dat=$stmt->fetchAll();
  if( count($dat) ){
    $session = hash("sha256", str_shuffle('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz').time().$obj["cs"]);
    $stmt=$pdo->prepare("insert into sessions(id,station,`limit`) values(:id,:cs,:limit)");
    $stmt->bindValue(":cs",$obj["cs"],PDO::PARAM_STR);
    $stmt->bindValue(":id",$session,PDO::PARAM_STR);
    $stmt->bindValue(":limit",time()+7*24*60*60,PDO::PARAM_INT);
    $stmt->execute();
    print '{"status":true,"session":"'.$session.'"}';
  }else{
    http_response_code(400);
    print '{"status":false,"message":"wrong pass"}';
  }
?>
