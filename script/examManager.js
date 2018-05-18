function searchExam(){
	//Bắt đầu request
	onload(document.getElementById('notification'), 30);
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			logParam(this.responseText);
			var returnObject = JSON.parse(this.responseText);
			logParam(returnObject);
			unload(document.getElementById('notification'));
			switch(this.status){
			case 200:
				var content = returnObject['content'];
				var prototypeRow = document.getElementById('prototype');
				var searchable = document.getElementsByClassName('searchable');
				while(searchable.length != 0)
					searchable[0].remove();
				for(var cnt = content.length; cnt > 0; cnt--){
					var data = content[cnt - 1];
					var newRow = prototypeRow.cloneNode(true);
					newRow.getElementsByClassName('idCol')[0].innerHTML = data['id'];
					newRow.getElementsByClassName('nameCol')[0].innerHTML = '<div onclick="loadMiddlePage(\'exam.html\', function(){ return editExam(' + data['id'] + ') })">' + data['name'] + '</div>';
					newRow.getElementsByClassName('countCol')[0].innerHTML = data['questioncount'];
					newRow.getElementsByClassName('pointCol')[0].innerHTML = data['totalpoint'];
					newRow.classList.remove('hide');
					newRow.classList.add('searchable');
					newRow.setAttribute('id', 'exam' + data['id']);
					console.log(newRow);
					prototypeRow.after(newRow);
				}
				break;
			case 400:
				notification(returnObject['message'], 'error');
				break;
			case 404:
				notification(returnObject['message'], 'error');
				loadMiddlePage('main.html');
				break;
			}
		}
	};
	request.open('GET', API + 'examOwnedHandle.php');
	request.setRequestHeader('Content-type', 'application/json');
	request.send();
}