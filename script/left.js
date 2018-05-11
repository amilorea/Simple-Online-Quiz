var _role = Object.freeze({
	'GUEST' : 0,
	'USER' : 1,
	'TEACHER' : 2,
	'ADMIN' : 3
});
function welcomeMaker(role, name){
	var str = 'Xin chào <b>' + name + '</b><hr>';
	document.getElementById('left-welcome').innerHTML = str;
	var roleClass = 'role-' + role;
	document.getElementById('left-welcome').classList.add(roleClass);
}
function menuMaker(role){
	var str = '<div class="mini menu-button" onclick="loadMiddlePage(\'main.html\')">Trang chủ</div><hr>';
	var role = parseInt(role);
	if(role === _role.GUEST){
		str += '<div class="mini menu-button" onclick="loadMiddlePage(\'login.html\')">Đăng nhập</div>';
		str += '<div class="mini menu-button" onclick="loadMiddlePage(\'register.html\')">Đăng ký</div>';
	} else {
		str += '<div class="mini menu-button" onclick="loadMiddlePage(\'logout.html\')">Đăng xuất</div>';
		str += '<div class="mini menu-button" onclick="loadMiddlePage(\'profile.html\')">Cá nhân</div><hr>';
		if(role >= _role.TEACHER){
			str += '<div class="mini menu-button" onclick="loadMiddlePage(\'exam.html\')">Đề thi</div><hr>';
		}
		if(role >= _role.ADMIN){
			str += '<div class="mini menu-button" onclick="loadMiddlePage(\'account-admin.html\')">Quản trị đề thi</div>';
			str += '<div class="mini menu-button" onclick="loadMiddlePage(\'exam-admin.html\')">Quản trị tài khoản</div>';
		}
	}
	console.log(str);
	document.getElementById('left-menu').innerHTML = str;
}