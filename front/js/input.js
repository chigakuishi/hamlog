function openButton(){
	document.getElementById('buttons').style.display="block";	
	document.getElementById('save').disabled="disabled";	
}

function changeData(){
	document.getElementById('convert').disabled ="disabled";	
	document.getElementById('save').disabled ="";	
}

function saveData(){
	document.getElementById('save').disabled ="disabled";	
	document.getElementById('convert').disabled ="";	
	window.location.reload();
  var data = document.getElementById("data").value
}

