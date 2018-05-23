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
		//	Get Params
		$username = $requestData['username'];
		$accountname = $requestData['accountname'];
		$password = $requestData['password'];
		$passwordMD5 = MD5($password);
		$role = $requestData['role'];

		if( strcmp($accountname, "") == 0 && strcmp($password, "") == 0 && !isset($role) ){
			$return['params']= $requestData;
			$return['message'] = 'Không thay đổi!';
			throw new Exception($return['message']);
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
		if( strcmp($password, "") != 0 )
			addQuery('password', $passwordMD5);
		addQuery('role', $role);

		$query= $query." WHERE username = '".$username."';";

		$return['query'] = $query;
		$result = mysqli_query($connector, $query);

		$return['amount'] = mysqli_affected_rows($connector);
		if( $result ){
			if( mysqli_affected_rows($connector) > 0 ){
				$_SESSION['account'] = $accountname;
				$return['message'] = 'success';
				http_response_code(200);
			}
			else {
				$return['message'] = 'Nothing change!';
				http_response_code(400);
			}
		}
		else {
			$return['message'] = 'Update error!!!';
			http_response_code(500);
		}
		echo json_encode((object)$return);
	} catch ( Exception $error ) {
		echo json_encode((object)$return);
		http_response_code(400);
	}
?>