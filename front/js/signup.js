function fieldChanged(){
	
}

function touroku(){
	if (document.getElementById("passward") != document.getElementById("passreconfirm")){
		alert("パスワードが一致しません。");
		return false;
	}
	var data={};
	data.mailaddress=document.getElementById("mailaddress").value;
	data.callsign=document.getElementById("callsign").value;
	data.password=document.getElementById("password").value;
	var json=JSON.stringify(data);
	console.log(json);
}
