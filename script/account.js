function loginTrap(){
	// Kiểm tra thông tin trước khi gửi đi đăng nhập
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	
	if(username.length == 0) return notification('Nhập tên đăng nhập!', 'error');
	if(password.length == 0) return notification('Nhập mật khẩu!', 'error');
	
	var paramObject = {};
	paramObject['username'] = username;
	paramObject['password'] = password;
	var param = JSON.stringify(paramObject);
	logParam(param);
	
	//Bắt đầu request
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			logParam(this.responseText);
			var returnObject = JSON.parse(this.responseText);
			logParam(returnObject);
			switch(this.status){
			case 200:
				notification(returnObject['message'], 'success');
				updateSession(returnObject['role'], returnObject['username']);
				menuMaker(returnObject['role']);
				welcomeMaker(returnObject['role'], returnObject['accountname']);
				loadMiddlePage('main.html');
				break;
			case 400:
				notification(returnObject['message'], 'error');
				var register = document.getElementById('register');
				register.classList.remove('hide');
				register.removeAttribute('disabled');
				break;
			default:
				notification(returnObject['message'], 'error');
				break;
			}
		}
	};
	request.open('POST', API + 'loginHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}
function loginReset(){
	document.getElementById('username').value = '';
	document.getElementById('password').value = '';
}
function toRegister(){
	loadMiddlePage('register.html');
}
function registerTrap(){
	// Kiểm tra thông tin trước khi gửi đi đăng ký
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	var accountname = document.getElementById('accountname').value;
	
	if(username.length == 0) return notification('Nhập tên đăng nhập!', 'error');
	if(password.length == 0) return notification('Nhập mật khẩu!', 'error');
	if(accountname.length == 0) return notification('Nhập tên người dùng!', 'error');
	
	var paramObject = {};
	paramObject['username'] = username;
	paramObject['password'] = password;
	paramObject['accountname'] = accountname;
	var param = JSON.stringify(paramObject);
	logParam(param);
	
	// Bắt đầu request
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			logParam(this.responseText);
			var returnObject = JSON.parse(this.responseText);
			switch(this.status){
			case 200:
				notification(returnObject['message'], 'success');
				updateSession(1, paramObject['username']);
				menuMaker(1);
				welcomeMaker(1, paramObject['accountname']);
				loadMiddlePage('main.html');
				break;
			case 400:
				loadMiddlePage('register.html');
				notification(returnObject['message'], 'error');
				break;
			default:
				notification(returnObject['message'], 'error');
				break;
			}
		}
	};
	request.open('POST', API + 'registerHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}
function registerReset(){
	document.getElementById('username').value = '';
	document.getElementById('password').value = '';
	document.getElementById('accountname').value = '';
}
function registerExit(){
	// Thoát khỏi trang đăng ký
	loadMiddlePage('login.html');
}
function logOut(){
	// Bắt đầu request
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			logParam(this.responseText);
			var returnObject = JSON.parse(this.responseText);
			logParam(returnObject);
			switch(this.status){
			case 200:
				updateSession(_ROLE.GUEST, 'Khách viếng thăm');
				menuMaker(_ROLE.GUEST);
				welcomeMaker(_ROLE.GUEST, 'Khách viếng thăm');
				loadMiddlePage('logout.html');
				break;
			default:
				notification(returnObject['message'], 'error');
				break;
			}
		}
	};
	request.open('POST', API + 'logoutHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send();
}