<?php
  include_once("./private/common.php");
  if(! isset($obj["callsign"],$obj["password"])){
    http_response_code(400);
    print '{"status":false,"message":"wrong param"}';
    exit();
  }
  $obj["cs"]=strtoupper($obj["callsign"]);
  $passhash=hash("sha256",$obj["cs"].$obj["password"]);
  $stmt=$pdo->prepare("insert into  stations(callsign,password) values (:cs, :pass);");
  $stmt->bindValue(":cs",$obj["cs"],PDO::PARAM_STR);
  $stmt->bindValue(":pass",$passhash,PDO::PARAM_STR);
  $stmt->execute();
  print '{"status":true}';
?>
