<?php
	session_start();
	header('Content-type: application/json');
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
		//	Connect
		$connector = mysqli_connect('localhost', 'root', '') or die('Could not connect: '.mysql_error());
		mysqli_set_charset($connector, 'utf8');
		$db_selected = mysqli_select_db($connector, 'simpleonlinequiz');
		//	Query
		$query = "SELECT * FROM `userhistory` INNER JOIN `contest` ON contest.ID = contestID WHERE username= '".$username."';";
		$return['query'] = $query;
		$result = mysqli_query($connector, $query);
		if( $result ){
			if( mysqli_num_rows($result) > 0 ){
				$cnt= 0;
				$contentArr= [];
				while($dataRow = mysqli_fetch_array($result, MYSQLI_BOTH)){
					// $return["".$cnt] = $dataRow;
					$rowArr = [];
					$rowArr['id']= $dataRow['historyID'];
					$rowArr['name']= $dataRow['contestname'];
					$rowArr['teacher']= $dataRow['teacher'];
					$rowArr['yourpoint']= $dataRow['mark'];
					// $rowArr['id']= $dataRow['id'];
					$contentArr[$cnt] = $rowArr;
					$cnt += 1;
				}
				$return['content'] = $contentArr;
				$return['message'] = 'success';
				http_response_code(200);
			}
			else {
				$return['message'] = 'Lịch sử trống!';
				http_response_code(400);
			}
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