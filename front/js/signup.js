functionn touroku(){
	if (document.getElementById("passward") != document.getElementById("passreconfirm")){
		alert("パスワードが一致しません。");return false;
	}

var data={};
data.mailaddress=document.getElementById("mail").value;
data.callsign=document.getElementById("callsign");
data.password=document.getElementById("password");
var json=JSON.stringify(data);
console.log(json);
