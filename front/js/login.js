function loginStart(){
	var data={};
	data.callsign=$("#user_id").val();
	data.password=$("#password").val();
	var json=JSON.stringify(data);
  
  $.ajax({
    type:"post",	
    url:"../api/login.php",	
    data:JSON.stringify(data),	
    contentType: 'application/json',	
    dataType: "json",	
    success: function(obj) {	
      if (obj.status) {
        document.cookie="session="+obj.session;
        window.location.href="index.html";
      }else{
        alert("ログインエラー\nリトライしてください");
      }
    },
    error: function(err) {	
      alert("ログインエラー\nリトライしてください");
      console.log(err);
    }
  });
}
