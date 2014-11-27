var fs = require('fs');
var express = require('express');
var router = express.Router();

var controllers = {};

var files = fs.readdirSync('./routes');
files.forEach(function(file){
	var key = file.replace(/\.\w{2,3}$/, '');
	controllers[key] = require('./routes/' + file);
});

module.exports = {

	initialize: function(){
		router.get('/', controllers.index.index);
		//API-Plat
		router.get('/plant/:plant:id', controllers.api.getPlant);
		router.get('/plant/:plant_id/temperatura/:temp', controllers.api.getTemperature);
		router.get('/plant/:plant_id/humidity/:temp', controllers.api.getHumidity);
		router.get('/plant/:plant_id/light/:temp', controllers.api.getLight);
		router.post('/plant/:plant_id/temperatura/:temp', controllers.api.setTemperature);
		router.post('/plant/:plant_id/humidity/:humidity', controllers.api.setHumidity);
		router.post('/plant/:plant_id/light/:light', controllers.api.setLight);

		//Noise
		router.get('/noise',controllers.index.noise);

		//Sockets

		return router;
	}

};
