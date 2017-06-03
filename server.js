
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var Place = require('./app/model/place.js')
var mongoose   = require('mongoose');
mongoose.connect('mongodb://wanmuz:ada1234@ds149551.mlab.com:49551/ada_class')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;  

var router = express.Router();             

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/places')

    .post(function(req, res) {

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

    })
    .get(function(req, res) {
        Place.find(function(err, places) {
            if (err)
                res.send(err);

            res.json(places);
        });
    })

    router.route('/places/:place_id')
    .get(function(req, res) {
        Place.findById(req.params.place_id, function(err, place) {
            if (err)
                res.send(err);
            res.json(place);
        });
    })
    .post(function(req, res) {

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
    })
    .delete(function(req, res) {
        Place.remove({
            _id: req.params.place_id
        }, function(err, place) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    })
    router.route('/places/:place_id/reviews')
    .post(function(req,res){
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
    })
    .get(function(req,res){
        Place.findById(req.params.place_id, function(err, place){

            if (err)
                res.send(err)

            res.json(place.reviews)
        })
    })






app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);