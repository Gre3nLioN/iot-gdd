
var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = {

	getPlant: function(req, res){
		Plant.findOne({ 'plant_id': req.params.plant_id }, function (err, plant) {
			res.send(plant);
		});
	},

	getTemperature: function(req, res){
		Plant.findOne({ 'plant_id': req.params.plant_id }, function (err, plant) {
		    if (err) return handleError(err);
			//check if plant already exist, and save the temperature
			if(plant)
				res.send(plant.temperature);
		});		
	},

	getHumidity: function(req, res){
		Plant.findOne({ 'plant_id': req.params.plant_id }, function (err, plant) {
		    if (err) return handleError(err);
			//check if plant already exist, and save the temperature
			if(plant)
				res.send(plant.humidity);
		});		
	},

	getLight: function(req, res){
		Plant.findOne({ 'plant_id': req.params.plant_id }, function (err, plant) {
		    if (err) return handleError(err);
			//check if plant already exist, and save the temperature
			if(plant)
				res.send(plant.light);
		});		
	},

	setTemperature: function(req, res) {
		Plant.findOne({ 'plant_id': req.params.plant_id }, function (err, plant) {
		    if (err) return handleError(err);
			//check if plant already exist, and save the temperature
			if(!plant){
				var plant = new Plant({
					plant_id: req.params.plant_id,
					temperature: req.params.temperature
				});
			}else{
				plant.temperature = req.params.temperature;
			}
			plant.save(function (err, plant) {
				if (err) return console.error(err);
			});		
		});		
	},

	setHumidity: function(req, res){
		Plant.findOne({ 'plant_id': req.params.plant_id }, function (err, plant) {
		    if (err) return handleError(err);
			//check if plant already exist, and save the temperature
			if(!plant){
				var plant = new Plant({
					plant_id: req.params.plant_id,
					humidity: req.params.humidity
				});
			}else{
				plant.humidity = req.params.humidity;
			}
			plant.save(function (err, plant) {
				if (err) return console.error(err);
			});		
		});		
	},

	setLight: function(req, res){
		Plant.findOne({ 'plant_id': req.params.plant_id }, function (err, plant) {
		    if (err) return handleError(err);
			//check if plant already exist, and save the temperature
			if(!plant){
				var plant = new Plant({
					plant_id: req.params.plant_id,
					light: req.params.light
				});
			}else{
				plant.light = req.params.light;
			}
			plant.save(function (err, plant) {
				if (err) return console.error(err);
			});		
		});		
	}
	
}
