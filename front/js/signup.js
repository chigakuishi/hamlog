function touroku(){
	if (document.getElementById("password").value !== document.getElementById("passreconfirm").value){
		alert("パスワードが一致しません。");
		return false;
	}
	var data={};
	data.mailaddress=document.getElementById("mailaddress").value;
	data.callsign=document.getElementById("callsign").value;
	data.password=document.getElementById("password").value;
	var json=JSON.stringify(data);
	console.log(json);
  $.ajax({
    type:"post",	
    url:"https://re75.info/hamlog/api/signup.php",	
    data:JSON.stringify(data),	
    contentType: 'application/json',	
    dataType: "json",	
    success: function(obj) {	
      window.location.href="login.html";
    },
    error: function(err) {	
      alert("エラー\nリトライしてください");
      console.log(err);
    }
  });
}
