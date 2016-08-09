var express = require('express');
var router = express.Router();
var Yelp = require('yelp');
var yelpCredentials = require('../credentials');

var yelp = new Yelp(yelpCredentials);

router.post('/', function(req, res, next) {

  var searchObj = {
    term: 'coffee shops free wifi'
  };

  searchObj.location = req.body.location;

  if (req.body.food) {
    searchObj.categories = 'food, All';
  } 

  if (req.body.dogFriendly) {
    searchObj.term += ' dog friendly';
  }

  yelp.search(searchObj, function(err, data) {
    if (err) return console.log(error);
    res.json(data);
  });

});

module.exports = router;
