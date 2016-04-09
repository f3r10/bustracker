var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

let CitySchema   = new Schema({
  name: String,
  geo: {
    type: [Number],
    index: '2d'
  }
});

export default mongoose.model('location', CitySchema)
