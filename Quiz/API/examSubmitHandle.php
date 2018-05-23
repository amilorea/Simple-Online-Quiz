<?php
	session_start();
	header('Content-type: application/json');
	$requestData = json_decode(file_get_contents('php://input'), true);

	//	Make object return
	$return = [];
	if(!isset($_SESSION['user'])){
		$return['message']= 'Invalid user session!';
		echo json_encode((object)$return);
		http_response_code(400);
	}
	else
	try {
		$username = $_SESSION['user'];
		//	Get params
		$contestID = $requestData['id'];
		$answer = $requestData['content'];

		$return['userAnswer'] = $answer;

		//	Connect
		$connector = mysqli_connect('localhost', 'root', '') or die('Could not connect: '.mysql_error());
		mysqli_set_charset($connector, 'utf8');
		$db_selected = mysqli_select_db($connector, 'simpleonlinequiz');

		//	Query
		$query = "SELECT questionID, correct, point FROM `question` WHERE contestID = '".$contestID."';";
		$return['query'] = $query;
		$result = mysqli_query($connector, $query);
		if( $result ){
			if( mysqli_num_rows($result) > 0 ){
				$cnt= 0;
				$contentArr= [];
				while($dataRow = mysqli_fetch_array($result, MYSQLI_BOTH)){
					// $return["".$cnt] = $dataRow;
					$rowArr = [];
					$rowArr['answer'] = $dataRow['correct'];
					$rowArr['maxscore'] = $dataRow['point'];
					$rowArr['score'] = '0';

					$contentArr[$dataRow['questionID']] = $rowArr;
					$cnt += 1;
				}

				$totaltrue = 0;
				$totalpoint = 0.0;
				foreach ( $answer as $key => $value){
					if( strcmp( $value, $contentArr[$key]['answer'] ) == 0 ){
						$totaltrue += 1;
						$totalpoint += floatval( $contentArr[$key]['maxscore'] );
						$contentArr[$key]['score'] = $contentArr[$key]['maxscore'];
					}
				}

				$return['totaltrue'] = $totaltrue;
				$return['totalpoint'] = $totalpoint;				
				$return['content'] = $contentArr;
				mysqli_free_result($result);
				$query = "INSERT INTO `userhistory` ( username, contestID, mark) VALUES ('".$username."', '".$contestID."', '".$totalpoint."')";
				$result = mysqli_query($connector, $query);
				if( $result ){
					$return['message'] = 'success';
					http_response_code(200);
				}
				else {
					$return['message'] = 'Server error!';
					http_response_code(500);
				}
			}
			else {
				$return['contentData'] = $requestData;
				$return['message'] = 'Answer is empty!';
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