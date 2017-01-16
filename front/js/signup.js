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
}
