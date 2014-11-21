var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/iot');

exports.TemperatureModel= mongoose.model('Temperature,	{ 
	temp: Number,
   	time: {type: Date, default: Date.now}	
});

exports.LightModel= mongoose.model('Light,	{ 
	lum: Number,
   	time: {type: Date, default: Date.now}	
});
