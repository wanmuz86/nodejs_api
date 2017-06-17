
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var passport = require('passport')

var User = require('./app/model/user.js')
var Place = require('./app/model/place.js')


var authController = require('./app/controllers/auth.js')
var placeController = require('./app/controllers/place.js')
var mongoose   = require('mongoose');
mongoose.connect('mongodb://wanmuz:ada1234@ds149551.mlab.com:49551/ada_class')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize())

var port = process.env.PORT || 8080;  

var router = express.Router();             

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/places')
.post(authController.isAuthenticated, placeController.postPlaces)
.get(placeController.getPlaces)


router.route('/places/:place_id')
.post(authController.isAuthenticated, placeController.updatePlace)
.get(placeController.getPlace)


router.route('/places/:place_id/reviews')
    .post(authController.isAuthenticated, placeController.postReview)
    .get(placeController.retrieveReview)


router.route('/topfiveplaces')
.get(placeController.topfivePlaces)

router.route('/latestplace')
.get(placeController.latestPlace)

router.route('/search/place/:place_query')
.get(placeController.searchPlace)





router.route('/login')
.post(function(req, res){
User.find()
.where('username').equals(req.body.username)
.where('password').equals(req.body.password)
.exec(function(err,user){

    if (err)
        res.send(err);
    res.json(user)
})

})

router.route('/register')
.post(function(req, res){
    var user = new User();  
    user.username = req.body.username;
    user.password = req.body.password; 
    user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });    
})



app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);