var sentences;
var obj = {};
var ele ={};

function openButton(){ //テキストに入力するとボタンが出現する
	document.getElementById('buttons').style.display="block";	
	document.getElementById('save').disabled="disabled";	
}

function changeData(){ //
	document.getElementById('convert').disabled ="disabled";	
	document.getElementById('save').disabled ="";	
	sentences = document.getElementById('data').value;
	dataList = sentences.split(/\n/);
	for(var i=0;i<dataList.length;i=i+1){
		ele = dataList[i].split(":");
		if(ele[0]=="date"||ele[0]=="freq"||ele[0]=="time"||ele[0]=="rst"||ele[0]=="power"){
			obj[ele[0]] = Number(ele[1]);
		}else{	
			obj[ele[0]] = ele[1];
		}
	}
}

function saveData(){
	document.getElementById('save').disabled ="disabled";	
	document.getElementById('convert').disabled ="";	
	window.location.reload();
}

/*
var obj ={
  "main":{
    "callsign":str,
    "date":int,
    "time":int,
    "gth":str,
    "freq":double,
    "mode":str,
    "my-gth":str,
    "rst":int,
  },

  "option":{
    "name":str,
    "ant":obj,
    "rig":str,
    "power":double,
    "qsl":bool,
    "first":bool,
    "home":str,
    "aniv":str,
    "oneway":str,
  },

  "other":{
		"work":str,
  },
	
	"other-free":{
		"","","","",""		
	}
}
*/
