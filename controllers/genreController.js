const Movie = require('../models/movie');
const Genre = require('../models/genre');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.genre_list = function (req, res, next) {
  Genre.find().exec((err, genres) => {
    if (err) {
      return next(err);
    }
    res.render('genre_list', {
      genres,
    });
  });
};

exports.genre_movie_list = function (req, res, next) {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      movies(callback) {
        Movie.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (!results.genre) {
        const err = new Error('Genre not found!');
        err.status = 404;
        return next(err);
      }
      res.render('genre_detail', {
        title: results.genre.name,
        genre: results.genre,
        genre_movies: results.movies,
      });
    }
  );
};

exports.genre_create_get = function (req, res, next) {
  res.render('genre_form', {
    title: 'Add Genre',
  });
};

exports.genre_create_post = [
  body('name', 'Name must not be empty').trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    let errors = validationResult(req);
    let genre = new Genre({ name: req.body.name });
    if (!errors.isEmpty()) {
      res.render('genre_form', {
        title: 'Add Genre',
        genre,
        errors: errors.array(),
      });
      return;
    }
    genre.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(genre.url);
    });
  },
];

exports.genre_delete_get = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_movies(callback) {
        Movie.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (!results.genre) {
        const error = new Error('Genre not found!');
        error.status = 404;
        return next(error);
      }
      res.render('genre_delete', {
        genre: results.genre,
        genre_movies: results.genre_movies,
      });
    }
  );
};

exports.genre_delete_post = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.body.genreid).exec(callback);
      },
      genre_movies(callback) {
        Movie.find({ genre: req.body.genreid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (!results.genre) {
        const err = new Error('Genre not found!');
        err.status = 404;
        return next(err);
      }
      if (results.genre_movies.length > 0) {
        res.render('genre_delete', {
          genre: results.genre,
          genre_movies: results.genre_movies,
        });
      }
      Genre.findByIdAndRemove(req.body.genreid, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/genre/genre_list');
      });
    }
  );
};

exports.genre_update_get = function (req, res, next) {
  Genre.findById(req.params.id).exec((err, genre) => {
    if (err) {
      return next(err);
    }
    res.render('genre_form', {
      title: 'Update Genre',
      genre,
    });
  });
};

exports.genre_update_post = [
  body('name', 'Name must not be empty').trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    let errors = validationResult(req);
    let genre = new Genre({ name: req.body.name, _id: req.params.id });
    if (!errors.isEmpty()) {
      res.render('genre_form', {
        title: 'Update Genre',
        genre,
        errors: errors.array(),
      });
    }
    Genre.findByIdAndUpdate(req.params.id, genre, {}, (err, thegenre) => {
      if (err) {
        return next(err);
      }
      res.redirect(thegenre.url);
    });
  },
];
