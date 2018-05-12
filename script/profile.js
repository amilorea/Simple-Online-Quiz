function profileEdit(){
	console.log('a');
	var username = document.getElementById('usernameForm');
	var password = document.getElementById('passwordForm');
	var accountname = document.getElementById('accountnameForm');
	
	username.removeAttribute('disabled');
	username.classList.remove('hide');
	
	password.removeAttribute('disabled');
	password.classList.remove('hide');
	
	accountname.removeAttribute('disabled');
	accountname.classList.remove('hide');
	
	var editButton = document.getElementById('buttonEdit');
	editButton.classList.remove('editButton');
	editButton.classList.add('saveButton');
	editButton.innerHTML = 'Lưu';
	editButton.attributes['onclick'].value = 'profileSave()';
	
	var cancelButton = document.getElementById('buttonCancel');
	cancelButton.classList.remove('hide');
	cancelButton.removeAttribute('disabled');
}
function profileCancel(){
	var username = document.getElementById('usernameForm');
	var password = document.getElementById('passwordForm');
	var accountname = document.getElementById('accountnameForm');
	
	username.setAttribute('disabled', '');
	username.classList.add('hide');
	
	password.setAttribute('disabled', '');
	password.classList.add('hide');
	
	accountname.setAttribute('disabled', '');
	accountname.classList.add('hide');
	
	var editButton = document.getElementById('buttonEdit');
	editButton.classList.add('editButton');
	editButton.classList.remove('saveButton');
	editButton.innerHTML = 'Sửa';
	editButton.attributes['onclick'].value = 'profileEdit()';
	
	var cancelButton = document.getElementById('buttonCancel');
	cancelButton.classList.add('hide');
	cancelButton.setAttribute('disabled', '');
}
function profileSave(){
	var username = document.getElementById('username');
	var password = document.getElementById('password');
	var accountname = document.getElementById('accountname');
	
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