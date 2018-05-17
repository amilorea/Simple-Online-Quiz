function submission(id){
	var paramObject = {};
	paramObject['id'] = id;
	
	var paramContent = {};
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
							if(flag) targetAnswerParent.classList.add('acceptedAnswer');
							else targetAnswerParent.classList.add('wrongAnswer');
						}
						targetAnswerParent.classList.remove('answerWrapper');
						targetAnswerParent.classList.remove('choosenAnswer');
						targetAnswerParent.classList.add('answerWrapperUnhover');
					}
				}
				var announcement = '<div class="announcement">Số điểm của bạn là </div>';
				notification(announcement, 'announcement');
				document.getElementById('submit-button').remove();
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
	request.open('POST', API + 'examSubmitHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
	onGoingFlag = false;
}