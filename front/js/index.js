var obj = JSON.parse('{"status":true,"data":[{"id":"2","station":"JI1XRF","callsign":"7m3url","date":"20160306","time":"215","qth":"\u6803\u6728\u770c\u9e7f\u6cbc\u5e02","my_qth":"\u795e\u5948\u5ddd\u770c\u85e4\u6ca2\u5e02","band":"144","mode":"CW","rst":"599","my_rst":"599"},{"id":"1","station":"JI1XRF","callsign":"ji1xrf","date":"20160305","time":"1215","qth":"\u6771\u4eac\u90fd\u4e16\u7530\u8c37\u533a","my_qth":"\u795e\u5948\u5ddd\u770c\u85e4\u6ca2\u5e02","band":"430","mode":"SSB","rst":"59","my_rst":"59"}]}');

for(var i=0;i<obj.data.lenth;i++){
	document.getElementById("datatable").innerHTML += "<th>";
	for(key in obj.data){
		document.getElementById("datatable").innerHTML += "<td>"+obj.data[key]+"</td>";
	}
	document.getElementById("datatable").innerHTML += "</th>";
}
