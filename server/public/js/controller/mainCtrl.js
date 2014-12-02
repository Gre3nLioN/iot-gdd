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
 	var deviceId = 'roberta';
 	socket.emit('room', deviceId);
 
	socket.on('stats', function(data){
		$scope.$apply(function(){
			console.log('stats',data);
			$scope.stats= data.stats;
			$scope.status =data.status;
		});
	});
	socket.on('predict', function(data){
		$scope.$apply(function(){
			console.log('predict',data);
			$scope.status= data;
		});
	});

};
