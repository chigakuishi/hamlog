if(getCookie("session")==""){
  window.location.href="login.html";
}

window.onload=()=>{
  $.ajax({
    type:"post",	
    url:"https://re75.info/hamlog/api/index.php",	
    data:JSON.stringify({"session":getCookie("session")}),	
    contentType: 'application/json',	
    dataType: "json",	
    success: function(obj) {	
      console.log(obj);
      if (obj.status) {
        for(var i=0;i<obj.data.length;i++){
          $("#datatable").append(
            "<tr>"+
            "<td>"+obj.data[i].date+"</td>"+
            "<td>"+obj.data[i].time+"</td>"+
            "<td>"+obj.data[i].callsign+"</td>"+
            "<td>"+obj.data[i].qth+"</td>"+
            "<td>"+obj.data[i].band+"</td>"+
            "<td>"+obj.data[i].mode+"</td>"+
            "<td><a href='show.html#"+obj.data[i].id+"'> Click </a></td>"+
            "</tr>"
          );
        }
      }else{
        alert("エラーです．やり直してください．");
        console.log(err);
      }
    },
    error: function(err) {	
      alert("エラーです．やり直してください．");
      console.log(err);
    } 
  });
}
function getCookie(c_name){
  var st="";
  var ed="";
  if(document.cookie.length>0){
    // クッキーの値を取り出す
    st=document.cookie.indexOf(c_name + "=");
    if(st!=-1){
      st=st+c_name.length+1;
      ed=document.cookie.indexOf("; ",st);
      if(ed==-1) ed=document.cookie.length;
      // 値をデコードして返す
      return unescape(document.cookie.substring(st,ed));
    }
  }
  return "";
}
