const API = 'API/';
const ADMIN_API = API + 'Admin/';
const TEACHER_API = API + 'Teacher/';
var onGoingFlag = false;
function notification(message, type){
	var notif = document.getElementById('notification');
	notif.innerHTML = message;
	notif.className = '';
	if(type === 'success'){
		notif.classList.add('success');
	}
	if(type === 'error'){
		notif.classList.add('error');
	}
	if(type === 'warning'){
		notif.classList.add('warning');
	}
}
function createDynamicInput(name, element, type = 'text', defaultValue = false){
	var ele = document.createElement('input');
	ele.setAttribute('class', 'newData full-input');
	ele.setAttribute('id', name + 'Update');
	ele.setAttribute('type', type);
	ele.setAttribute('placeholder', "Để trống để giữ nguyên");
	if(defaultValue === true)
		ele.setAttribute('value', element.innerHTML);
	return ele;
}
function logParam(param){
	if(true) console.log(param);
}
function onload(element, size = 14){
	element.innerHTML = '<img src="../img/waiting.gif" style="width: ' + size + 'px; height: ' + size + 'px">';
}
function unload(element, str = ''){
	element.innerHTML = str;
}