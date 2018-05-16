<?php
	session_start();
	if(!isset($_SESSION['role'])){
		$_SESSION['role'] = 0;
	}
	
	if(!isset($_SESSION['account'])){
		$_SESSION['account'] = 'Khách viếng thăm';
	}
?>
<!DOCTYPE html>
<html style="height: 100%">
	<head>
		<link rel="shortcut icon" type="image/ico" href="../logo.ico"/>
		<title>E-Exam 101</title>
		<meta charset="UTF-8">
		<link rel="stylesheet"  type="text/css" href="../style/global.css">
		<style type="text/css">
			body {
				background-image: url('../img/cork-wallet.png');
				min-width: 800px;
			}
			div {
				border-width: 0;
				padding: 0;
			}
			.body-table {
				width: 100%;
				height: 100%;
				border-collapse: collapse;
			}
			.body-table td {
				border-collapse: collapse;
			}
			.top-frame {
				width: 100%;
				height: 100px;
			}
			.top-cell {
				height: 50px;
			}
			.left-cell {
				width: 200px;
				vertical-align: top;
			}
			.right-cell {
				width: 150px;
				position: relative;
				z-index: 50;
				vertical-align: top;
			}
			.middle-cell {
				position: relative;
				z-index: 100;
			}
			.top-frame {
				height: 100%;
				width: 100%;
			}
			.left-frame {
				width: 200px;
				position: fixed;
			}
			.middle-frame {
				min-height: 500px;
				width: 100%;
				box-shadow: 0px 0px 3px 3px gray;
				border-radius: 10px;
				background-color: #efefef;
				background-image: url('../img/noise.png');
				padding: 5px;
				text-align: center;
			}
			.right-frame {
				width: 150px;
				position: fixed;
			}
		</style>
		<script src="../script/left.js"></script>
		<script src="../script/common.js"></script>
		<script src="../script/account.js"></script>
		<script src="../script/profile.js"></script>
		<script src="../script/exam.js"></script>
		<script src="../script/admin.js"></script>
		<script type="text/javascript">
			var _ROLE = Object.freeze({
				'GUEST' : 0,
				0 : 'GUEST',
				'USER' : 1,
				1 : 'USER',
				'TEACHER' : 2,
				2 : 'TEACHER',
				'ADMIN' : 3,
				3 : 'ADMIN'
			});
			var _role, _name;
			var _middleWidth;
			function updateSession(role = <?php echo $_SESSION['role'] ?>, name = '<?php echo $_SESSION['account'] ?>'){
				_role = role;
				_name = name;
			}
			//updateSession(3, 'mock');
			function loadTop(){
				var target = document.getElementById('top-frame');
				
				onload(target, 50);
				//Bắt đầu request
				var request = new XMLHttpRequest();
				request.onreadystatechange = function() {
					if (this.readyState == 4) {
						unload(target, 50);
						if(this.responseText.length === 0)
							target.innerHTML = 'Lỗi không tải được dữ liệu';
						else target.innerHTML = this.responseText;
					}
				};
				request.open('GET', 'top-panel.html');
				request.setRequestHeader('Content-type', 'text/plain');
				request.send();
			}
			function loadLeft(){
				var target = document.getElementById('left-frame');
				
				onload(target, 50);
				//Bắt đầu request
				var request = new XMLHttpRequest();
				request.onreadystatechange = function() {
					if (this.readyState == 4) {
						unload(target, 50);
						if(this.responseText.length === 0)
							target.innerHTML = 'Lỗi không tải được dữ liệu';
						else {
							target.innerHTML = this.responseText;
							welcomeMaker(_role, _name);
							menuMaker(_role);
						}
					}
				};
				request.open('GET', 'left-panel.html');
				request.setRequestHeader('Content-type', 'text/plain');
				request.send();
			}
			function loadRight(){
				var target = document.getElementById('right-frame');
				
				onload(target, 50);
				//Bắt đầu request
				var request = new XMLHttpRequest();
				request.onreadystatechange = function() {
					if (this.readyState == 4) {
						unload(target, 50);
						if(this.responseText.length === 0)
							target.innerHTML = 'Lỗi không tải được dữ liệu';
						else target.innerHTML = this.responseText;
					}
				};
				request.open('GET', 'right-panel.html');
				request.setRequestHeader('Content-type', 'text/plain');
				request.send();
			}
			function loadMiddlePage(source, callback = function(){}){
				if(examCheck() === false) return;
				var target = document.getElementById('middle-frame');
				
				onload(target, 50);
				//Bắt đầu request
				var request = new XMLHttpRequest();
				request.onreadystatechange = function() {
					if (this.readyState == 4) {
						unload(target, 50);
						if(this.responseText.length === 0)
							target.innerHTML = 'Lỗi không tải được dữ liệu';
						else {
							target.innerHTML = this.responseText;
							callback();
						}
					}
				};
				request.open('GET', source);
				request.setRequestHeader('Content-type', 'text/plain');
				request.send();
			}
		</script>
	</head>
	<body>
		<div style="height: 100%">
			<table class="body-table">
				<tr>
					<td colspan="3" class="top-cell">
						<div id="top-frame" class="top-frame"></div>
					</td>
				</tr>
				<tr>
					<td class="left-cell">
						<div id="left-frame" class="left-frame"></div>
					</td>
					<td class="middle-cell">
						<div id="middle-frame" class="middle-frame"></div>
					</td>
					<td class="right-cell">
						<div id="right-frame" class="right-frame"></div>
					</td>
				</tr>
			</table>
		</div>
		<script type="text/javascript">
			updateSession();
			loadTop();
			loadRight();
			loadLeft();
			loadMiddlePage('main.html');
		</script>
	</body>
</html>