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
  for($i=0;$i<count($obj["data"]);$i++){
    $stmt=$pdo->prepare(
      "insert into qsos(station,callsign,`date`,time,qth,my_qth,band,`mode`,rst,my_rst) ".
      " values (:mycs,:cs,:day,:time,:qth,:my_qth,:band,:mode,:rst,:my_rst);"
    );
    $stmt->bindValue(":mycs"  ,$obj["cs"],PDO::PARAM_STR);
    $stmt->bindValue(":cs"    ,$obj["data"][$i]["main"]["callsign"],PDO::PARAM_STR);
    $stmt->bindValue(":day"   ,$obj["data"][$i]["main"]["day"],PDO::PARAM_INT);
    $stmt->bindValue(":time"  ,$obj["data"][$i]["main"]["time"],PDO::PARAM_INT);
    $stmt->bindValue(":qth"   ,$obj["data"][$i]["main"]["qth"],PDO::PARAM_STR);
    $stmt->bindValue(":my_qth",$obj["data"][$i]["main"]["my_qth"],PDO::PARAM_STR);
    $stmt->bindValue(":band"  ,$obj["data"][$i]["main"]["band"],PDO::PARAM_STR);
    $stmt->bindValue(":mode"  ,$obj["data"][$i]["main"]["mode"],PDO::PARAM_STR);
    $stmt->bindValue(":rst"   ,$obj["data"][$i]["main"]["rst"],PDO::PARAM_INT);
    $stmt->bindValue(":my_rst",$obj["data"][$i]["main"]["my_rst"],PDO::PARAM_INT);
    if(!$stmt->execute()){
      http_response_code(400);
      print '{"status":false,"message":"cannot put main data"}';
      $pdo->rollBack();
      exit();
    }
    $iid=$pdo->lastInsertId();
    foreach ($obj["data"][$i]["option"] as $k => $v){
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
    foreach ($obj["data"][$i]["other"] as $k => $v){
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
    foreach ($obj["data"][$i]["other_free"] as $v){
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
  }
  $pdo->commit();
  print '{"status":true}';
?>
