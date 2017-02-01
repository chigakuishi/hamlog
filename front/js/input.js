if(getCookie("session")==""){
  window.location.href="login.html";
}
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
  console.log(edit+tmp);
  $("#data").val(edit+tmp);
  $("#data").focus();
}
function openButton(){ //テキストに入力するとボタンが出現する
  localStorage.edit=$("#data").val();
	document.getElementById('buttons').style.display="block";	
	document.getElementById('save').disabled="disabled";
	document.getElementById('convert').disabled ="";	
  waitJson="";
}

function changeData(){ 
  calls=[];
	//変換ボタンを消し、保存ボタンを出現させる
	document.getElementById('convert').disabled ="disabled";	
	document.getElementById('save').disabled ="";	
	//データの変換
	sentences = document.getElementById('data').value;
	sentences = sentences.replace(/([1-5][0-9])\/([1-5][0-9])/g,(m,p1,p2)=>(
    "rst:"+p1+"\nmy_rst:"+p2
  ));
  sentences = sentences.replace(/cs:/g,"callsign:");
	document.getElementById('data').value = sentences;
  dataList = sentences.split(/\n/);
	for(var i=0;i<dataList.length;i++){
		if(dataList[i].match(/^-{3,}$/)){	//"---"で区切る
		  calls.push(obj);
			obj ={
				"main":{},
				"option":{},
				"other":{},
				"other_free":[]
			};
		}else if(! dataList[i].match(/:/)){	//":"がないもの
			obj["other_free"].push(dataList[i]);
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
	console.log(JSON.stringify(jsonObj));
  waitJson=jsonObj;
}

function saveData(){
	// 保存ボタンを消し、リロードする
	document.getElementById('save').disabled ="disabled";	
	document.getElementById('convert').disabled ="";
  $.ajax({
    type:"post",	
    url:"https://re75.info/hamlog/api/create.php",	
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
