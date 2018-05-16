function getAllUser(param){
	//Bắt đầu request
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
				for(let data of content){
					var newRow = prototypeRow.cloneNode(true);
					newRow.getElementsByClassName('usernameCol')[0].innerHTML = data['username'];
					newRow.getElementsByClassName('accountnameCol')[0].innerHTML = '<div onclick="loadMiddlePage(\'profile.html\', function(){ return loadProfile(' + data['username'] + ') })">' + data['accountname'] + '</div>';
					newRow.getElementsByClassName('passwordCol')[0].innerHTML = '**********';
					newRow.getElementsByClassName('roleCol')[0].innerHTML = _ROLE[dat['role']];
					newRow.setAttribute('id', data['username']);
					newRow.getElementsByClassName('editButton')[0].setAttribute('onclick', 'editHandle(' + data['username'] + ')');
					newRow.getElementsByClassName('cancelButton')[0].setAttribute('onclick', 'cancelHandle(' + data['username'] + ')');
					newRow.getElementsByClassName('deleteButton')[0].setAttribute('onclick', 'deleteHandle(' + data['username'] + ')');
					prototypeRow.after(newRow);
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
	request.open('POST', API + 'userInfoHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}