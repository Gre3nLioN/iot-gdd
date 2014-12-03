var fs = require('fs');
var express = require('express');
var router = express.Router();

var controllers = {};

var files = fs.readdirSync('./routes');
files.forEach(function(file){
	var key = file.replace(/\.\w{2,3}$/, '');
	controllers[key] = require('./routes/' + file);
});



var peopleCount = 0;


module.exports = {

	initialize: function(io){
		//Content
		router.get('/', controllers.views.index);
		router.get('/dashboard/:id', controllers.views.dashboard);

		//API
		router.get('/api/v1/plant/:id', function(req,res){controllers.api.getStatus(req,res,io)});
		router.post('/api/v1/plant/stats/:id', function(req,res){controllers.api.postStatus(req,res,io)});
		router.get('/api/v1/plant/predict/:id', function(req,res){controllers.api.predict(req,res,io)});
		

		return router;
	}

};
