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
		//	Get params
		$return['params'] = $requestData;
		$searchRole = $requestData['role'];
		$searchName = $requestData['username'];
		$searchAccount = $requestData['accountname'];
		//	Connect
		$connector = mysqli_connect('localhost', 'root', '') or die('Could not connect: '.mysql_error());
		mysqli_set_charset($connector, 'utf8');
		$db_selected = mysqli_select_db($connector, 'simpleonlinequiz');
		//	Query
		$query = "SELECT * FROM `user` WHERE role LIKE '%".$searchRole."%' AND username LIKE '%".$searchName."%' AND accountname LIKE '%".$searchAccount."%'";
		$return['query'] = $query;
		$result = mysqli_query($connector, $query);
		if( $result ){
			$cnt= 0;
			$contentArr= [];
			while($dataRow = mysqli_fetch_array($result, MYSQLI_BOTH)){
				$rowArr = [];
				$rowArr['accountname']= $dataRow['accountname'];
				$rowArr['username']= $dataRow['username'];
				$rowArr['password']= $dataRow['password'];
				$rowArr['role']= $dataRow['role'];

				$contentArr[$cnt] = $rowArr;
				$cnt += 1;
			}
			$return['content'] = $contentArr;
			$return['message'] = 'success';
			http_response_code(200);

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