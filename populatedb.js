#! /usr/bin/env node

console.log('This script populates some genres and movies.');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Movie = require('./models/movie');
var Genre = require('./models/genre');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var genres = [];
var movies = [];

function movieCreate(title, rating, director, year, synopsis, img, genre, cb) {
  movieDetail = {
    title: title,
    rating: rating,
    director: director,
    year: year,
    synopsis: synopsis,
    img: img,
    genre: genre,
  };

  var movie = new Movie(movieDetail);

  movie.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Movie: ' + movie);
    movies.push(movie);
    cb(null, movie);
  });
}

function genreCreate(name, cb) {
  var genre = new Genre({ name: name });

  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre);
    cb(null, genre);
  });
}

function createGenres(cb) {
  async.series(
    [
      function (callback) {
        genreCreate('Fantasy', callback);
      },
      function (callback) {
        genreCreate('Science Fiction', callback);
      },
      function (callback) {
        genreCreate('Action', callback);
      },
      function (callback) {
        genreCreate('Horror', callback);
      },
      function (callback) {
        genreCreate('Drama', callback);
      },
      function (callback) {
        genreCreate('Thriller', callback);
      },
      function (callback) {
        genreCreate('Comedy', callback);
      },
      function (callback) {
        genreCreate('Romance', callback);
      },
      function (callback) {
        genreCreate('Adventure', callback);
      },
      function (callback) {
        genreCreate('Crime', callback);
      },
    ],
    // optional callback
    cb
  );
}

function createMovies(cb) {
  async.parallel(
    [
      function (callback) {
        movieCreate(
          'The Godfather',
          9.2,
          'Francis Ford Coppola',
          1972,
          'The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.',
          'https://i.postimg.cc/sgN9Ny13/thegodfather.jpg',
          [genres[0], genres[1]],
          callback
        );
      },
      function (callback) {
        movieCreate(
          'Pulp Fiction',
          8.9,
          'Quentin Tarantino',
          1994,
          'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
          'https://i.postimg.cc/t4kCqCFH/pulpfiction.jpg',
          [genres[9], genres[4]],
          callback
        );
      },
      function (callback) {
        movieCreate(
          'Toy Story',
          8.3,
          'John Lasseter',
          1995,
          "A cowboy doll is profoundly threatened and jealous when a new spaceman action figure supplants him as top toy in a boy's bedroom.",
          'https://i.postimg.cc/5tfYgRSf/toystory.jpg',
          [genres[8], genres[6]],
          callback
        );
      },
      function (callback) {
        movieCreate(
          'The Notebook',
          7.8,
          'Nick Cassavetes',
          2004,
          'A poor yet passionate young man (Ryan Gosling) falls in love with a rich young woman (Rachel McAdams), giving her a sense of freedom, but they are soon separated because of their social differences.',
          'https://i.postimg.cc/9QQzq7mf/thenotebook.jpg',
          [genres[4], genres[7]],
          callback
        );
      },
      function (callback) {
        movieCreate(
          'Eternal Sunshine of the Spotless Mind',
          8.3,
          'Michel Gondry',
          2004,
          'When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories for ever.',
          'https://i.postimg.cc/bJVfWZXm/eternalsunshine.jpg',
          [genres[4], genres[7], genres[1]],
          callback
        );
      },
      function (callback) {
        movieCreate(
          'Dracula',
          7.4,
          'Francis Ford Coppola',
          1992,
          "The centuries old vampire Count Dracula comes to England to seduce his barrister Jonathan Harker's fiancée Mina Murray and inflict havoc in the foreign land.",
          'https://i.postimg.cc/bv72fwQ9/dracula.jpg',
          [genres[4], genres[0], genres[3]],
          callback
        );
      },
      function (callback) {
        movieCreate(
          'The Silence of the Lambs',
          8.6,
          'Jonathan Demme',
          1991,
          'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.',
          'https://i.postimg.cc/wMpzpSfr/silenceofthelambs.jpg',
          [genres[9], genres[4], genres[5]],
          callback
        );
      },
      function (callback) {
        movieCreate(
          'Life of Pi',
          7.9,
          'Ang Lee',
          2012,
          'A young man who survives a disaster at sea is hurtled into an epic journey of adventure and discovery. While cast away, he forms an unexpected connection with another survivor: a fearsome Bengal tiger.',
          'https://i.postimg.cc/6QJYYtyF/lifeofpi.jpg',
          [genres[8], genres[0]],
          callback
        );
      },
      function (callback) {
        movieCreate(
          'The Matrix',
          8.7,
          'Lilly Wachowski',
          1999,
          'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
          'https://i.postimg.cc/KcP3CTJ9/matrix.jpg',
          [genres[2], genres[1]],
          callback
        );
      },
      function (callback) {
        movieCreate(
          'About Time',
          7.8,
          'Richard Curtis',
          2013,
          'At the age of 21, Tim discovers he can travel in time and change what happens and has happened in his own life. His decision to make his world a better place by getting a girlfriend turns out not to be as easy as you might think.',
          'https://i.postimg.cc/T160fXzB/abouttime.jpg',
          [genres[6], genres[4], genres[0]],
          callback
        );
      },
      function (callback) {
        movieCreate(
          'Constantine',
          7.0,
          'Francis Lawrence',
          2005,
          "Supernatural exorcist and demonologist John Constantine helps a policewoman prove her sister's death was not a suicide, but something more.",
          'https://i.postimg.cc/PfvbFNwJ/constantine.jpg',
          [genres[2], genres[0], genres[3]],
          callback
        );
      },
      function (callback) {
        movieCreate(
          'Forrest Gump',
          8.8,
          'Robert Zemeckis',
          1994,
          'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.',
          'https://i.postimg.cc/ZYvgFbYF/forrestgump.jpg',
          [genres[4], genres[7]],
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createGenres, createMovies],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
