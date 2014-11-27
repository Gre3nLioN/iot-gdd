var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/iot');

exports.PlantModel= mongoose.model('Plant',	{ 
	plant_id: Number,
	humidity: Number,
	light: Number,
	temperature: Number
});
