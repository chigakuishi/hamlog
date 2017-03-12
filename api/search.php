<?php
  include_once("./private/common.php");
  if(! isset($obj["session"],$obj["callsign"])){
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

  $stmt=$pdo->prepare("select * from qsos where (callsign=:cs OR callsign LIKE :lcs ) AND station=:mycs order by `date` DESC,time DESC;");
  $stmt->bindValue(":mycs",$obj["cs"],PDO::PARAM_STR);
  $stmt->bindValue(":lcs",$obj["callsign"]."/_");
  $stmt->bindValue(":cs",$obj["callsign"],PDO::PARAM_INT);
  if(!$stmt->execute()){
    http_response_code(400);
    print '{"status":false,"message":"cannot select"}';
    $pdo->rollBack();
    exit();
  }

  $qsodat=$stmt->fetchAll();
  for($i=0;$i<count($qsodat);$i++){
    for($ii=count($qsodat[$i])/2 -1;$ii>=0;$ii--){
      unset($qsodat[$i][$ii]);
    }
  }
  $output["data"]=Array();
  for($i=0;$i<count($qsodat);$i++){
    $qsoid=$qsodat[$i]["id"];
    $output["data"][$i]["main"]=$qsodat[$i];
    $stmt=$pdo->prepare("select question,answer from details where qso=:id AND type='option';");
    $stmt->bindValue(":id",$qsoid,PDO::PARAM_INT);
    if(!$stmt->execute()){
      http_response_code(400);
      print '{"status":false,"message":"cannot select"}';
      $pdo->rollBack();
      exit();
    }

    $dat=$stmt->fetchAll();
    for($ii=0;$ii<count($dat);$ii++){
      for($iii=count($dat[$ii])/2 -1;$iii>=0;$iii--){
        unset($dat[$ii][$iii]);
      }
    }
    $output["data"][$i]["option"]=$dat;
    
    $stmt=$pdo->prepare("select question,answer from details where qso=:id AND type='other';");
    $stmt->bindValue(":id",$qsoid,PDO::PARAM_INT);
    if(!$stmt->execute()){
      http_response_code(400);
      print '{"status":false,"message":"cannot select"}';
      $pdo->rollBack();
      exit();
    }

    $dat=$stmt->fetchAll();
    for($ii=0;$ii<count($dat);$ii++){
      for($iii=count($dat[$ii])/2 -1;$iii>=0;$iii--){
        unset($dat[$ii][$iii]);
      }
    }
    $output["data"][$i]["other"]=$dat;

    $stmt=$pdo->prepare("select memo from memos where qso=:id;");
    $stmt->bindValue(":id",$qsoid,PDO::PARAM_INT);
    if(!$stmt->execute()){
      http_response_code(400);
      print '{"status":false,"message":"cannot select"}';
      $pdo->rollBack();
      exit();
    }

    $dat=$stmt->fetchAll();
    for($ii=0;$ii<count($dat);$ii++){
      for($iii=count($dat[$ii])/2 -1;$iii>=0;$iii--){
        unset($dat[$ii][$iii]);
      }
    }
    $output["data"][$i]["other_free"]=$dat;
  }
  $output["status"]=true;
  print json_encode($output);
?>
