const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  title: { type: String, maxLength: 100, required: true },
  rating: { type: Number, min: 1, max: 10, required: true },
  director: { type: String, maxLength: 100, required: true },
  year: { type: Number, min: 1850, required: true },
  synopsis: { type: String, required: true },
  img: { type: String, default: 'https://i.postimg.cc/sXWsQTrR/no-image.png' },
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre', required: true }],
});

MovieSchema.virtual('url').get(function () {
  return `/movie/${this._id}`;
});

module.exports = mongoose.model('Movie', MovieSchema);
