function loginTrap(){
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	
	if(username.length == 0){
		notification('Nhập tên đăng nhập!', 'error');
		return false;
	}
	if(password.length == 0){
		notification('Nhập mật khẩu!', 'error');
		return false;
	}
	
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
			switch(this.status){
			case 200:
				notification(returnObject['message'], 'success');
				window.location.href = 'viewDatabase.php';
				break;
			case 400:
			case 401:
				notification(returnObject['message'], 'error');
				var register = document.getElementById('register');
				register.classList.remove('hide');
				register.removeAttribute('disabled');
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
function registerTrap(){
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	var accountname = document.getElementById('accountname').value;
	
	if(username.length == 0){
		notification('Nhập tên đăng nhập!', 'error');
		return false;
	}
	if(password.length == 0){
		notification('Nhập mật khẩu!', 'error');
		return false;
	}
	if(accountname.length == 0){
		notification('Nhập tên người dùng!', 'error');
		return false;
	}
	
	var paramObject = {};
	paramObject['username'] = username;
	paramObject['password'] = password;
	paramObject['accountname'] = accountname;
	var param = JSON.stringify(paramObject);
	logParam(param);
	
	//Bắt đầu request
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			logParam(this.responseText);
			var returnObject = JSON.parse(this.responseText);
			switch(this.status){
			case 200:
				notification(returnObject['message'], 'success');
				window.location.href = 'viewDatabase.php';
				break;
			case 400:
			case 401:
				window.location.href = 'register.php';
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
	loadMiddlePage('login.html');
}
function logOut(){
	var paramObject = {};
	var param = JSON.stringify(paramObject);
	
	//Bắt đầu request
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			var returnObject = JSON.parse(this.responseText);
			switch(this.status){
			case 200:
				loadMiddlePage('logout.html');
				break;
			case 400:
			case 401:
				notification(returnObject['message'], 'error');
				break;
			}
		}
	};
	request.open('POST', API + 'logoutHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}
function toRegister(){
	window.location.href = 'register.php';
}
function toLogin(){
	window.location.href = 'register.php';
}