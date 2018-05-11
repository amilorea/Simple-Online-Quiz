<?php
	session_start();
	header('Content-type: application/json');
	$requestData = json_decode(file_get_contents('php://input'), true);

	//	Make object return
	$return = [];

	//	Get param
	$username = $requestData['username'];
	$accountname = $requestData['accountname'];
	$password = md5($requestData['password']);


	if( $username == "" || $password == "" ){
		$return['accountname']= $accountname;
		$return['username']= $username;
		$return['password']= $password;
		$result['message'] = 'Require username and password!';
		echo json_encode((object)$return);
		http_response_code(404);
	}

	//	Connect
	$connector = mysqli_connect('localhost', 'root', '') or die('Could not connect: '.mysql_error());
	mysqli_set_charset($connector, 'utf8');
	$db_selected = mysqli_select_db($connector, 'simpleonlinequiz');

	//	Query
	$query = "INSERT INTO `user` (username, accountname, password, role) VALUES ('".$username."', '".$accountname."', '".$password."', 1);";
	$return['query'] = $query;
	$result = mysqli_query($connector, $query);

	if( $result != NULL ){
		if( $result ){
			$_SESSION['user'] = $username;
			$_SESSION['role'] = 1;
			$return['message'] = 'success';
			http_response_code(200);
		}
		else {
			$return['message'] = 'Invalid username or password!';
			http_response_code(400);
		}
	}
	else {
		$return['message'] = 'Login error!!!';
		http_response_code(500);
	}
	echo json_encode((object)$return);
?>