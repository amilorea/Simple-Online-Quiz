
function searchExam(mode){
	// Tìm kiếm các kỳ thi sẵn có
	var paramObject = {};
	if(mode !== 'restore') {
		paramObject['id'] = document.getElementById('idSearch').value.trim();
		paramObject['name'] = document.getElementById('examnameSearch').value.trim();
		paramObject['teacher'] = document.getElementById('teacherSearch').value.trim();
		//paramObject['totalpoint'] = parseFloat(document.getElementById('pointSearch').value.trim());
		//paramObject['questioncount'] = parseInt(document.getElementById('questionCountSearch').value.trim());
	} else {
		paramObject['id'] = '';
		paramObject['name'] = '';
		paramObject['teacher'] = '';
		//paramObject['totalpoint'] = '';
		//paramObject['questioncount'] = '';
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
			logParam(returnObject);
			unload(document.getElementById('notification'));
			switch(this.status){
			case 200:
				var content = returnObject['content'];
				var prototypeRow = document.getElementById('prototype');
				// Xóa kết quả hiện tại
				var searchable = document.getElementsByClassName('searchable');
				while(searchable.length != 0)
					searchable[0].remove();
				// Thêm các kết quả mới
				for(var cnt = content.length; cnt > 0; cnt--){
					var data = content[cnt - 1];
					var newRow = prototypeRow.cloneNode(true);
					
					newRow.getElementsByClassName('idCol')[0].innerHTML = data['id'];
					newRow.getElementsByClassName('nameCol')[0].innerHTML = '<div onclick="loadMiddlePage(\'exam.html\', function(){ return getExam(' + data['id'] + ') })">' + data['name'] + '</div>';
					newRow.getElementsByClassName('teacherCol')[0].innerHTML = data['teacher'];
					newRow.getElementsByClassName('countCol')[0].innerHTML = data['questioncount'];
					newRow.getElementsByClassName('pointCol')[0].innerHTML = data['totalpoint'];
					
					newRow.classList.remove('hide');
					newRow.classList.add('searchable');
					
					newRow.setAttribute('id', 'exam' + data['id']);
					prototypeRow.after(newRow);
				}
				break;
			case 400:
				notification(returnObject['message'], 'error');
				break;
			default:
				notification(returnObject['message'], 'error');
				loadMiddlePage('main.html');
				break;
			}
		}
	};
	request.open('POST', API + 'examSearchHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}
function getExamHistory(){
	// Tải lịch sử thi của người dùng hiện tại
	// Bắt đầu request
	onload(document.getElementById('loader'), 30);
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			logParam(this.responseText);
			var returnObject = JSON.parse(this.responseText);
			unload(document.getElementById('loader'));
			switch(this.status){
			case 200:
				var content = returnObject['content'];
				var prototypeRow = document.getElementById('prototype');
				for(var cnt = content.length; cnt > 0; cnt--){
					var data = content[cnt - 1];
					var newRow = prototypeRow.cloneNode(true);
					newRow.getElementsByClassName('idCol')[0].innerHTML = data['id'];
					newRow.getElementsByClassName('nameCol')[0].innerHTML = data['name'];
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
			default:
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
var currentExam = {};
function examPreparing(){
	// Chuẩn bị bộ đáp án của người dùng để gửi đi chấm sau khi làm xong
	currentExam = {};
	var group = document.getElementsByClassName('question');
	for(var i = 1; i < group.length; i++){
		currentExam[group[i].getAttribute('id')] = '0';
	}
	onGoingFlag = true;
}
function getExam(id){
	// Tải các câu hỏi từ bộ đề có id tương ứng
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
				// Giới thiệu kỳ thi
				document.getElementById('submit-button').setAttribute('onclick', 'submission(' + id + ')');
				document.getElementById('introduction').innerHTML = '<div class="exam-name">' + returnObject['name'] + '</div><div class="exam-author">✻ ' + returnObject['teacher'] + ' ✻</div>';
				
				// Các câu hỏi
				var content = returnObject['content'];
				var prototypeQuestion = document.getElementById('prototype');
				for(var cnt = content.length; cnt > 0; cnt--){
					var question = content[cnt - 1];
					var newQuestion = prototypeQuestion.cloneNode(true);
					newQuestion.getElementsByClassName('questionId')[0].innerHTML = 'Câu ' + cnt;
					newQuestion.getElementsByClassName('questionId')[0].setAttribute('id', question['id']);
					newQuestion.getElementsByClassName('questionScore')[0].innerHTML = '(' + question['score'] + ' điểm)';
					newQuestion.setAttribute('data-score', question['score']);
					newQuestion.getElementsByClassName('questionContent')[0].innerHTML = question['content'];
					
					var anwser = newQuestion.getElementsByClassName('answer');
					var anwserButton = newQuestion.getElementsByClassName('answerChecker');
					var str = 'chooseAnswer(this, ' + question['id'] + ')';
					for(var i = 1; i <= 4; i++){
						var targetAnswer = anwserButton[i - 1];
						anwser[i - 1].innerHTML = question['anwser' + i];
						targetAnswer.setAttribute('onchange', str);
						targetAnswer.setAttribute('name', question['id']);
						targetAnswer.setAttribute('value', String.fromCharCode((i - 1) + 'A'.charCodeAt()));
					}
					
					newQuestion.setAttribute('id', question['id']);
					newQuestion.classList.remove('hide');
					prototypeQuestion.after(newQuestion);
				}
				examPreparing();
				break;
			case 401:
				notification(returnObject['message'], 'error');
				loadMiddlePage('login.html');
				break;
			case 404:
				notification(returnObject['message'], 'error');
				loadMiddlePage('main.html');
				break;
			default:
				notification(returnObject['message'], 'error');
				break;
			}
		}
	};
	request.open('POST', API + 'examHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}
function chooseAnswer(thisElement, id){
	// Ghi lại kết quả lựa chọn của người dùng
	var group = document.getElementsByName(id);
	for(var i = 0; i < group.length; i++){
		group[i].parentElement.classList.remove('choosenAnswer');
	}
	thisElement.parentElement.classList.add('choosenAnswer');
	currentExam[id] = thisElement.getAttribute('value');
}
function examCheck(){
	// Đề phòng người dùng lỡ rời khỏi trang trong quá trình thi
	if(onGoingFlag === false) return true;
	if(confirm("Bạn có chắc muốn rời khỏi bài thi? (Kết quả sẽ không được lưu)") === false){
		return false;
	} else onGoingFlag = false;
	return true;
}
function submission(id){
	var paramObject = {};
	paramObject['id'] = id;
	var paramContent = {};
	
	// Đề phòng người dùng nộp bài trong khi chưa làm hết
	var keyList = Object.keys(currentExam);
	var confirmFlag = false;
	for(let question of keyList){
		if(currentExam[question] === '0' && confirmFlag === false){
			if(confirm("Bạn có chắc muốn nộp bài thi? (Vẫn còn những câu chưa hoàn thành)"))
				confirmFlag = true;
		}
		paramContent['' + question] = currentExam[question];
	}
	paramObject['content'] = paramContent;
	var param = JSON.stringify(paramObject);
	logParam(param);
	
	//Bắt đầu request
	onload(document.getElementById('submit-button'));
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			logParam(this.responseText);
			var returnObject = JSON.parse(this.responseText);
			logParam(returnObject);
			unload(document.getElementById('submit-button'), 'Nộp bài');
			switch(this.status){
			case 200:
				var content = returnObject['content'];
				var keyList = Object.keys(content);
				for(var cnt = 0; cnt < keyList.length; cnt++){
					var data = content[keyList[cnt]];
					var target = document.getElementById(keyList[cnt]);
					target.getElementsByClassName('questionScore')[0].innerHTML = '(' + data['score'] + ' / ' + data['maxscore'] + ' điểm)';
					var anwserButton = target.getElementsByClassName('answerChecker');
					var flag = (data['answer'] === currentExam[keyList[cnt]]);
					for(var i = 1; i <= 4; i++){
						var targetAnswer = anwserButton[i - 1];
						var targetAnswerParent = targetAnswer.parentElement;
						targetAnswer.setAttribute('disabled', '');
						if(targetAnswerParent.classList.contains('choosenAnswer')){
							// Nếu người dùng chọn sai
							if(!flag) targetAnswerParent.classList.add('wrongAnswer');
						}
						if(targetAnswer.value === data['answer']){
							// Hiển thị đáp án đúng
							targetAnswerParent.classList.add('acceptedAnswer');
						}
						targetAnswerParent.classList.remove('answerWrapper');
						targetAnswerParent.classList.remove('choosenAnswer');
						targetAnswerParent.classList.add('answerWrapperUnhover');
					}
				}
				var announcement = '<div class="announcement">Số điểm của bạn là ' + returnObject['totalpoint'] + '</div>';
				notification(announcement, 'announcement');
				document.getElementById('submit-button').innerHTML = 'Trở về';
				document.getElementById('submit-button').setAttribute('onclick', 'loadMiddlePage(\'exam-list.html\', function(){ return searchExam() })');
				break;
			case 401:
				notification(returnObject['message'], 'error');
				loadMiddlePage('login.html');
				break;
			case 404:
				notification(returnObject['message'], 'error');
				loadMiddlePage('main.html');
				break;
			default:
				notification(returnObject['message'], 'error');
				break;
			}
		}
	};
	request.open('POST', API + 'examSubmitHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
	onGoingFlag = false;
}