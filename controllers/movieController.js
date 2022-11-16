const Movie = require('../models/movie');
const Genre = require('../models/genre');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.movie_list = function (req, res, next) {
  Movie.find().exec((err, movies) => {
    if (err) {
      return next(err);
    }
    res.render('movie_list', { title: 'Movie List', movies });
  });
};

exports.movie_detail = function (req, res, next) {
  Movie.findById(req.params.id)
    .populate('genre')
    .exec((err, movie) => {
      if (err) {
        return next(err);
      }
      if (!movie) {
        const err = new Error('Movie not found');
        err.status = 404;
        return next(err);
      }
      res.render('movie_detail', {
        title: movie.title,
        movie,
      });
    });
};

exports.movie_create_get = function (req, res, next) {
  Genre.find().exec((err, genres) => {
    if (err) {
      return next(err);
    }
    res.render('movie_form', { title: 'Add a New Movie', genres });
  });
};

exports.movie_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
    }
    next();
  },
  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
  body(
    'rating',
    'Rating must not be empty and can be any value between 1 and 10.'
  )
    .trim()
    .isLength({ min: 1 })
    .toFloat()
    .isFloat({ min: 1, max: 10 }),
  body('director', 'Director must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('year', 'Year must not be empty and a greater value than 1850')
    .trim()
    .isLength({ min: 1 })
    .toFloat()
    .isFloat({ min: 1850 }),
  body('synopsis', 'Synopsis must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('img').optional({ checkFalsy: true }).trim(),
  body('genre.*').escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const movie = new Movie({
      title: req.body.title,
      rating: req.body.rating,
      director: req.body.director,
      year: req.body.year,
      synopsis: req.body.synopsis,
      img:
        req.body.img === 'undefined'
          ? 'https://i.postimg.cc/sXWsQTrR/no-image.png'
          : req.body.img,
      genre: req.body.genre,
    });
    if (!errors.isEmpty()) {
      Genre.find().exec((err, genres) => {
        if (err) {
          return next(err);
        }
        for (const genre of genres) {
          if (movie.genre.includes(genre._id)) {
            genre.checked = true;
          }
        }
        res.render('movie_form', {
          title: 'Add a New Movie',
          genres,
          movie,
          errors: errors.array(),
        });
      });
      return;
    }
    movie.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(movie.url);
    });
  },
];

exports.movie_delete_get = function (req, res, next) {
  Movie.findById(req.params.id).exec((err, movie) => {
    if (err) {
      return next(err);
    }
    if (!movie) {
      const err = new Error('Movie not found');
      err.status = 404;
      return next(err);
    }
    res.render('movie_delete', {
      title: movie.title,
      movie,
    });
  });
};
exports.movie_delete_post = function (req, res, next) {
  Movie.findById(req.body.movieid).exec((err, movie) => {
    if (err) {
      return next(err);
    }
    if (!movie) {
      const err = new Error('Movie not found');
      err.status = 404;
      return next(err);
    }
    Movie.findByIdAndRemove(req.body.movieid, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/movie/movie_list');
    });
  });
};

exports.movie_update_get = function (req, res, next) {
  async.parallel(
    {
      movie(callback) {
        Movie.findById(req.params.id).exec(callback);
      },
      genres(callback) {
        Genre.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (!results.movie) {
        const err = new Error('Movie not found!');
        err.status = 404;
        return next(err);
      }
      for (const genre of results.genres) {
        if (results.movie.genre.includes(genre._id)) {
          genre.checked = true;
        }
      }
      res.render('movie_form', {
        title: 'Update Movie',
        movie: results.movie,
        genres: results.genres,
      });
    }
  );
};

exports.movie_update_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
    }
    next();
  },
  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
  body(
    'rating',
    'Rating must not be empty and can be any value between 1 and 10.'
  )
    .trim()
    .isLength({ min: 1 })
    .toFloat()
    .isFloat({ min: 1, max: 10 }),
  body('director', 'Director must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('year', 'Year must not be empty and a greater value than 1850')
    .trim()
    .isLength({ min: 1 })
    .toFloat()
    .isFloat({ min: 1850 }),
  body('synopsis', 'Synopsis must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('img').optional({ checkFalsy: true }).trim(),
  body('genre.*').escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const movie = new Movie({
      title: req.body.title,
      rating: req.body.rating,
      director: req.body.director,
      year: req.body.year,
      synopsis: req.body.synopsis,
      img:
        req.body.img === ''
          ? 'https://i.postimg.cc/sXWsQTrR/no-image.png'
          : req.body.img,
      genre: req.body.genre,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      Genre.find().exec((err, genres) => {
        if (err) {
          return next(err);
        }
        for (const genre of genres) {
          if (movie_img.genre.includes(genre._id)) {
            genre.checked = true;
          }
        }
        res.render('movie_form', {
          title: 'Update Movie',
          movie,
          genres,
          errors: errors.array(),
        });
      });
      return;
    }
    Movie.findByIdAndUpdate(req.params.id, movie, {}, (err, themovie) => {
      if (err) {
        return next(err);
      }
      res.redirect(themovie.url);
    });
  },
];
