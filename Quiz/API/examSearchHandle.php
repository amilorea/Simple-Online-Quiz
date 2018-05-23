<?php
	session_start();
	header('Content-type: application/json');
	$requestData = json_decode(file_get_contents('php://input'), true);

	//	Make object return
	$return = [];

	try {
		//	Get params
		$return['params'] = $requestData;
		$searchID = $requestData['id'];
		$searchName = $requestData['name'];
		$searchTeacher = $requestData['teacher'];
		//	Connect
		$connector = mysqli_connect('localhost', 'root', '') or die('Could not connect: '.mysql_error());
		mysqli_set_charset($connector, 'utf8');
		$db_selected = mysqli_select_db($connector, 'simpleonlinequiz');
		//	Query
		$query = "SELECT ID, contestname, teacher, created, COUNT( question.questionID ) as count, ROUND( SUM(question.point), 1) as total FROM `contest` LEFT OUTER JOIN `question` ON question.`contestID` = contest.ID WHERE contestname LIKE '%".$searchName."%' AND contest.ID LIKE '%".$searchID."%' AND contest.teacher LIKE '%".$searchTeacher."%'  GROUP BY contest.ID";
		$return['query'] = $query;
		$result = mysqli_query($connector, $query);
		if( $result ){
			// if( mysqli_num_rows($result) > 0 ){
				$cnt= 0;
				$contentArr= [];
				while($dataRow = mysqli_fetch_array($result, MYSQLI_BOTH)){
					$rowArr = [];
					$rowArr['id']= $dataRow['ID'];
					$rowArr['name']= $dataRow['contestname'];
					$rowArr['teacher']= $dataRow['teacher'];
					$rowArr['totalpoint']= $dataRow['total'];
					$rowArr['questioncount']= $dataRow['count'];
					// $rowArr['id']= $dataRow['id'];
					$contentArr[$cnt] = $rowArr;
					$cnt += 1;
				}
				$return['content'] = $contentArr;
				$return['message'] = 'success';
				http_response_code(200);
			// }
			// else {
			// 	$return['message'] = 'success';
			// 	http_response_code(200);
			// }
			mysqli_free_result($result);
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