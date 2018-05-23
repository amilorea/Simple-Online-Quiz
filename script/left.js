function welcomeMaker(role, name){
	// In ra thông tin người dùng ở góc trên bên trái
	var str = 'Xin chào <b>' + name + '</b><hr>';
	document.getElementById('leftWelcome').innerHTML = str;
	if(!isNaN(role)){
		var roleClass = 'role-' + role;
		document.getElementById('leftWelcome').classList.value = '';
		document.getElementById('leftWelcome').classList.add(roleClass);
	}
}
function menuMaker(role){
	if(isNaN(role)) return;
	// Tạo ra thanh menu với các nút bấm tùy theo cấp bậc
	var str = '<div class="mini menu-button" onclick="loadMiddlePage(\'main.html\')">Trang chủ</div><hr>';
	var role = parseInt(role);
	if(role === _ROLE.GUEST){
		str += '<div class="mini menu-button" onclick="loadMiddlePage(\'login.html\')">Đăng nhập</div>';
		str += '<div class="mini menu-button" onclick="loadMiddlePage(\'register.html\')">Đăng ký</div>';
	} else {
		str += '<div class="mini menu-button" onclick="loadMiddlePage(\'logout.html\', function(){ return logOut() })">Đăng xuất</div>';
		str += '<div class="mini menu-button" onclick="loadMiddlePage(\'profile.html\', function(){ return loadProfile() & getExamHistory() })">Cá nhân</div>';
		str += '<div class="mini menu-button" onclick="loadMiddlePage(\'exam-list.html\', function(){ return searchExam() })">Đề thi</div><hr>';
		if(role >= _ROLE.TEACHER){
			str += '<div class="mini menu-button" onclick="loadMiddlePage(\'exam-list-owned.html\', function(){ return searchExamOwned() })">Quản lý đề thi</div><hr>';
		}
		if(role >= _ROLE.ADMIN){
			str += '<div class="mini menu-button" onclick="loadMiddlePage(\'user-admin.html\', function(){ searchHandle(\'restore\'); document.getElementById(\'drop-search-input\').append(createDropdown(\'role-box\')); return; })">Quản trị tài khoản</div>';
		}
	}
	document.getElementById('left-menu').innerHTML = str;
}