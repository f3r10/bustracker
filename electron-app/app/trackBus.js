import location from './model/location';
import listener from './connectGPS';
import mongoose from 'mongoose'

var interval;
var allData;
var distance = 1 / 6371;

mongoose.connect('mongodb://localhost/geospatial_db', function(err) {
        if (err) throw err;

        // do something...
});
listener.connect(function() {
    console.log('Connected');
});
listener.watch({class: 'WATCH', json:true,  nmea: false});

listener.on('TPV', function(data) {
  allData = data;
});

//interval = setInterval(checkBusStation, 5000);

function checkBusStation() {
  console.log("Va a comparar con la posicion " + allData.lat + " " + allData.lon);
  location.find({
      geo: {
        $near: [allData.lon, allData.lat],
        $maxDistance: distance
      }
    }).limit(10).exec(function(err, locations) {
      if (err) {
        //console.log("Error es " + err + "");
      }

      //console.log("El resultado es " + JSON.stringify(locations))
    });

}
