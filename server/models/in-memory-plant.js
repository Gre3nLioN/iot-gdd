/* GET home page. */
module.exports = {
	plants:[],
	getById: function(id){
		for (var i = 0; i < this.plants.length; i++) {
			if (this.plants[i].id === id){
				return this.plants[i];
			}
		};
		return false;
	},
	get: function(id, callback, error){ 
		var plant = this.getById(id);
		if (!plant){
			error(id + ' was not found');	
		}
		else {
			callback(plant);
		}
		
	},
	predict:function(id,callback,error){

		var plant = this.getById(id);
		if (!plant){
			error(id + ' was not found');	
		}
		else {
			//Predict weather.
			//Take last prediction.
			var last = plant.history[0];
			console.log(last.soilHumidity);
			//TODO: How about an array of formulas?
			//First Formula:: 
			//If Soil humidity <45% : Start Irrigation until returning to normal.
			if (last.soilHumidity < 45){
				//TODO: How about to predict weather and if conditions 
				//are positive in the future not change antyhing?
				plant.status.irrigation = 'ON';
			}
			else {
				plant.status.irrigation = 'OFF';	
			}
			//If Env Temperature > 25C : Ventilate about 45 minutes.
			if (last.envTemperature > 25){
				//TODO: How about to predict weather and if conditions 
				//are positive in the future not change antyhing?
				plant.status.ventilator = 'ON';
			}
			else{
				plant.status.ventilator = 'OFF';	
			}
			callback(plant.status);
		}
	},
	save: function(id,stats,callback, error){
		
		var plant = this.getById(id);
		stats.timeStamp = new Date();
		if (!plant){
			//Add new instance
			var newPlant = {
				id: id,
				history: [],
				status: { light:'OFF', ventilator:'OFF', irrigation:'OFF'}
			};
			newPlant.history.unshift(stats);
			//Add statatistics instance
			this.plants.unshift(newPlant);
			plant = newPlant;
		}
		else {
			plant.history.unshift(stats);
			
		}
		//Converting to simpler version.
		simplePlant = {
				stats: stats,
				status: plant.status,
				id: id
		};
		callback(simplePlant);
	}
};