var fs = require('fs');
var express = require('express');
var router = express.Router();

var controllers = {};

var files = fs.readdirSync('../routes');
files.forEach(function(file){
	var key = file.replace(/\.\w{2,3}$/, '');
	controllers[key] = require('./routes/' + file);
});

module.exports = {

	initialize: function(){
		router.get('/', controllers.index.index);

		return router;
	}

};
