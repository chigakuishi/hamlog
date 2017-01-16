var sentences;
var calls =[];
var ele ={};
var obj ={
  "main":{	/*必須の項目*/ },
  "option":{	/*よくある項目*/ },
  "other":{	/*その他の項目 "work":str */ },
	"other_free":[	/*単語など "","","","","" */	]
};

function openButton(){ //テキストに入力するとボタンが出現する
	document.getElementById('buttons').style.display="block";	
	document.getElementById('save').disabled="disabled";
	document.getElementById('convert').disabled ="";	
}

function changeData(){ 
	//変換ボタンを消し、保存ボタンを出現させる
	document.getElementById('convert').disabled ="disabled";	
	document.getElementById('save').disabled ="";	
	//データの変換
	sentences = document.getElementById('data').value;
	dataList = sentences.split(/\n/);
	for(var i=0;i<dataList.length;i++){
		if(str.match(/---/)){	//"---"で区切る
		  calls.push(obj);
		}else if(! dataList[i].match(/:/)){	//":"がないもの
			obj["other_free"].push(dataList[i]);
		}else{	//":"があるもの
			ele = dataList[i].split(":");
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
	console.log(JSON.stringify(obj));
}

function saveData(){
	// 保存ボタンを消し、リロードする
	document.getElementById('save').disabled ="disabled";	
	document.getElementById('convert').disabled ="";	
	window.location.reload();	
}
