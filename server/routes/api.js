
var express = require('express');
var plantsDB = require('../models/in-memory-plant.js');
var router = express.Router();


module.exports = {

	getStatus: function(req, res,io) {
  		console.log('getStatus',req.params.id );

      plantsDB.get(req.params.id, function(data){

        res.json({plant: data, success:true});
      },function(e){
        res.status(500);
        res.json({error:e, success:false});
      });
  		
	},
  predict: function(req, res,io) {
      console.log('predict',req.params.id );
      
      plantsDB.predict(req.params.id, function(data){
        io.sockets.in(req.params.id).emit('predict',data);
        res.json({plant: data, success:true});
      },function(e){
        res.status(500);
        res.json({error:e, success:false});
      });
      
  },

	postStatus: function(req,res,io) {
  		
  		console.log('postStatus',req.params.id );
  		var stats = {
          envTemperature: parseFloat(req.body.envTemperature),
          envHumidity: parseFloat(req.body.envHumidity),
          envPressure: parseFloat(req.body.envPressure),
          soilTemperature: parseFloat(req.body.soilTemperature),
          soilHumidity: parseFloat(req.body.soilHumidity)
      };
      plantsDB.save(req.params.id, stats, 
        function(data){
          var statusMsg = {
           id:req.params.id,
           currentStats: stats
           
        };
        //Emit the message to any active dashboard
        io.sockets.in(req.params.id).emit('stats',statusMsg);
        //return correct result
        res.json({status:statusMsg, success:true});
      },
        function(e){
          res.status(500);
          res.json({error:e, success:false});
      });

  		
	},

}
