
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var Place = require('./app/model/place.js')

var placeController = require('./app/controllers/place.js')
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
.post(placeController.postPlaces)
.get(placeController.getPlaces)


router.route('/places/:place_id')
.post(placeController.updatePlace)
.get(placeController.getPlace)


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


router.route('/topfiveplaces')
.get(function(req,res){
    Place.find()
    .limit(5)
    .sort({avgRating: '-1'})
    .exec(function(err, places){
        if (err)
            res.send(err)

        res.json(places)


    })
})

router.route('/latestplace')
.get(function(req,res){

    
})

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);