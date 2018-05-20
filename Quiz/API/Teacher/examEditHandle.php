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
		//	Get Params
		$contestID = $requestData['id'];
		$contestname = $requestData['name'];

		if( empty($contestID) || empty($contestname) ){
			$return['params']= $requestData;
			$return['message'] = 'Require params!';

			http_response_code(404);
			throw new Exception($return['message']);
		}

		//	Connect
		$connector = mysqli_connect('localhost', 'root', '') or die('Could not connect: '.mysql_error());
		mysqli_set_charset($connector, 'utf8');
		$db_selected = mysqli_select_db($connector, 'simpleonlinequiz');

		//	Query
		$mountChanged= 0;
		$query = "UPDATE `contest` SET contestname = '".$contestname."' WHERE ID = '".$contestID."';";

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