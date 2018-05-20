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
		$return['params'] = $requestData;
		$contestID = $requestData['id'];

		//	Connect
		$connector = mysqli_connect('localhost', 'root', '') or die('Could not connect: '.mysql_error());
		mysqli_set_charset($connector, 'utf8');
		$db_selected = mysqli_select_db($connector, 'simpleonlinequiz');

		//	Query
		$query1 = "SELECT contest.*, accountname FROM `contest` LEFT OUTER JOIN `user` ON user.username = teacher WHERE ID = '".$contestID."';";
		$query2 = "SELECT * FROM `question` WHERE contestID = '".$contestID."';";
		$return['query1'] = $query1;
		$return['query2'] = $query2;
		$resultContest = mysqli_query($connector, $query1);
		$result = mysqli_query($connector, $query2);
		if( $result && $resultContest ){
			$contestData = mysqli_fetch_array($resultContest, MYSQLI_BOTH);
			$return['name'] = $contestData['contestname'];
			$return['teacher'] = $contestData['accountname'];
			if( !isset($return['teacher']) )
				$return['teacher'] = "Không xác định";

			$cnt= 0;
			$contentArr= [];
			while($dataRow = mysqli_fetch_array($result, MYSQLI_BOTH)){
				// $return["".$cnt] = $dataRow;
				$rowArr = [];
				$rowArr['id']= $dataRow['questionID'];
				$rowArr['score']= $dataRow['point'];
				$rowArr['content']= $dataRow['question'];
				$rowArr['anwser1']= $dataRow['A'];
				$rowArr['anwser2']= $dataRow['B'];
				$rowArr['anwser3']= $dataRow['C'];
				$rowArr['anwser4']= $dataRow['D'];
				// $rowArr['id']= $dataRow['id'];
				$contentArr[$cnt] = $rowArr;
				$cnt += 1;
			}
			$return['content'] = $contentArr;
			$return['message'] = 'success';
			http_response_code(200);

			mysqli_free_result($result);
			mysqli_free_result($resultContest);
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