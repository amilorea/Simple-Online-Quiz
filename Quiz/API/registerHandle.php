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

	try {
		if( !( strrpos($username," ") === false ) ){
			$return['username'] = $username;
			$return['message'] = 'Username can\'t have space';
			throw new Exception($return['message']);
		}

		if( $username == "" || $accountname == "" || $password == "" ){
			$return['accountname']= $accountname;
			$return['username']= $username;
			$return['password']= $password;
			$return['message'] = 'Require username, accountname and password!';
			throw new Exception($return['message']);
		}

		//	Connect
		$connector = mysqli_connect('localhost', 'root', '') or die('Could not connect: '.mysql_error());
		mysqli_set_charset($connector, 'utf8');
		$db_selected = mysqli_select_db($connector, 'simpleonlinequiz');

		//	Query
		$query = "INSERT INTO `user` (username, accountname, password, role) VALUES ('".$username."', '".$accountname."', '".$password."', 1);";
		$return['query'] = $query;
		$result = mysqli_query($connector, $query);

		$return['result'] = $result;
		$return['boolean'] = NULL != false;
		if( $result != NULL ){
			if( $result ){
				$_SESSION['user'] = $username;
				$_SESSION['account'] = $accountname;
				$_SESSION['role'] = 1;
				$return['message'] = 'success';
				http_response_code(200);
			}
			else {
				$return['message'] = 'Duplicate username!';
				http_response_code(400);
			}
		}
		else {
			$return['message'] = 'Register error!!!';
			http_response_code(500);
		}
		echo json_encode((object)$return);
	}
	catch ( Exception $error ) {
		echo json_encode((object)$return);
		http_response_code(400);		
	}
?>