<?php
	session_start();
	header('Content-type: application/json');

	//	Make object return
	$return = [];

	try {
		//	Connect
		$connector = mysqli_connect('localhost', 'root', '') or die('Could not connect: '.mysql_error());
		mysqli_set_charset($connector, 'utf8');
		$db_selected = mysqli_select_db($connector, 'simpleonlinequiz');

		//	Query
		$query = "SELECT * FROM `contest` WHERE username = '".$username."' AND password = '".$password."';";
		// $return['query'] = $query;
		$result = mysqli_query($connector, $query);

		if( $result ){
			if( mysqli_num_rows($result) == 1 ){
				$right = mysqli_fetch_array($result, MYSQLI_BOTH);
				$_SESSION['user'] = $username;
				$_SESSION['role'] = $right['role'];
				$return['user'] = $username;
				$return['role'] = $right['role'];
				$return['message'] = 'success';
				http_response_code(200);
			}
			else {
				$return['message'] = 'Invalid username or password!';
				http_response_code(400);
			}
			mysqli_free_result($result);
		}
		else {
			$return['message'] = 'Login error!!!';
			http_response_code(500);
		}
		echo json_encode((object)$return);
	} catch ( Exception $error ) {
		echo json_encode((object)$return);
		http_response_code(400);
	}
?>