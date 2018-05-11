<?php
	session_start();
	header('Content-type: application/json');
	$requestData = json_decode(file_get_contents('php://input'), true);

	//	Make object return
	$return = {}

	//	Get param
	$username = $requestData('username');
	$password = $requestData('password');
	$return['username']= $username;
	$return['password']= $password;

	if( $username == "" || $password == "" ){
		$result['message'] = 'Require username and password!';
		echo "result";
		http_response_code(404);
	}

	//	Connect
	$connector = mysqli_connect('localhost', 'root', '') or die('Could not connect: '.mysql_error());
	mysqli_set_charset($connect, 'utf8');
	$db_selected = mysqli_select_db($connector, 'user');

	//	Query
	$query = "SELECT * FROM `user` WHERE username = '".$username."' AND password = '".$password."';";
	$result = mysqli_query($connector, $query);

	if( $result ){
		if(mysqli_num_rows($result) == 1){
			$_SESSION['user'] = $username;
			$return['message'] = 'success';
			http_response_code(200);
		}
		else {
			$return['message'] = echo 'Invalid username or password!';
			http_response_code(404);
		}
		mysqli_free_result($result);
	}
	else {
		$return['message'] = 'Login error!!!';
		http_response_code(500);
	}
	echo json_encode($return);
?>