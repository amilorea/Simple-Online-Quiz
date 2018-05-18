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
	elseif(intval($_SESSION['role']) >= $teacherRole ){
		$return['message']= "You aren't Admin!";
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

		$rowInQuery = "( contestID, question, A, B, C, D, correct, point )";
		$valueInQuery = "";
		foreach($requestData['content'] as $data){
			if( strlen( $valueInQuery ) != 0 )
				$valueInQuery = $valueInQuery.", ";
			$valueInQuery = $valueInQuery."( '".$contestID."', '".$data['question'];
			$valueInQuery = $valueInQuery."', '".$data['A']."', '".$data['B']."', '".$data['C']."', '".$data['D'];
			$valueInQuery = $valueInQuery."', '".$data['correct']."', '".$data['point']."')";
		}

		$return['value'] = $valueInQuery;

		//	Connect
		$connector = mysqli_connect('localhost', 'root', '') or die('Could not connect: '.mysql_error());
		mysqli_set_charset($connector, 'utf8');
		$db_selected = mysqli_select_db($connector, 'simpleonlinequiz');

		//	Query
		$query1 = "INSERT INTO `contest` ( contestname, teacher ) VALUES ('".$contestname."', '".$teacher."');";
		$query2 = "INSERT INTO `question` ".$rowInQuery." VALUES ".$valueInQuery.";";
		$return['query1'] = $query1;
		$return['query2'] = $query2;
		// mysqli_query($connector, $query);
		// $result = mysqli_affected_rows( $connector );

		if( $result == 1 ){
			if( $result ){
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