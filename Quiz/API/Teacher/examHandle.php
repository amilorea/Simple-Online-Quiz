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

		//	Connect
		$connector = mysqli_connect('localhost', 'root', '') or die('Could not connect: '.mysql_error());
		mysqli_set_charset($connector, 'utf8');
		$db_selected = mysqli_select_db($connector, 'simpleonlinequiz');

		//	Query
		$query = "SELECT * FROM `question` WHERE contestID = '".$contestID."';";
		$return['query'] = $query;
		$result = mysqli_query($connector, $query);

		if( $result ){
			$cnt= 0;
			$contentArr= [];
			while($dataRow = mysqli_fetch_array($result, MYSQLI_BOTH)){
				// $return["".$cnt] = $dataRow;
				$rowArr = [];
				$rowArr['id'] = $dataRow['questionID'];
				$rowArr['score'] = $dataRow['point'];
				$rowArr['content'] = $dataRow['question'];
				$rowArr['anwser1'] = $dataRow['A'];
				$rowArr['anwser2'] = $dataRow['B'];
				$rowArr['anwser3'] = $dataRow['C'];
				$rowArr['anwser4'] = $dataRow['D'];
				$rowArr['correct'] = $dataRow['correct'];
				$contentArr[$cnt] = $rowArr;
				$cnt += 1;
			}
			$return['content'] = $contentArr;
			$return['message'] = 'success';
			http_response_code(200);
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