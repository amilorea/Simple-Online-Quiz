const API = 'API/';
const ADMIN_API = API + 'Admin/';
const TEACHER_API = API + 'Teacher/';
var _ROLE = Object.freeze({
	'GUEST' : 0,
	0 : 'GUEST',
	'USER' : 1,
	1 : 'USER',
	'TEACHER' : 2,
	2 : 'TEACHER',
	'ADMIN' : 3,
	3 : 'ADMIN'
});
var _roleCount = 4;
var _role, _name;
var _middleWidth;
var onGoingFlag = false;
function notification(message, type){
	// Hàm hiển thị thông báo
	var notif = document.getElementById('notification');
	if(notif === undefined) return false;
	notif.innerHTML = message;
	notif.className = '';
	if(type === 'success'){
		notif.classList.add('success');
		return true;
	}
	if(type === 'error'){
		notif.classList.add('error');
		return false;
	}
	if(type === 'warning'){
		notif.classList.add('warning');
		return false;
	}
}
function createDynamicInput(name, element = undefined, type = 'text', defaultValue = false){
	// Hàm tạo ra các input động cho các thao tác sửa dữ liệu
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
// Cặp hàm thêm / xóa biểu tượng "loading"
function onload(element, size = 14){
	element.innerHTML = '<img src="../img/waiting.gif" style="width: ' + size + 'px; height: ' + size + 'px">';
}
function unload(element, str = ''){
	element.innerHTML = str;
}