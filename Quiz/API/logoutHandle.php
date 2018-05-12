<?php
	session_start();
	header('Content-type: application/json');
	$requestData = json_decode(file_get_contents('php://input'), true);

	//	Make object return
	$return = [];

	//	Destroy session
	if( isset($_SESSION['user']) && session_destroy() ) {
		$return['message'] = 'success';
		http_response_code(200);
	}
	else {
		$return['message'] = 'failed!';
		http_response_code(401);
	}
	echo json_encode((object)$return);
?>