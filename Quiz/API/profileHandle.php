<?php
	session_start();
	header('Content-type: application/json');
	$requestData = json_decode(file_get_contents('php://input'), true);

	//	Make object return
	$return = [];
	$username = $_SESSION['user'];
	$role = $_SESSION['role'];

	if( strcmp( $_SERVER['REQUEST_METHOD'], 'POST' ) == 0 ) {
		try {
			//	Get param
			$accountname = $requestData['accountname'];
			$password = $requestData['password'];

			if( $username == "" ){
				$return['username']= $username;
				$result['message'] = 'Require username!';
				echo json_encode((object)$return);
				http_response_code(404);
				throw new Exception($return['mesage']);
			}

			//	Connect
			$connector = mysqli_connect('localhost', 'root', '') or die('Could not connect: '.mysql_error());
			mysqli_set_charset($connector, 'utf8');
			$db_selected = mysqli_select_db($connector, 'simpleonlinequiz');

			//	Query
			$mountChanged= 0;
			$query = "UPDATE `user` SET ";

			function addQuery( $columnName, $value){
				$query= "";
				if( !is_null( $value ) && $value != "" ){
					if( $GLOBALS['mountChanged'] > 0 )
						$query = $GLOBALS['query'].', ';
					else
						$query = $GLOBALS['query'];
					$GLOBALS['mountChanged']++;
					$GLOBALS['query'] = $query." ".$columnName." = '".$value."'";
				}
			}

			addQuery('accountname', $accountname);
			addQuery('password', $password);
			// addQuery('role', $role);

			$query= $query." WHERE username = '".$username."';";

			$return['query'] = $query;
			$result = mysqli_query($connector, $query);

			if( $result ){
				if( isset($_SESSION['user']) && strcmp( $_SESSION['user'], $username ) == 0 && $result ){
					$return['message'] = 'success';
					http_response_code(200);
				}
				else {
					$return['message'] = 'Invalid username!';
					http_response_code(400);
				}
			}
			else {
				$return['message'] = 'Update error!!!';
				http_response_code(500);
			}
			echo json_encode((object)$return);
		} catch( Exception $error ) {
			echo json_encode((object)$return);
			http_response_code(400);
		}
	}
	else {
		try {
			//	Get param
			// $username = $requestData['username'];

			if( $username == "" ){
				$return['username']= $username;
				$return['message'] = 'Require username!';
				// echo json_encode((object)$return);
				http_response_code(404);
				throw new Exception($return['message']);
			}

			//	Connect
			$connector = mysqli_connect('localhost', 'root', '') or die('Could not connect: '.mysql_error());
			mysqli_set_charset($connector, 'utf8');
			$db_selected = mysqli_select_db($connector, 'simpleonlinequiz');

			//	Query
			$query = "SELECT * FROM `user` WHERE username = '".$username."';";
			// $return['query'] = $query;
			$result = mysqli_query($connector, $query);

			if( $result ){
				if( isset($_SESSION['user']) && mysqli_num_rows($result) == 1 ){
					$right = mysqli_fetch_array($result, MYSQLI_BOTH);
					$return['accountname'] = $right['accountname'];
					$return['username'] = $right['username'];
					// $return['password'] = $right['password'];
					$return['role'] = $right['role'];
					$return['message'] = 'success';
					http_response_code(200);
				}
				else {
					$return['message'] = 'Invalid username!';
					http_response_code(400);
				}
				mysqli_free_result($result);
			}
			else {
				$return['message'] = 'Get info error!!!';
				http_response_code(500);
			}
			echo json_encode((object)$return);
		} catch( Exception $error ) {
			echo json_encode((object)$return);
			http_response_code(400);
		}
	}
?>