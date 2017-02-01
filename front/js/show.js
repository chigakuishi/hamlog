if(getCookie("session")==""){
  window.location.href="login.html";
}

window.onload=()=>{
  $.ajax({
    type:"post",	
    url:"../api/show.php",	
    data:JSON.stringify({"session":getCookie("session"),"qso":Number(location.hash.substring(1))}),	
    contentType: 'application/json',	
    dataType: "json",	
    success: function(obj) {	
      console.log(obj);
      if (obj.status) {
        console.log(obj.data.main);
        $("#datatable").append(
          "<tr>"+
          "<td>"+obj.data.main.date+"</td>"+
          "<td>"+obj.data.main.time+"</td>"+
          "<td>"+obj.data.main.callsign+"</td>"+
          "<td>"+obj.data.main.qth+"</td>"+
          "<td>"+obj.data.main.band+"</td>"+
          "<td>"+obj.data.main.mode+"</td>"+
          "<td>"+obj.data.main.my_rst+"/"+obj.data.main.rst+"</td>"+
          "</tr>"
        );
        for(var i=0;i<obj.data.option.length;i++){
          $("#detail").append(
            "<tr>"+
            "<th>"+obj.data.option[i].question+"</th><td>"+obj.data.option[i].answer+"</td>"+
            "</tr>"
          );
        }
        for(var i=0;i<obj.data.other.length;i++){
          $("#detail").append(
            "<tr>"+
            "<th>"+obj.data.other[i].question+"</th><td>"+obj.data.other[i].answer+"</td>"+
            "</tr>"
          );
        }
        for(var i=0;i<obj.data.other_free.length;i++){
          console.log(obj.data.other_free[i].memo);
          $("#detail").append(
            "<tr>"+
            "<th>memo:</th><td>"+obj.data.other_free[i].memo+"</td>"+
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
