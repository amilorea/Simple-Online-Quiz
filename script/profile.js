function profileEdit(){
	var password = document.getElementById('passwordForm');
	var accountname = document.getElementById('accountnameForm');
	
	password.removeAttribute('disabled');
	password.classList.remove('hide');
	
	accountname.removeAttribute('disabled');
	accountname.classList.remove('hide');
	
	document.getElementById('password').classList.add('hide');
	document.getElementById('accountname').classList.add('hide');
	
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
	var password = document.getElementById('passwordForm');
	var accountname = document.getElementById('accountnameForm');
	
	password.setAttribute('disabled', '');
	password.classList.add('hide');
	
	accountname.setAttribute('disabled', '');
	accountname.classList.add('hide');
	
	document.getElementById('password').classList.remove('hide');
	document.getElementById('accountname').classList.remove('hide');
	
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
	var paramObject = {};
	paramObject['password'] = document.getElementById('passwordForm').value.trim();
	paramObject['accountname'] = document.getElementById('accountnameForm').value.trim();
	var param = JSON.stringify(paramObject);
	logParam(param);
	
	//Bắt đầu request
	profileCancel();
	buttonOnload(document.getElementById('buttonEdit'));
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			logParam(this.responseText);
			var returnObject = JSON.parse(this.responseText);
			buttonUnload(document.getElementById('Lưu'));
			switch(this.status){
			case 200:
				notification(returnObject['message'], 'success');
				if(returnObject['accountname'] !== undefined){
					document.getElementById('accountname').innerHTML = returnObject['accountname'];
					document.getElementById('accountnameWelcome').innerHTML = returnObject['accountname'];
					var roleClass = 'role-' + _role;
					document.getElementById('accountnameWelcome').classList.add(roleClass);
				}
				if(returnObject['password'] !== undefined){
					document.getElementById('password').innerHTML = returnObject['password'];
				}
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
	request.open('POST', API + 'profileHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}
function loadProfile(){
	updateSession();
	var username = document.getElementById('username');
	var password = document.getElementById('password');
	var accountname = document.getElementById('accountname');
	
	//Bắt đầu request
	buttonOnload(username);
	buttonOnload(password);
	buttonOnload(accountname);
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			logParam(this.responseText);
			var returnObject = JSON.parse(this.responseText);
			buttonUnload(username);
			buttonUnload(password);
			buttonUnload(accountname);
			switch(this.status){
			case 200:
				//notification(returnObject['message'], 'success');
				username.innerHTML = returnObject['username'];
				
				accountname.innerHTML = returnObject['accountname'];
				document.getElementById('accountnameWelcome').innerHTML = returnObject['accountname'];
				var roleClass = 'role-' + returnObject['role'];
				document.getElementById('accountnameWelcome').classList.add(roleClass);

				password.innerHTML = '**********';
				
				getAllExam('simple');
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
	request.open('GET', API + 'profileHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}