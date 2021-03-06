<?php
	session_start();
	header('Content-type: application/json');
	$requestData = json_decode(file_get_contents('php://input'), true);

	//	Make object return
	$return = [];

	$teacherRole = 2;
	if(!isset($_SESSION['user'])||!isset($_SESSION['role'])){
		$return['message']= 'Invalid user session!';
		echo json_encode((object)$return);
		http_response_code(400);
	}
	elseif(intval($_SESSION['role']) < $teacherRole ){
		$return['message']= "You aren't Teacher or Admin!";
		echo json_encode((object)$return);
		http_response_code(400);
	}
	else
	try {
		//	Get param
		$teacher = $_SESSION['user'];
		if( $teacher == NULL )	//	just for test
			$teacher = $requestData['teacher'];
		$contestname = $requestData['contestname'];

		if( strlen( trim( $contestname, ' ' ) ) == 0 ){
			$return['message'] = 'Tên kì thi không được trống';
			http_response_code(400);
			throw new Exception($return['message']);
		}

		//	Connect
		$connector = mysqli_connect('localhost', 'root', '') or die('Could not connect: '.mysql_error());
		mysqli_set_charset($connector, 'utf8');
		$db_selected = mysqli_select_db($connector, 'simpleonlinequiz');

		//	Query
		$query = "INSERT INTO `contest` ( contestname, teacher ) VALUES ('".$contestname."', '".$teacher."');";
		$return['query'] = $query;
		$result = mysqli_query($connector, $query);

		if( $result ){
			if( mysqli_affected_rows( $connector ) ){
				$return['message'] = 'success';
				http_response_code(200);
			}
			else {
				$return['message'] = 'Not found username!';
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