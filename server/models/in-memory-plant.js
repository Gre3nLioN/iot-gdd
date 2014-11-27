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
			callback();
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
				status: 'OFF'
			};
			newPlant.history.push(stats);
			//Add statatistics instance
			this.plants.push(newPlant);
		}
		else {
			plant.history.push(stats);
			
		}
		callback();
	}
};