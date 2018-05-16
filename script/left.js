function welcomeMaker(role, name){
	var str = 'Xin chào <b>' + name + '</b><hr>';
	document.getElementById('leftWelcome').innerHTML = str;
	var roleClass = 'role-' + role;
	document.getElementById('leftWelcome').classList.value = '';
	document.getElementById('leftWelcome').classList.add(roleClass);
}
function menuMaker(role){
	var str = '<div class="mini menu-button" onclick="loadMiddlePage(\'main.html\')">Trang chủ</div><hr>';
	var role = parseInt(role);
	if(role === _ROLE.GUEST){
		str += '<div class="mini menu-button" onclick="loadMiddlePage(\'login.html\')">Đăng nhập</div>';
		str += '<div class="mini menu-button" onclick="loadMiddlePage(\'register.html\')">Đăng ký</div>';
	} else {
		str += '<div class="mini menu-button" onclick="loadMiddlePage(\'logout.html\', function(){ return logOut() })">Đăng xuất</div>';
		str += '<div class="mini menu-button" onclick="loadMiddlePage(\'profile.html\', function(){ return loadProfile() & getExamHistory() })">Cá nhân</div>';
		str += '<div class="mini menu-button" onclick="loadMiddlePage(\'exam-list.html\', function(){ return getAllExam() })">Đề thi</div><hr>';
		if(role >= _ROLE.TEACHER){
			str += '<div class="mini menu-button" onclick="loadMiddlePage(\'exam.html\')">Test</div><hr>';
			str += '<div class="mini menu-button" onclick="loadMiddlePage(\'exam-moderator.html\')">Quản lý đề thi</div><hr>';
		}
		if(role >= _ROLE.ADMIN){
			str += '<div class="mini menu-button" onclick="loadMiddlePage(\'exam-admin.html\')">Quản trị đề thi</div>';
			str += '<div class="mini menu-button" onclick="loadMiddlePage(\'user-admin.html\', function(){ return getAllUser() })">Quản trị tài khoản</div>';
		}
	}
	document.getElementById('left-menu').innerHTML = str;
}