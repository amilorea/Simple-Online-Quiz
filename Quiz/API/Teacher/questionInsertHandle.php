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
		$contestID = $requestData['id'];

		$rowInQuery = "( contestID, question, A, B, C, D, correct, point )";
		if( empty($contestID) || empty($requestData['question']) || empty($requestData['A']) || empty($requestData['B']) || empty($requestData['C']) || empty($requestData['D']) || empty($requestData['correct']) ){
			$return['params'] = $requestData;
			$return['message'] = "Missing params!";
			throw new Exception($return['message']);
		}
		$valueInQuery = "";
		$valueInQuery = $valueInQuery."( '".$contestID."', '".$requestData['question'];
		$valueInQuery = $valueInQuery."', '".$requestData['A']."', '".$requestData['B']."', '".$requestData['C']."', '".$requestData['D'];
		$valueInQuery = $valueInQuery."', '".$requestData['correct']."', '".$requestData['point']."')";

		$return['value'] = $valueInQuery;

		//	Connect
		$connector = mysqli_connect('localhost', 'root', '') or die('Could not connect: '.mysql_error());
		mysqli_set_charset($connector, 'utf8');
		$db_selected = mysqli_select_db($connector, 'simpleonlinequiz');

		//	Query
		$query = "INSERT INTO `question` ".$rowInQuery." VALUES ".$valueInQuery.";";
		$return['query'] = $query;
		$result = mysqli_query($connector, $query);

		if( $result ){
			if( mysqli_affected_rows( $connector ) > 0 ){
				$return['id'] = mysqli_insert_id($connector);
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