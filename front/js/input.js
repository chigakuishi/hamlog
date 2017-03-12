if(getCookie("session")==""){
  window.location.href="login.html";
}
var def={
  "main":{
    "my_qth":"東京都世田谷区",
    "qth":"不明"
  }
};
var sentences;
var calls =[];
var ele ={};
var obj ={
  "main":{	/*必須の項目*/ },
  "option":{	/*よくある項目*/ },
  "other":{	/*その他の項目 "work":str */ },
	"other_free":[	/*単語など "","","","","" */	]
};
var waitJson="";
window.onload=()=>{
  $("#tmp").val(localStorage.tmp);
  $("#data").val(localStorage.edit);
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

function saveTmp(){
  localStorage.tmp=$("#tmp").val();
}

function useTmp(){
  var now = new Date();
  var edit=$("#data").val();
  var tmp=$("#tmp").val();
  if(edit.slice(-1)!='\n' && edit.length){
    edit+='\n';
  }
  if(tmp.slice(-1)!='\n'){
    tmp+='\n';
  }
  tmp=tmp.replace(/__today__/,String(now.getFullYear()+( "0"+( now.getMonth()+1 ) ).slice(-2)+("0"+now.getDate() ).slice(-2)));
  tmp=tmp.replace(/__now__/,String(("0"+now.getHours()).slice(-2)+("0"+now.getMinutes()).slice(-2) ));
  $("#data").val(edit+tmp);
  $("#data").focus();
}

function enterText(show){
  localStorage.edit=$("#data").val();
  document.getElementById('buttons').style.display="block";	
	document.getElementById('save').disabled="disabled";
	document.getElementById('convert').disabled ="";	
  waitJson="";
  if(!show){
    var endLinePoint = $("#data").val().indexOf("\n",$("#data").get(0).selectionStart);
    endLinePoint = endLinePoint == -1?$("#data").val().length:endLinePoint;
    var nowEditLine = $("#data").val().substr(0,endLinePoint).split(/\n/).pop();
    var match = nowEditLine.match(/^cs:([^\/]*)(?:\/\S*)*$/);
    if(match){
      var cs = match[1].toUpperCase();
      searchCallsign(cs);
    }
  }
}
function showFrame(url){
  $("#frame").attr("src",url);
}
function searchCallsign(cs){
  $.ajax({
    type:"post",	
    url:"../api/search.php",	
    data:JSON.stringify({"session":getCookie("session"),"callsign":cs}),	
    contentType: 'application/json',	
    dataType: "json",	
    success: function(obj) {	
      if (obj.status) {
        $("#datatable").html("<tr><th>日付</th><th>時間</th><th>コールサイン</th><th>場所</th><th>周波数</th><th>変調方式</th><th>RST</th><th>詳細</th></tr>");
        for(var i=0;i<obj.data.length;i++){
          $("#datatable").append(
            "<tr>"+
            "<td>"+obj.data[i].main.date+"</td>"+
            "<td>"+obj.data[i].main.time+"</td>"+
            "<td>"+obj.data[i].main.callsign+"</td>"+
            "<td>"+obj.data[i].main.qth+"</td>"+
            "<td>"+obj.data[i].main.band+"</td>"+
            "<td>"+obj.data[i].main.mode+"</td>"+
            "<td>"+obj.data[i].main.my_rst+"/"+obj.data[i].main.rst+"</td>"+
            "<td><button onClick='showFrame(\"show.html?id="+obj.data[i].main.id+"#"+obj.data[i].main.id+"\")' target='info-frame'> Click </a></td>"+
            "</tr>"
          );
        }
      }else{
        alert("エラーです．やり直してください．");
      }
    },
    error: function(err) {	
      alert("エラーです．やり直してください．");
      console.log(err);
    } 
  });
}

function changeData(){ 
  var sday;
  calls=[];
	document.getElementById('convert').disabled ="disabled";	
	document.getElementById('save').disabled ="";	
	sentences = document.getElementById('data').value;
	sentences = sentences.replace(/^([1-5][0-9])\/([1-5][0-9])$/g,(m,p1,p2)=>(
    "rst:"+p1+"\nmy_rst:"+p2
  ));
  sentences = sentences.replace(/cs:/g,"callsign:");
	document.getElementById('data').value = sentences;
  dataList = sentences.split(/\n/);
	for(var i=0;i<dataList.length;i++){
    if(dataList[i]=="" && dataList.length-1 != i) continue;
		if(dataList[i].match(/^-{3,}$/) || dataList.length-1 == i){	//"---"で区切る
      obj.main.my_qth = obj.main.my_qth ||def.main.my_qth;
      obj.main.qth = obj.main.qth ||def.main.my_qth;
      obj.main.callsign = obj.main.callsign.toUpperCase();
      sday = obj.main.date;
      if(!(obj.main.my_qth && obj.main.qth && obj.main.callsign && obj.main.callsign && obj.main.time
        && obj.main.band && obj.main.mode && obj.main.rst &&obj.main.my_rst
      )){
        alert("不足事項があります"+JSON.stringify(obj));
        enterText();
        return;
      }

		  calls.push(obj);
			obj ={
				"main":{},
				"option":{},
				"other":{},
				"other_free":[]
			};
		}else if(! dataList[i].match(/:/)){	//":"がないもの
      if(dataList[i] == "\\sday" || dataList[i]=="\\SDAY"){
        obj.main.date = sday;
      }else{
        obj["other_free"].push(dataList[i]);
      }
		}else{	//":"があるもの
			ele = dataList[i].split(/\s?:\s?/);
			if(	//mainに入れる要素
				ele[0]=="callsign"||
				ele[0]=="date"||
				ele[0]=="time"||
				ele[0]=="qth"||
				ele[0]=="band"||
				ele[0]=="mode"||
				ele[0]=="my_qth"||
				ele[0]=="my_rst"||
				ele[0]=="rst"
			){
				if(	//mainの中の数字扱いのvalue
					ele[0]=="date"||
					ele[0]=="freq"||
					ele[0]=="time"||
					ele[0]=="rst"||
					ele[0]=="band"||
					ele[0]=="my_rst"
				){	//数字に変換
					obj["main"][ele[0]] = Number(ele[1]);
				}else{	//文字列のまま
					obj["main"][ele[0]] = ele[1];
				}
			}else if(	//optionに入れる要素
				ele[0]=="name"||
				ele[0]=="ant"||
				ele[0]=="rig"||
				ele[0]=="power"||
				ele[0]=="qsl"||
				ele[0]=="first"||
				ele[0]=="home"||
				ele[0]=="aniv"||
				ele[0]=="oneway"
			){	//全部文字列で入れる
				obj["option"][ele[0]] = ele[1];	
			}else{	//otherに入れる要素（すべて文字列）
				obj["other"][ele[0]] = ele[1];
			}
		}	
	}
  var jsonObj={};
  jsonObj["data"]=calls;
  jsonObj["session"]=getCookie("session");
  waitJson=jsonObj;
}

function saveData(){
	// 保存ボタンを消し、リロードする
	document.getElementById('save').disabled ="disabled";	
	document.getElementById('convert').disabled ="";
  $.ajax({
    type:"post",	
    url:"../api/create.php",	
    data:JSON.stringify(waitJson),	
    contentType: 'application/json',	
    dataType: "json",	
    success: function(obj) {	
      if (obj.status) {
        alert("送信しました");
        localStorage.edit="";
        window.location.reload();	
      }else{
        alert("エラーです．やり直してください．");
      }
    },
    error: function(err) {	
      alert("エラーです．やり直してください．");
      console.log(err);
    } 
  });
}
