var express = require('express');
var plantsDB = require('../models/in-memory-plant.js');
var router = express.Router();


module.exports = {

	getStatus: function(req, res,io) {
  		console.log('getStatus',req.body );      
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
                var response = '/';
        console.log(data);
        if (data.light ==="ON"){
          response +='WARM';
        }
        else if (data.ventilator === "ON"){
          response +='COLD';
        }
        else if (data.irrigation === "ON"){
          response +='WATER';
        }
        else {
          response += 'OFF';
        }
      //return what arduino have to do
        res.json(response);
      },function(e){
        res.status(500);
        res.json({error:e, success:false});
      });
      
  },

	postStatus: function(req,res,io) {
 
  		console.log('postStatus',req.body );

  		var stats = {
          envTemperature: parseFloat(req.body.envTemperature),
          envHumidity: parseFloat(req.body.envHumidity),
          soilTemperature: parseFloat(req.body.soilTemperature),
          soilHumidity: parseFloat(req.body.soilHumidity)
      };


      
      plantsDB.save(req.params.id, stats, 
        function(data){

          var statusMsg = data;
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
