<?php
	session_start();
	header('Content-type: application/json');
	$requestData = json_decode(file_get_contents('php://input'), true);

	//	Make object return
	$return = [];

	// $teacherRole = 2;
	// if(!isset($_SESSION['user'])||!isset($_SESSION['role'])){
	// 	$return['message']= 'Invalid user session!';
	// 	echo json_encode((object)$return);
	// 	http_response_code(400);
	// }
	// elseif(intval($_SESSION['role']) < $teacherRole ){
	// 	$return['message']= "You aren't Teacher or Admin!";
	// 	echo json_encode((object)$return);
	// 	http_response_code(400);
	// }
	// else
	try {
		//	Get Params
		$questionID = $requestData['id'];

		if( empty($questionID) || empty($requestData['question']) || empty($requestData['A']) || empty($requestData['B']) || empty($requestData['C']) || empty($requestData['D']) || empty($requestData['correct']) ){
			$return['params']= $requestData;
			$return['message'] = 'Require params!';
			// echo json_encode((object)$return);
			http_response_code(404);
			throw new Exception($return['message']);
		}

		//	Connect
		$connector = mysqli_connect('localhost', 'root', '') or die('Could not connect: '.mysql_error());
		mysqli_set_charset($connector, 'utf8');
		$db_selected = mysqli_select_db($connector, 'simpleonlinequiz');

		//	Query
		$mountChanged= 0;
		$query = "UPDATE `question` SET ";

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

		addQuery('question', $requestData['question']);
		addQuery('point', $requestData['point']);
		addQuery('A', $requestData['A']);
		addQuery('B', $requestData['B']);
		addQuery('C', $requestData['C']);
		addQuery('D', $requestData['D']);
		addQuery('correct', $requestData['correct']);

		$query= $query." WHERE questionID = '".$questionID."';";

		$return['query'] = $query;
		$result = mysqli_query($connector, $query);

		if( $result ){
			$result = mysqli_affected_rows( $connector );
			if( $result == 1 ){
				$return['message'] = 'success';
				http_response_code(200);
			}
			else {
				if( $result > 1 )
					$return['message'] = 'Something when wrong because of '.$result." effect row!";
				else
					$return['message'] = 'Not found question!';
				http_response_code(400);
			}
		}
		else {
			$return['message'] = 'Server error!!!';
			http_response_code(500);
		}
		echo json_encode((object)$return);
	} catch ( Exception $error ) {
		echo json_encode((object)$return);
		http_response_code(400);
	}
?>