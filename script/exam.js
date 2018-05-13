function getAllExam(mode){
	//Bắt đầu request
	onload(document.getElementById('notification'), 30);
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			logParam(this.responseText);
			var returnObject = JSON.parse(this.responseText);
			unload(document.getElementById('notification'));
			switch(this.status){
			case 200:
				if(mode === 'simple'){
					var content = returnObject['content'];
					var prototypeRow = document.getElementById('prototype');
					for(let data of content){
						var newRow = prototypeRow.cloneNode(true);
						newRow.getElementsByClassName('idCol')[0].innerHTML = data[id];
						newRow.getElementsByClassName('nameCol')[0].innerHTML = data[name];
						newRow.getElementsByClassName('teacherCol')[0].innerHTML = data[teacher];
						newRow.getElementsByClassName('pointCol')[0].innerHTML = data[yourpoint];
						prototypeRow.after(newRow);
					}
				} else {
					var content = returnObject['content'];
					var prototypeRow = document.getElementById('prototype');
					for(let data of content){
						var newRow = prototypeRow.cloneNode(true);
						newRow.getElementsByClassName('idCol')[0].innerHTML = data[id];
						newRow.getElementsByClassName('nameCol')[0].innerHTML = '<div onclick="loadMiddlePage(\'exam.html\', function(){ return getExam(' + data[id] + ') })">' + data[name] + '</div>';
						newRow.getElementsByClassName('teacherCol')[0].innerHTML = data[teacher];
						newRow.getElementsByClassName('countCol')[0].innerHTML = data[yourpoint];
						newRow.getElementsByClassName('pointCol')[0].innerHTML = data[yourpoint];
						newRow.getElementsByClassName('yourPointCol')[0].innerHTML = data[yourpoint];
						prototypeRow.after(newRow);
					}
				}
				break;
			case 400:
				notification(returnObject['message'], 'error');
				break;
			case 404:
				notification(returnObject['message'], 'error');
				loadMiddlePage('main.html');
				break;
			}
		}
	};
	request.open('GET', API + 'examInfoHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send();
}
function getExam(id){
	var paramObject = {};
	paramObject['id'] = id;
	var param = JSON.stringify(paramObject);
	logParam(param);
	
	//Bắt đầu request
	onload(document.getElementById('notification'), 30);
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			logParam(this.responseText);
			var returnObject = JSON.parse(this.responseText);
			unload(document.getElementById('notification'));
			switch(this.status){
			case 200:
				document.getElementById('introduction') = '<div class="exam-name">' + returnObject['name'] + '</div>--<div class="exam-author">' + returnObject['teacher'] + '</div>--';
				var content = returnObject['content'];
				var prototypeRow = document.getElementById('prototype');
				var cnt = 1;
				for(let question of content){
					var newRow = prototypeRow.cloneNode(true);
					newRow.getElementsByClassName('questionId')[0].innerHTML = 'Câu ' + cnt;
					newRow.getElementsByClassName('questionId')[0].setAttribute('id') = question[id];
					newRow.getElementsByClassName('questionScore')[0].innerHTML = question[score];
					newRow.getElementsByClassName('questionContent')[0].innerHTML = question[content];
					newRow.getElementsByClassName('answer')[0].innerHTML = question[anwser1];
					newRow.getElementsByClassName('answer')[1].innerHTML = question[anwser2];
					newRow.getElementsByClassName('answer')[2].innerHTML = question[anwser3];
					newRow.getElementsByClassName('answer')[3].innerHTML = question[anwser4];
					prototypeRow.after(newRow);
					cnt += 1;
				}
				break;
			case 400:
				notification(returnObject['message'], 'error');
				break;
			case 401:
				notification(returnObject['message'], 'error');
				loadMiddlePage('login.html');
				break;
			case 404:
				notification(returnObject['message'], 'error');
				loadMiddlePage('main.html');
				break;
			}
		}
	};
	request.open('GET', API + 'examHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}