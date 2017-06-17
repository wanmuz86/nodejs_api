var Place = require('../model/place.js');

exports.postPlaces = function(req, res) {
	var place = new Place();      
	place.name = req.body.name;  
	place.address = req.body.address;
	var openingTimes = {
		opening : req.body.opening,
        closed: false,
       	days: req.body.days
       }
       place.userId = req.user._id
    
       place.facilities = [req.body.facilities];
       place.openingTimes = [openingTimes];
       var coords = [req.body.latitude, req.body.longitude]
       place.coords = coords;
       place.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Place created!' });
        });	
};

exports.getPlaces = function(req,res){
	Place.find(function(err, places) {
		if (err)
			res.send(err);
		res.json(places);
        });
};

exports.getPlace = function(req,res){
	Place.findById(req.params.place_id, function(err, place) {
		if (err)
			res.send(err);
            res.json(place);
        });
}

exports.updatePlace = function(req,res){
	Place.findById(req.params.place_id, function(err, place) {
		if (err)
			res.send(err);

            place.name = req.body.name;  
            place.description = req.body.description;
        	place.country = req.body.country;

            // save the place
            place.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Place updated!' });
            });

        });
}

exports.deletePlace = function(req,res){
	Place.remove({
            _id: req.params.place_id
        }, function(err, place) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
}

exports.postReview = function(req,res){
        Place.findById(req.params.place_id, function(err, place){
            if (err)
                res.send(err)

            var newReview = {
                author : req.body.author,
                rating : req.body.rating,
                reviewText: req.body.reviewText 
            }

            var totalRating = place.avgRating * place.reviews.length

            place.avgRating = (parseInt(totalRating) + parseInt(newReview.rating)) / (place.reviews.length + 1)
           
            place.reviews.push(newReview)
            place.save(function(err){
                if (err)
                    res.send(err);

                res.json({message: 'Review added!'});
            })

        })
    }

exports.retrieveReview = function(req,res){
        Place.findById(req.params.place_id, function(err, place){

            if (err)
                res.send(err)

            res.json(place.reviews)
        })
    }

exports.topfivePlaces = function(req,res){
    Place.find()
    .limit(5)
    .sort({avgRating: '-1'})
    .exec(function(err, places){
        if (err)
            res.send(err)

        res.json(places)


    })
}

exports.latestPlace = function(req,res){
    Place.find()
    .limit(1)
    .sort({dateAdded:'-1'})
    .exec(function(err, place){
      if (err)
      res.send(err)
      res.json(place)  
    })
}
exports.searchPlace = function(req,res){
    var regex = new RegExp('^'+req.params.place_query+'$', "i")
    console.log(regex)
    Place.find({"name":  req.params.place_query})
    .exec(function(err,places){
        if (err)
            res.send(err)
        res.json(places)
    });
}



