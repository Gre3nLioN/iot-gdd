var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = {
	
	in: function(req, res) {
  		  io.emit('people-out', {});
  		  res.json({result:'OK'});
	},
	out: function(req, res) {
  		io.emit('people-in', {});
  		res.json({result:'OK'});
	}
	
}


