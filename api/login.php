<?php
  include_once("../private/common.php");
  if(! isset($obj["cs"],$obj["pass"])){
    http_response_code(404);
    print '{"status":false,"message":"wrong param"}';
  }
  $passhash=hash("sha256",$obj["cs"].$obj["pass"]);
  $stmt=$pdo->prepare("select * from stations where callsign=:cs AND password=:pass");
  $stmt->bindValue(":cs",$obj["cs"]);
  $stmt->bindValue(":pass",$passhash);
  $stmt->execute();
  $dat=$stmt->fetchAll();
  if( count($dat) ){
    $session = hash("sha256", str_shuffle('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz').time.$obj["cs"]);
    $stmt=$pdo->prepare("insert into sessions(id,station,limit) values(:id,:cs,:limit)");
    $stmt->bindValue(":cs",$obj["cs"]);
    $stmt->bindValue(":id",$session);
    $stmt->bindValue(":limit",time+7*24*60*60);
    $stmt->execute();
    print '{"status":false,"session":"'.$session.'"}'
  }else{
    print '{"status":false,"message":"wrong pass"}';
  }
?>
