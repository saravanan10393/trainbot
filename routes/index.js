var express = require('express');
var router = express.Router();
var trainTimings = require('../utils/traintimeings');

/* GET home page. */
router.post('/traintime', function(req, res, next) {
  if(req.body.result.actionIncomplete){
    res.json({})
    return;
  }

  var parameters = req.body.result.parameters;
  var trainDirection = trainTimings.stations[parameters.fromlocation] < trainTimings.stations[parameters.tolocation] ? "TowardsBeach" : "TowardsVelacherry";

  function getFlaotingTime(timeZoneHour = 5, timeZoneMin = 30){
    var date = new Date()
    var hour = date.getUTCHours() + timeZoneHour;
    var min = date.getUTCMinutes() + timeZoneMin;
    if((min - 60) > 0){
      hour = hour + 1;
    }
    min = (60 - min) > 0 ? min : -(60 - min);
    return parseFloat(hour+"."+min)
  }

  var now = getFlaotingTime();

  var nearestTrainTime = [];
  console.log("train direction ", now)
  //console.log("train timings ", trainTimings.timings[trainDirection][parameters.fromlocation])
  trainTimings.timings[trainDirection][parameters.fromlocation].forEach( (time, index) => {
    if(time < now) return;
    if(nearestTrainTime.length > 5) return;
    console.log(time +" < "+now)
    var toStationTime = trainTimings.timings[trainDirection][parameters.tolocation][index]
    nearestTrainTime.push(`starts at ${time} and ends by ${toStationTime}`)
  });   

  res.json({
    type : 2,
    title : "List of nearest trains",
    replies: nearestTrainTime
  })

});

module.exports = router;
