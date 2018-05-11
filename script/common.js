const API = '../API/';
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
function logParam(param){
	if(true) console.log(param);
}