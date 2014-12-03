
var express = require('express');
var plantsDB = require('../models/in-memory-plant.js');
var router = express.Router();


module.exports = {

	getStatus: function(req, res,io) {
  		console.log('getStatus',req.body );

      //if (p){
        res.json('/' + "COLD");
      /*}
      else{
        res.json('/' + "");
      }*/

      //return what arduino have to do

      /*
      plantsDB.get(req.params.id, function(data){

        res.json({plant: data, success:true});
      },function(e){
        res.status(500);
        res.json({error:e, success:false});
      });
  		*/
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
  		//{"temp":"31.00","soilHumidity":"868.00","humidity":"34.00"}
  		console.log('postStatus',req.body );

  		var stats = {
          envTemperature: parseFloat(req.body.envTemperature),
          envHumidity: parseFloat(req.body.envHumidity),
          soilTemperature: parseFloat(req.body.soilTemperature)
      };

      res.json('OK');
      /*
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
      */
  		
	},

}
