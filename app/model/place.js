var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var openingTimeSchema = new Schema({
	days: {type: String},
	opening: String, 
	closing: String, 
	closed: {type: Boolean}
});

var reviewSchema = new Schema({
	author: String, 
	rating: {type: Number, "default":0, min:0, max:5},
	reviewText: String,
	createdOn: {type:Date, default: Date.now}
});

var PlaceSchema = new Schema({
	name:{type : String, required:true},
	address:String,
	avgRating: {type: Number, "default":0},
	facilities:[String],
	coords: {type: [Number], index:'2dsphere'},
	openingTimes: [openingTimeSchema],
	reviews: [reviewSchema],
});


module.exports = mongoose.model('Place', PlaceSchema);


