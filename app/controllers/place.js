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