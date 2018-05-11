<?php
	session_start();
	session_unset(); 
	if(!isset($_SESSION['role'])){
		$_SESSION['role'] = 0;
	}
	
	if(!isset($_SESSION['name'])){
		$_SESSION['name'] = 'Khách viếng thăm';
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
				border-width: 0;
				padding: 0;
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
				width: 100%;
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
				width: 100%;
			}
		</style>
		<script src="../script/left.js"></script>
		<script src="../script/common.js"></script>
		<script src="../script/account.js"></script>
		<script type="text/javascript">
			function loadTop(){
				//Bắt đầu request
				var request = new XMLHttpRequest();
				request.onreadystatechange = function() {
					if(this.responseText.length === 0)
						document.getElementById('top-frame').innerHTML = 'Lỗi không tải được dữ liệu';
					else document.getElementById('top-frame').innerHTML = this.responseText;
				};
				request.open('GET', 'top-panel.html');
				request.setRequestHeader('Content-type', 'text/plain');
				request.send();
			}
			function loadLeft(){
				//Bắt đầu request
				var request = new XMLHttpRequest();
				request.onreadystatechange = function() {
					if(this.responseText.length === 0)
						document.getElementById('left-frame').innerHTML = 'Lỗi không tải được dữ liệu';
					else {
						document.getElementById('left-frame').innerHTML = this.responseText;
						welcomeMaker(<?php echo $_SESSION['role'] ?>, '<?php echo $_SESSION['name'] ?>');
						menuMaker(<?php echo $_SESSION['role'] ?>);
					}
				};
				request.open('GET', 'left-panel.html');
				request.setRequestHeader('Content-type', 'text/plain');
				request.send();
			}
			function loadRight(){
				//Bắt đầu request
				var request = new XMLHttpRequest();
				request.onreadystatechange = function() {
					if(this.responseText.length === 0)
						document.getElementById('right-frame').innerHTML = 'Lỗi không tải được dữ liệu';
					else document.getElementById('right-frame').innerHTML = this.responseText;
				};
				request.open('GET', 'right-panel.html');
				request.setRequestHeader('Content-type', 'text/plain');
				request.send();
			}
			function loadMiddlePage(source){
				//Bắt đầu request
				var request = new XMLHttpRequest();
				request.onreadystatechange = function() {
					if(this.responseText.length === 0)
						document.getElementById('middle-frame').innerHTML = 'Lỗi không tải được dữ liệu';
					else document.getElementById('middle-frame').innerHTML = this.responseText;
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
			loadTop();
			loadRight();
			loadLeft();
			loadMiddlePage('Main');
		</script>
	</body>
</html>