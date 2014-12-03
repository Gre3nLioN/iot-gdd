var mainCtrl = function($scope, $http) {
	console.log('main');
	var serverName = window.location.protocol + "//" + window.location.host;
	var socket;
	if (window.location.host.indexOf('local') > -1){
	  socket = io('http://localhost:3000');
	}
	else {
	  socket = io(serverName);
	}
 	
 	//TODO: Change to real device
 	var deviceId = 'Roberta';
 	$scope.device= deviceId;
 	socket.emit('room', deviceId);
 	
	socket.on('stats', function(data){
		$scope.$apply(function(){
			console.log('stats',data);
			$scope.stats= data.stats;
			$scope.status =data.status;
		});
	});

	//for each condition, one copy
	var deviceCopy = ' esta muy tranquila.';
 	var irrigationCopy = ' esta tomando agua.';
 	var ventilatorCopy = ' prendio el ventilador.';

	socket.on('predict', function(data){
		$scope.$apply(function(){
			console.log('predict',data);
			if (data.ventilator === "ON" && data.irrigation === "ON"){
				$scope.copy = ventilatorCopy + " y " + irrigationCopy;
			}
			else if (data.irrigation === "ON"){
				$scope.copy = ventilatorCopy ;
			}
			else if (data.irrigation === "ON"){
				$scope.copy = irrigationCopy;
			}
			else{
				$scope.copy = deviceCopy;
			}
			$scope.status= data;
		});
	});
	$scope.copy = deviceCopy;

};
