function searchExamOwned(){
	//Bắt đầu request
	onload(document.getElementById('loader'), 30);
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			logParam(this.responseText);
			var returnObject = JSON.parse(this.responseText);
			logParam(returnObject);
			unload(document.getElementById('loader'));
			switch(this.status){
			case 200:
				var content = returnObject['content'];
				var prototypeRow = document.getElementById('prototype');
				var searchable = document.getElementsByClassName('searchable');
				// Xóa kết quả hiện tại
				while(searchable.length != 0)
					searchable[0].remove();
				// Thêm các kết quả mới
				for(var cnt = content.length; cnt > 0; cnt--){
					var data = content[cnt - 1];
					var newRow = prototypeRow.cloneNode(true);
					newRow.getElementsByClassName('idCol')[0].innerHTML = data['id'];
					newRow.getElementsByClassName('nameCol')[0].innerHTML = '<div title="Sửa đề thi" onclick="loadMiddlePage(\'exam-manage.html\', function(){ return editExam(' + data['id'] + ') })">' + data['name'] + '</div>';
					newRow.getElementsByClassName('countCol')[0].innerHTML = data['questioncount'];
					newRow.getElementsByClassName('pointCol')[0].innerHTML = data['totalpoint'];
					
					newRow.classList.remove('hide');
					newRow.classList.add('searchable');
					newRow.setAttribute('id', data['id']);
					
					newRow.getElementsByClassName('editButton')[0].setAttribute('onclick', 'editExamHandle(this, "' + data['id'] + '")');
					newRow.getElementsByClassName('cancelButton')[0].setAttribute('onclick', 'cancelExamHandle(this, "' + data['id'] + '")');
					newRow.getElementsByClassName('deleteButton')[0].setAttribute('onclick', 'deleteExamHandle(this, "' + data['id'] + '")');
					prototypeRow.after(newRow);
				}
				break;
			case 401:
				notification(returnObject['message'], 'error');
				loadMiddlePage('login.html');
				break;
			default:
				notification(returnObject['message'], 'error');
				break;
			}
		}
	};
	request.open('GET', TEACHER_API + 'examInfoHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send();
}
function examManagePreparing(id){
	globalExamId = id;
}
var globalExamId;
var globalCountingId;
var currentGlobalId = 1000000000;
var globalId = 1000000000;
function insertContestHandle(t){
	var paramObject = {};
	paramObject['contestname'] = document.getElementById('insert-name').value.trim();
	var param = JSON.stringify(paramObject);
	logParam(param);
	
	//Bắt đầu request
	onload(t);
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			logParam(this.responseText);
			var returnObject = JSON.parse(this.responseText);
			unload(t, 'Thêm');
			switch(this.status){
			case 200:
				notification(returnObject['message'], 'success');
				searchExamOwned();
				break;
			case 401:
				notification(returnObject['message'], 'error');
				loadMiddlePage('login.html');
				break;
			default:
				notification(returnObject['message'], 'error');
				break;
			}
		}
	};
	request.open('POST', TEACHER_API + 'examInsertHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}
function saveExamHandle(t, id){
	var paramObject = {};
	paramObject['id'] = id
	paramObject['name'] = document.getElementById('examNameUpdate').value.trim();
	logParam(paramObject);
	var param = JSON.stringify(paramObject);
	logParam(param);
	
	// Bắt đầu request
	onload(t);
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			logParam(this.responseText);
			var returnObject = JSON.parse(this.responseText);
			unload(t, 'Sửa');
			var cancelButton = t.nextElementSibling;
			cancelButton.click();
			switch(this.status){
			case 200:
				notification(returnObject['message'], 'success');
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
	request.open('POST', TEACHER_API + 'examEditHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}
function editExamHandle(t, id){
	var cancelButton = t.nextElementSibling;
	var removeButton = cancelButton.nextElementSibling;
	
	// Kích hoạt nút hủy
	cancelButton.removeAttribute('disabled');
	cancelButton.classList.remove('hide');
	
	// Ẩn nút xóa
	removeButton.setAttribute('disabled', '');
	removeButton.classList.add('hide');
	
	// Tắt mọi nút chỉnh sửa trừ chính nó
	var allEditButton = document.getElementsByClassName('editButton');
	for(var i = 0; i < allEditButton.length; i++){
		allEditButton[i].setAttribute('disabled', true);
	}
	t.removeAttribute('disabled');
	
	// Thay đổi nút sửa thành nút lưu
	t.classList.add('saveButton');
	t.classList.remove('editButton');
	t.attributes['onclick'].value = 'saveExamHandle(this, "' + id + '")';
	t.innerHTML = 'Lưu';
	
	var selectedRow = document.getElementById(id);
	
	var examname = selectedRow.getElementsByClassName('nameCol')[0];
	examname.append(createDynamicInput('examName', examname));
}
function cancelExamHandle(t, id){
	var removeButton = t.nextElementSibling;
	var activeButton = t.previousElementSibling;
	
	//Vô hiệu mọi nút hủy
	var allCancelButton = document.getElementsByClassName('cancelButton');
	for(var i = 0; i < allCancelButton.length; i++){
		allCancelButton[i].setAttribute('disabled', true);
		allCancelButton[i].classList.add('hide');
	}
	
	//Kích hoạt lại mọi nút sửa
	var allEditButton = document.getElementsByClassName('editButton');
	for(var i = 0; i < allEditButton.length; i++){
		allEditButton[i].removeAttribute('disabled');
	}
	
	//Thay đổi nút lưu thành nút sửa
	activeButton.classList.remove('saveButton');
	activeButton.classList.add('editButton');
	activeButton.attributes['onclick'].value = 'editExamHandle(this, "' + id + '")';
	activeButton.innerHTML = 'Sửa';
	
	//Hiện nút xóa
	removeButton.removeAttribute('disabled');
	removeButton.classList.remove('hide');
	
	//Hủy các input
	var selectedRow = document.getElementById(id).getElementsByTagName('input')[0].remove();
}
function deleteExamHandle(t, id){
	var paramObject = {};
	paramObject['id'] = id;
	var param = JSON.stringify(paramObject);
	logParam(param);
	
	//Bắt đầu request
	onload(t);
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			logParam(this.responseText);
			var returnObject = JSON.parse(this.responseText);
			unload(t, 'Xóa');
			switch(this.status){
			case 200:
				notification(returnObject['message'], 'success');
				var target = document.getElementById(id);
				target.remove();
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
	request.open('POST', TEACHER_API + 'examDeleteHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}
function editExam(id){
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
				document.getElementById('introduction').innerHTML = '<div class="exam-name">' + returnObject['name'] + '</div>';
				var content = returnObject['content'];
				globalCountingId = content.length;
				var prototypeQuestion = document.getElementById('prototype');
				for(var cnt = globalCountingId; cnt > 0; cnt--){
					var question = content[cnt - 1];
					var newQuestion = prototypeQuestion.cloneNode(true);
					// Nội dung câu hỏi và bảng điểm
					newQuestion.getElementsByClassName('questionId')[0].innerHTML = 'Câu ' + cnt;
					newQuestion.getElementsByClassName('scoreInput')[0].value = question['score'];
					newQuestion.getElementsByClassName('questionInput')[0].value = question['content'];
					
					var anwser = newQuestion.getElementsByClassName('answerInput');
					for(var i = 1; i <= 4; i++){
						anwser[i - 1].value = question['anwser' + i];
					}
					// Đáp án
					var selectedOption = question['correct'].charCodeAt() - 'A'.charCodeAt();
					newQuestion.getElementsByClassName('correctAnswer')[0].selectedIndex = selectedOption;
					newQuestion.getElementsByClassName('correctAnswer')[0].getElementsByTagName('option')[selectedOption].setAttribute('selected','');
					
					// Thông tin khác
					newQuestion.setAttribute('id', question['id']);
					newQuestion.classList.remove('hide');
					
					// Nút bấm
					newQuestion.getElementsByClassName('removeButton')[0].setAttribute('onclick', 'removeQuestion(this, ' + question['id'] + ')');
					newQuestion.getElementsByClassName('saveButton')[0].setAttribute('onclick', 'saveQuestion(this, ' + question['id'] + ')');
					prototypeQuestion.after(newQuestion);
				}
				examManagePreparing(id);
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
	request.open('POST', TEACHER_API + 'examHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}
function addQuestion(){
	// Các câu hỏi mới sử dụng id tự động là 1000000000, sau khi được chấp nhận server sẽ gửi lại id mới được cấp
	notification('Đã thêm', 'success');
	var prototypeQuestion = document.getElementById('prototype');
	var newQuestion = prototypeQuestion.cloneNode(true);
	newQuestion.getElementsByClassName('questionId')[0].innerHTML = 'Câu hỏi mới';
	newQuestion.setAttribute('id', currentGlobalId);
	newQuestion.classList.remove('hide');
	newQuestion.getElementsByClassName('removeButton')[0].setAttribute('onclick', 'removeQuestion(this, ' + currentGlobalId + ')');
	newQuestion.getElementsByClassName('saveButton')[0].setAttribute('onclick', 'saveQuestion(this, ' + currentGlobalId + ')');
	prototypeQuestion.after(newQuestion);
	currentGlobalId++;
}
function saveQuestion(t, id){
	var paramObject = {};
	if(id >= globalId){
		// Nếu id được lưu lớn hơn 1000000000, đây là thao tác thêm câu hỏi mới
		logParam('New question');
		logParam(id);
		var target = document.getElementById(id);
		paramObject['id'] = globalExamId;
		paramObject['point'] = parseFloat(target.getElementsByClassName('scoreInput')[0].value.trim());
		paramObject['question'] = target.getElementsByClassName('questionInput')[0].value.trim();
		paramObject['A'] = target.getElementsByClassName('answerInput')[0].value.trim();
		paramObject['B'] = target.getElementsByClassName('answerInput')[1].value.trim();
		paramObject['C'] = target.getElementsByClassName('answerInput')[2].value.trim();
		paramObject['D'] = target.getElementsByClassName('answerInput')[3].value.trim();
		paramObject['correct'] = target.getElementsByClassName('correctAnswer')[0].value.trim();
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
					notification(returnObject['message'], 'success');
					if(isNaN(paramObject['point'])) target.getElementsByClassName('scoreInput')[0].value = 0.0;
					globalCountingId += 1;
					target.getElementsByClassName('questionId')[0].innerHTML = 'Câu ' + globalCountingId;
					target.setAttribute('id', returnObject['id']);
					target.getElementsByClassName('removeButton')[0].setAttribute('onclick', 'removeQuestion(this, ' + returnObject['id'] + ')');
					target.getElementsByClassName('saveButton')[0].setAttribute('onclick', 'saveQuestion(this, ' + returnObject['id'] + ')');
					document.getElementById('footer').insertBefore(target, null);
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
		request.open('POST', TEACHER_API + 'questionInsertHandle.php');
		request.setRequestHeader('Content-type', 'application/json');
		request.send(param);
	} else {
		// Nếu id được lưu nhỏ hơn 1000000000, đây là thao tác thay đổi câu hỏi cũ
		logParam('Update question');
		logParam(id);
		var target = document.getElementById(id);
		paramObject['id'] = parseInt(id);
		paramObject['point'] = parseFloat(target.getElementsByClassName('scoreInput')[0].value.trim());
		paramObject['question'] = target.getElementsByClassName('questionInput')[0].value.trim();
		paramObject['A'] = target.getElementsByClassName('answerInput')[0].value.trim();
		paramObject['B'] = target.getElementsByClassName('answerInput')[1].value.trim();
		paramObject['C'] = target.getElementsByClassName('answerInput')[2].value.trim();
		paramObject['D'] = target.getElementsByClassName('answerInput')[3].value.trim();
		paramObject['correct'] = target.getElementsByClassName('correctAnswer')[0].value.trim();
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
					notification(returnObject['message'], 'success');
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
		request.open('POST', TEACHER_API + 'questionEditHandle.php');
		request.setRequestHeader('Content-type', 'application/json');
		request.send(param);
	}
}
function removeQuestion(t, id){
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
				notification(returnObject['message'], 'success');
				document.getElementById(id).remove();
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
	request.open('POST', TEACHER_API + 'questionDeleteHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}