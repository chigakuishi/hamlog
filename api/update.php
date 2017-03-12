<?php
  include_once("./private/common.php");
  if(! isset($obj["session"],
    $obj["data"]
  )){
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
  $stmt->bindValue(":id"  ,$obj["data"]["id"],PDO::PARAM_INT);
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
  $stmt->bindValue(":id"  ,$obj["data"]["id"],PDO::PARAM_INT);
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
  $stmt->bindValue(":id"  ,$obj["data"]["id"],PDO::PARAM_INT);
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

  $stmt=$pdo->prepare(
    "insert into qsos(id,station,callsign,`date`,time,qth,my_qth,band,`mode`,rst,my_rst) ".
    " values (:id,:mycs,:cs,:date,:time,:qth,:my_qth,:band,:mode,:rst,:my_rst);"
  );
  $stmt->bindValue(":id"    ,$obj["data"]["id"],PDO::PARAM_INT);
  $stmt->bindValue(":mycs"  ,$obj["cs"],PDO::PARAM_STR);
  $stmt->bindValue(":cs"    ,$obj["data"]["main"]["callsign"],PDO::PARAM_STR);
  $stmt->bindValue(":date"  ,$obj["data"]["main"]["date"],PDO::PARAM_INT);
  $stmt->bindValue(":time"  ,$obj["data"]["main"]["time"],PDO::PARAM_INT);
  $stmt->bindValue(":qth"   ,$obj["data"]["main"]["qth"],PDO::PARAM_STR);
  $stmt->bindValue(":my_qth",$obj["data"]["main"]["my_qth"],PDO::PARAM_STR);
  $stmt->bindValue(":band"  ,$obj["data"]["main"]["band"],PDO::PARAM_STR);
  $stmt->bindValue(":mode"  ,$obj["data"]["main"]["mode"],PDO::PARAM_STR);
  $stmt->bindValue(":rst"   ,$obj["data"]["main"]["rst"],PDO::PARAM_INT);
  $stmt->bindValue(":my_rst",$obj["data"]["main"]["my_rst"],PDO::PARAM_INT);
  if(!$stmt->execute()){
    http_response_code(400);
    print '{"status":false,"message":"cannot put main data"}';
    $pdo->rollBack();
    exit();
  }
  $iid=$pdo->lastInsertId();
  foreach ($obj["data"]["option"] as $k => $v){
    $stmt=$pdo->prepare("insert into details(qso,question,answer,`type`) values(:qso,:q,:a,'option')");
    $stmt->bindValue(":qso",$iid,PDO::PARAM_INT);
    $stmt->bindValue(":q",$k,PDO::PARAM_STR);
    $stmt->bindValue(":a",$v,PDO::PARAM_STR);
    if(!$stmt->execute()){
      http_response_code(400);
      print '{"status":false,"message":"cannot put option data"}';
      $pdo->rollBack();
      exit();
    }
  }
  foreach ($obj["data"]["other"] as $k => $v){
    $stmt=$pdo->prepare("insert into details(qso,question,answer,`type`) values(:qso,:q,:a,'free')");
    $stmt->bindValue(":qso",$iid,PDO::PARAM_INT);
    $stmt->bindValue(":q",$k,PDO::PARAM_STR);
    $stmt->bindValue(":a",$v,PDO::PARAM_STR);
    if(!$stmt->execute()){
      http_response_code(400);
      print '{"status":false,"message":"cannot put option data"}';
      $pdo->rollBack();
      exit();
    }
  }
  foreach ($obj["data"]["other_free"] as $v){
    $stmt=$pdo->prepare("insert into memos(qso,memo) values(:qso,:memo)");
    $stmt->bindValue(":qso",$iid,PDO::PARAM_INT);
    $stmt->bindValue(":memo",$v,PDO::PARAM_STR);
    if(!$stmt->execute()){
      http_response_code(400);
      print '{"status":false,"message":"cannot put other_free data"}';
      $pdo->rollBack();
      exit();
    }
  }
  $pdo->commit();
  print '{"status":true}';
?>
