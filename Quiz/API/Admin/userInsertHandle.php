<?php
	session_start();
	header('Content-type: application/json');
	$requestData = json_decode(file_get_contents('php://input'), true);

	//	Make object return
	$return = [];

	$Admin = 3;
	if(!isset($_SESSION['user'])||!isset($_SESSION['role'])){
		$return['message']= 'Invalid user session!';
		echo json_encode((object)$return);
		http_response_code(400);
	}
	elseif(intval($_SESSION['role']) < $Admin){
		$return['message']= "You aren't Admin!";
		echo json_encode((object)$return);
		http_response_code(400);
	}
	else
	try {
		//	Get param
		$username = $requestData['username'];
		$accountname = $requestData['accountname'];
		$password = $requestData['password'];
		$passwordMD5 = md5($password);
		$role = $requestData['role'];
		if( $role == NULL )
			$role = 1;

		if( !( strrpos($username," ") == false ) ){
			$return['username'] = $username;
			$return['message'] = 'Username can\'t have space';
			throw new Exception($return['message']);
		}

		if( strcmp($username,"")*strcmp($accountname,"")*strcmp($password,"") == 0 ){
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
		$query = "INSERT INTO `user` (username, accountname, password, role) VALUES ('".$username."', '".$accountname."', '".$passwordMD5."', ".$role.");";
		$return['query'] = $query;
		$result = mysqli_query($connector, $query);

		if( $result != NULL ){
			if( $result ){
				$return['message'] = 'success';
				http_response_code(200);
			}
			else {
				$return['message'] = 'Duplicate username!';
				http_response_code(400);
			}
		}
		else {
			$return['message'] = 'Server error!!!';
			http_response_code(500);
		}
		echo json_encode((object)$return);
	}
	catch ( Exception $error ) {
		echo json_encode((object)$return);
		http_response_code(400);		
	}
?>