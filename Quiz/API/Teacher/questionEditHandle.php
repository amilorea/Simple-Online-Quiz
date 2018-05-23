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
		$questionID = $requestData['id'];

		if( empty($questionID) || empty($requestData['question']) || empty($requestData['A']) || empty($requestData['B']) || empty($requestData['C']) || empty($requestData['D']) || empty($requestData['correct']) ){
			$return['params']= $requestData;
			$return['message'] = 'Require params!';
			// echo json_encode((object)$return);
			http_response_code(404);
			throw new Exception($return['message']);
		}

		// Create connection
		$connector = new mysqli('localhost', 'root', '', 'simpleonlinequiz');

		// Check connection
		if ($connector->connect_error) {
		    die("Connection failed: " . $connector->connect_error);
		}

		//	Query
		$mountChanged= 0;
		$query = " ";

		//	Query
		$stmt = $connector->prepare( "UPDATE `question` SET question= ?, A= ?, B= ?, C= ?, D= ?, correct= ?, point= ? WHERE questionID = ?" );
		$stmt->bind_param('ssssssdi', $question, $A, $B, $C, $D, $correct, $point, $id);

		$id = $questionID;
		$question = $requestData['question'];
		$A = $requestData['A'];
		$B = $requestData['B'];
		$C = $requestData['C'];
		$D = $requestData['D'];
		$correct = $requestData['correct'];
		if( isset( $requestData['point'] ) )
			$point = floatval( $requestData['point'] );
		else
			$point = 0.0;
		$result = $stmt->execute();

		$return['error'] = $stmt->error;

		if( $result ){
			if( mysqli_affected_rows( $connector ) == 1 ){
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