var express = require('express');
var router = express.Router();
const Movie = require('../models/movie');
const async = require('async');

/* GET home page. */
router.get('/', function (req, res, next) {
  async.parallel(
    {
      latest_movies(callback) {
        Movie.find().sort({ _id: -1 }).limit(4).exec(callback);
      },
      best_movies(callback) {
        Movie.find().sort({ rating: -1 }).limit(4).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('index', {
        latest_movies: results.latest_movies,
        best_movies: results.best_movies,
      });
    }
  );
});

module.exports = router;
