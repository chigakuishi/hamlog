<?php
  include_once("./private/common.php");
  if(! isset($obj["session"])){
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

  $stmt=$pdo->prepare("select * from qsos where station=:cs order by `date` DESC,time DESC;");
  $stmt->bindValue(":cs",$obj["cs"],PDO::PARAM_STR);
  if(!$stmt->execute()){
    http_response_code(400);
    print '{"status":false,"message":"cannot select"}';
    $pdo->rollBack();
    exit();
  }
  $dat=$stmt->fetchAll();
  for($i=0;$i<count($dat);$i++){
    for($ii=count($dat[$i])/2 -1;$ii>=0;$ii--){
      unset($dat[$i][$ii]);
    }
  }
  $output["status"]=true;
  $output["data"]=$dat;
  print json_encode($output);
?>
