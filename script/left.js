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
	var str = '<div class="mini menu-button" onclick="loadMain()">Trang chủ</div><hr>';
	var role = parseInt(role);
	if(role === _role.GUEST){
		str += '<div class="mini menu-button" onclick="loadLogin()">Đăng nhập</div>';
		str += '<div class="mini menu-button" onclick="loadRegister()">Đăng ký</div>';
	} else {
		str += '<div class="mini menu-button" onclick="loadLogout()">Đăng xuất</div>';
		str += '<div class="mini menu-button" onclick="loadProfile()">Cá nhân</div><hr>';
		if(role >= _role.TEACHER){
			str += '<div class="mini menu-button" onclick="loadExam()">Đề thi</div><hr>';
		}
		if(role >= _role.ADMIN){
			str += '<div class="mini menu-button" onclick="loadAdmin()">Quản trị đề thi</div>';
			str += '<div class="mini menu-button" onclick="loadExam()">Quản trị tài khoản</div>';
		}
	}
	console.log(str);
	document.getElementById('left-menu').innerHTML = str;
}