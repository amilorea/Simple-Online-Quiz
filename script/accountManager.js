function createDropdown(id, noselect = false){
	// Hàm tạo drop-down để lựa chọn cấp bậc người dùng
	var droplist = document.createElement('select');
	droplist.setAttribute('class', 'full-input');
	droplist.setAttribute('id', id);
	droplist.innerHTML += '<option value="">Trống</option>';
	for(var cnt = 1; cnt < _roleCount; cnt++){
		droplist.innerHTML += '<option value="' + _ROLE[_ROLE[cnt]] + '" ' + (cnt == 1 && noselect !== true ? 'selected' : '') + '>' + _ROLE[cnt] + '</option>';
	}
	return droplist;
}
function searchHandle(mode){
	var paramObject = {};
	if(mode !== 'restore') {
		paramObject['username'] = document.getElementById('username-box').value.trim();
		paramObject['accountname'] = document.getElementById('accountname-box').value.trim();
		paramObject['password'] = document.getElementById('password-box').value.trim();
		paramObject['role'] = parseInt(document.getElementById('role-box').value.trim());
	}
	else {
		paramObject['username'] = '';
		document.getElementById('username-box').value = '';
		paramObject['accountname'] = '';
		document.getElementById('accountname-box').value = '';
		paramObject['password'] = '';
		document.getElementById('password-box').value = '';
		paramObject['role'] = '';
		if(document.getElementById('role-box'))
			document.getElementById('role-box').selectedIndex = 0;
	}
	var param = JSON.stringify(paramObject);
	logParam(param);
	
	//Bắt đầu request
	onload(document.getElementById('loader'), 30);
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			//logParam(this.responseText);
			var returnObject = JSON.parse(this.responseText);
			logParam(returnObject);
			unload(document.getElementById('loader'));
			switch(this.status){
			case 200:
				notification(returnObject['message'], 'success');
				var content = returnObject['content'];
				var prototypeRow = document.getElementById('prototype');
				var searchable = document.getElementsByClassName('searchable');
				while(searchable.length != 0)
					searchable[0].remove();
				for(var cnt = content.length; cnt > 0; cnt--){
					var data = content[cnt - 1];
					var newRow = prototypeRow.cloneNode(true);
					newRow.getElementsByClassName('usernameCol')[0].innerHTML = data['username'];
					newRow.getElementsByClassName('accountnameCol')[0].innerHTML = data['accountname'];
					newRow.getElementsByClassName('passwordCol')[0].innerHTML = '**********';
					newRow.getElementsByClassName('roleCol')[0].innerHTML = _ROLE[data['role']];
					newRow.setAttribute('id', data['username']);
					
					// Nút bấm
					newRow.getElementsByClassName('editButton')[0].setAttribute('onclick', 'editHandle(this, "' + data['username'] + '")');
					newRow.getElementsByClassName('cancelButton')[0].setAttribute('onclick', 'cancelHandle(this, "' + data['username'] + '")');
					newRow.getElementsByClassName('deleteButton')[0].setAttribute('onclick', 'deleteHandle(this, "' + data['username'] + '")');
					newRow.classList.remove('hide');
					newRow.classList.add('searchable');
					prototypeRow.after(newRow);
				}
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
	request.open('POST', ADMIN_API + 'userSearchHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}
function saveHandle(t, num){
	var paramObject = {};
	paramObject['username'] = document.getElementById('usernameUpdate').value.trim();
	paramObject['accountname'] = document.getElementById('accountnameUpdate').value.trim();
	paramObject['password'] = document.getElementById('passwordUpdate').value.trim();
	paramObject['role'] = parseInt(document.getElementById('roleUpdate').value.trim());
	logParam(paramObject);
	var param = JSON.stringify(paramObject);
	logParam(param);
	
	//Bắt đầu request
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
				welcomeMaker(paramObject['role'], paramObject['accountname']);
				menuMaker(paramObject['role']);
				// Tìm kiếm lại toàn bộ người dùng để tránh sự hỗn loạn với các thao tác song song
				searchHandle('restore');
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
	request.open('POST', ADMIN_API + 'userEditHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}
function editHandle(t, id){
	var cancelButton = t.nextElementSibling;
	var removeButton = cancelButton.nextElementSibling;
	
	//Kích hoạt nút hủy
	cancelButton.removeAttribute('disabled');
	cancelButton.classList.remove('hide');
	
	//Ẩn nút xóa
	removeButton.setAttribute('disabled', '');
	removeButton.classList.add('hide');
	
	//Tắt mọi nút chỉnh sửa trừ chính nó
	var allEditButton = document.getElementsByClassName('editButton');
	for(var i = 0; i < allEditButton.length; i++){
		allEditButton[i].setAttribute('disabled', true);
	}
	t.removeAttribute('disabled');
	
	//Thay đổi nút sửa thành nút lưu
	t.classList.add('saveButton');
	t.classList.remove('editButton');
	t.attributes['onclick'].value = 'saveHandle(this, "' + id + '")';
	t.innerHTML = 'Lưu';
	
	var selectedRow = document.getElementById(id);
	
	var username = selectedRow.getElementsByClassName('usernameCol')[0];
	username.append(createDynamicInput('username', username, 'hidden', true));
	
	var accountname = selectedRow.getElementsByClassName('accountnameCol')[0];
	accountname.append(createDynamicInput('accountname', accountname));
	
	var password = selectedRow.getElementsByClassName('passwordCol')[0];
	password.append(createDynamicInput('password', password));
	
	var role = selectedRow.getElementsByClassName('roleCol')[0];
	role.append(createDropdown('roleUpdate', true));
}
function cancelHandle(t, num){
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
	activeButton.attributes['onclick'].value = 'editHandle(this, "' + num + '")';
	activeButton.innerHTML = 'Sửa';
	
	//Hiện nút xóa
	removeButton.removeAttribute('disabled');
	removeButton.classList.remove('hide');
	
	//Hủy các input 5 và 6
	var selectedRow = document.getElementsByClassName('dataRow')[num].getElementsByTagName('td');
	for(var i = 0; i < selectedRow.length - 1; i++){
		var selectedInput = selectedRow[i].getElementsByTagName('input');
		while(selectedInput.length != 0){
			selectedInput[0].remove();
		}
		var selectedDroplist = selectedRow[i].getElementsByTagName('select');
		while(selectedDroplist.length != 0){
			selectedDroplist[0].remove();
		}
	}
}
function deleteHandle(t, num){
	var paramObject = {};
	paramObject['username'] = num;
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
				var target = document.getElementById(num);
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
	request.open('POST', ADMIN_API + 'userDeleteHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}
function insertHandle(){
	var paramObject = {};
	paramObject['username'] = document.getElementById('username-box').value.trim();
	paramObject['accountname'] = document.getElementById('accountname-box').value.trim();
	paramObject['password'] = document.getElementById('password-box').value.trim();
	paramObject['role'] = parseInt(document.getElementById('role-box').value.trim());
	var param = JSON.stringify(paramObject);
	logParam(paramObject);
	
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
				notification(returnObject['message'], 'success');
				// Tìm kiếm lại toàn bộ người dùng để tránh sự hỗn loạn với các thao tác song song
				searchHandle('restore');
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
	request.open('POST', ADMIN_API + 'userInsertHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send(param);
}