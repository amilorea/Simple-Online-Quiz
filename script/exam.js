function getAllExam(){
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
				var content = returnObject['content'];
				var prototypeRow = document.getElementById('prototype');
				for(let data of content){
					var newRow = prototypeRow.cloneNode(true);
					newRow.getElementsByClassName('idCol')[0].innerHTML = data['id'];
					newRow.getElementsByClassName('nameCol')[0].innerHTML = '<div onclick="loadMiddlePage(\'exam.html\', function(){ return getExam(' + data['id'] + ') })">' + data['name'] + '</div>';
					newRow.getElementsByClassName('teacherCol')[0].innerHTML = data['teacher'];
					newRow.getElementsByClassName('countCol')[0].innerHTML = data['countcol'];
					newRow.getElementsByClassName('pointCol')[0].innerHTML = data['totalpoint'];
					newRow.setAttribute('id', 'exam' + data['id']);
					newRow.classList.remove('hide');
					prototypeRow.after(newRow);
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
function getExamHistory(){
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
				var content = returnObject['content'];
				var prototypeRow = document.getElementById('prototype');
				for(let data of content){
					var newRow = prototypeRow.cloneNode(true);
					newRow.getElementsByClassName('idCol')[0].innerHTML = data['id'];
					newRow.getElementsByClassName('nameCol')[0].innerHTML = '<div onclick="loadMiddlePage(\'exam.html\', function(){ return getExam(' + data['id'] + ') })">' + data['name'] + '</div>';
					newRow.getElementsByClassName('teacherCol')[0].innerHTML = data['teacher'];
					newRow.getElementsByClassName('pointCol')[0].innerHTML = data['yourpoint'];
					newRow.setAttribute('id', 'exam' + data['id']);
					newRow.classList.remove('hide');
					prototypeRow.after(newRow);
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
	request.open('GET', API + 'examHistoryHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send();
}
/*function getExam(id){
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
				var prototypeQuestion = document.getElementById('prototype');
				var cnt = 1;
				for(let question of content){
					var newQuestion = prototypeQuestion.cloneNode(true);
					newQuestion.getElementsByClassName('questionId')[0].innerHTML = 'Câu ' + cnt;
					newQuestion.getElementsByClassName('questionId')[0].setAttribute('id') = question['id'];
					newQuestion.getElementsByClassName('questionScore')[0].innerHTML = question['score'];
					newQuestion.getElementsByClassName('questionContent')[0].innerHTML = question['content'];
					var anwser = newQuestion.getElementsByClassName('answer');
					var anwserButton = newQuestion.getElementsByClassName('answerChecker');
					var str = 'chooseAnwser(this, ' + question['id'] + ')';
					for(var i = 0; i < 4; i++){
						anwser[i].innerHTML = question['anwser' + i];
						anwserButton[i].setAttribute('onchange', str);
						anwserButton[i].setAttribute('name', question['id']);
						anwserButton[i].setAttribute('value', i);
					}
					newQuestion.setAttribute['id'] = question['id'];
					prototypeQuestion.after(newQuestion);
					cnt += 1;
				}
				examPreparing();
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
function searchExam(){
	var paramObject = {};
	paramObject['id'] = document.getElementById('search-id').value.trim();
	paramObject['name'] = document.getElementById('search-name').value.trim();
	paramObject['teacher'] = document.getElementById('search-teacher').value.trim();
	paramObject['point'] = document.getElementById('search-point').value.trim();
	paramObject['count'] = document.getElementById('search-count').value.trim();
	paramObject['your-point'] = document.getElementById('search-your-point').value.trim();
	var param = JSON.stringify(paramObject);
	getExamHistory();
}
*/
var currentExam = {};
var onGoingFlag = false;
function examPreparing(){
	currentExam = {};
	var group = document.getElementsByClassName('question');
	for(var i = 1; i < group.length; i++){
		currentExam[group[i].getAttribute('id')] = -1;
	}
	onGoingFlag = true;
}
function chooseAnwser(thisElement, id){
	var group = document.getElementsByName(id);
	for(var i = 0; i < group.length; i++){
		group[i].parentElement.classList.remove('choosenAnwser');
	}
	thisElement.parentElement.classList.add('choosenAnwser');
	currentExam[id] = parseInt(thisElement.getAttribute('value'));
	console.log(currentExam);
}
function examCheck(){
	if(onGoingFlag === false) return true;
	if(confirm("Bạn có chắc muốn rời khỏi bài thi? (Kết quả sẽ không được lưu)")){
		return false;
	} return true;
}
/*
function submission(){
	var paramObject = {};
	paramObject['id'] = id;
	
	var keyList = Object.keys(currentExam);
	var confirmFlag = false;
	for(let question of keyList){
		if(currentExam[question] === -1 && confirmFlag === false){
			if(confirm("Bạn có chắc muốn nộp bài thi? (Vẫn còn những câu chưa hoàn thành)"))
				confirmFlag = true;
		}
		paramObject['question'] = currentExam['question'];
	}
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
	request.open('POST', API + 'examHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}*/