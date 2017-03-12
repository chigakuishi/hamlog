<?php
  include_once("./private/common.php");
  if(! isset($obj["session"], $obj["id"])){
    http_response_code(400);
    print '{"status":false,"message":"wrong param"}';
    exit();
  }
  $stmt=$pdo->prepare("select station from sessions where id=:session AND `limit` > :time");
  $stmt->bindValue(":session",$obj["session"],PDO::PARAM_STR);
  $stmt->bindValue(":time",time(),PDO::PARAM_INT);
  $stmt->execute();
  $dat=$stmt->fetchAll();
  if(count($dat)){
    $obj["cs"]=$dat[0]["station"];
  }else{
    http_response_code(400);
    print '{"status":false,"message":"unable session"}';
    exit();
  }
  $pdo->beginTransaction();
  $sql=
    "delete details from details join qsos on details.qso = qsos.id ".
    "where qsos.station=:mycs AND qsos.id=:id";
  $stmt=$pdo->prepare($sql);
  $stmt->bindValue(":mycs",$obj["cs"],PDO::PARAM_STR);
  $stmt->bindValue(":id"  ,$obj["id"],PDO::PARAM_INT);
  if(!$stmt->execute()){
    http_response_code(400);
    print '{"status":false,"message":"cannot delete data"}';
    $pdo->rollBack();
    exit();
  }

  $sql=
    "delete memos from memos join qsos on memos.qso = qsos.id ".
    "where qsos.station=:mycs AND qsos.id=:id";
  $stmt=$pdo->prepare($sql);
  $stmt->bindValue(":mycs",$obj["cs"],PDO::PARAM_STR);
  $stmt->bindValue(":id"  ,$obj["id"],PDO::PARAM_INT);
  if(!$stmt->execute()){
    http_response_code(400);
    print '{"status":false,"message":"cannot delete data"}';
    $pdo->rollBack();
    exit();
  }

  $sql=
    "delete from qsos where qsos.station=:mycs AND qsos.id=:id";
  $stmt=$pdo->prepare($sql);
  $stmt->bindValue(":mycs",$obj["cs"],PDO::PARAM_STR);
  $stmt->bindValue(":id"  ,$obj["id"],PDO::PARAM_INT);
  if(!$stmt->execute()){
    http_response_code(400);
    print '{"status":false,"message":"cannot delete data"}';
    $pdo->rollBack();
    exit();
  }
  if($stmt->rowCount()!=1){
    http_response_code(400);
    print '{"status":false,"message":"data not found"}';
    $pdo->rollBack();
    exit();
  }

  $pdo->commit();
  print '{"status":true}';
?>
