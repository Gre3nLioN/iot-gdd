var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = {
	
	index: function(req, res) {
  		res.render('index', { });
	},
	dashboard: function(req, res) {
  		res.render('dashboard', { dashboard: req.params.id });

	},
	//NoiseDemo.
	noise: function(req, res) {
  		res.sendfile('./public/noise.html');
	}
	
}
