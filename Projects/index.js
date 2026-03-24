/**
 * Exercise 9.3 — Hybrid: Reference with Population (Intermediate)
 * Genre + Movie (ref); GET movies with genre populated; filter by genre id; validate genre ObjectId.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');

function getMongoUri() {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DB_NAME } = process.env;
  if (MONGODB_USER && MONGODB_PASSWORD && MONGODB_HOST) {
    const db = MONGODB_DB_NAME || 'genreDB';
    return `mongodb+srv://${MONGODB_USER}:${encodeURIComponent(MONGODB_PASSWORD)}@${MONGODB_HOST}/${db}?retryWrites=true&w=majority`;
  }
  return process.env.MONGODB_URI || 'mongodb://localhost:27017/exercise93';
}

// 1. Genre model
const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
});
const Genre = mongoose.model('Genre', genreSchema);

// 2. Movie model: title, genre (ref Genre), year
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true },
  year: { type: Number, required: true },
});
const Movie = mongoose.model('Movie', movieSchema);

// 5. Validate genre is a valid ObjectId (24-char hex)
function isValidObjectId(id) {
  return id && /^[a-f0-9]{24}$/i.test(id);
}

const app = express();
app.use(express.json());

// 4. GET all movies with genre populated
app.get('/api/movies', async (req, res) => {
  try {
    const { genre: genreId } = req.query;
    let query = Movie.find();
    if (genreId) {
      if (!isValidObjectId(genreId)) {
        return res.status(400).json({ error: 'Invalid genre id.' });
      }
      query = query.where('genre').equals(genreId);
    }
    const movies = await query.populate('genre').lean();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET movies by genre id (same endpoint with ?genre=id)
// GET /api/genres/:genreId/movies — alternative route
app.get('/api/genres/:genreId/movies', async (req, res) => {
  try {
    const { genreId } = req.params;
    if (!isValidObjectId(genreId)) {
      return res.status(400).json({ error: 'Invalid genre id.' });
    }
    const movies = await Movie.find({ genre: genreId }).populate('genre').lean();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create movie — validate genre ObjectId
app.post('/api/movies', async (req, res) => {
  try {
    const { title, genre: genreId, year } = req.body ?? {};
    if (!isValidObjectId(genreId)) {
      return res.status(400).json({ error: 'Invalid or missing genre id.' });
    }
    const genreExists = await Genre.findById(genreId);
    if (!genreExists) {
      return res.status(400).json({ error: 'Genre not found.' });
    }
    const movie = await Movie.create({ title, genre: genreId, year });
    const populated = await Movie.findById(movie._id).populate('genre').lean();
    res.status(201).json(populated);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors || {}).map((e) => e.message);
      return res.status(400).json({ errors: errors.length ? errors : [err.message] });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Seed: create two genres and two movies (run once)
async function seed() {
  const count = await Genre.countDocuments();
  if (count > 0) return;
  const action = await Genre.create({ name: 'Action' });
  const comedy = await Genre.create({ name: 'Comedy' });
  await Movie.create([
    { title: 'Movie One', genre: action._id, year: 2020 },
    { title: 'Movie Two', genre: comedy._id, year: 2021 },
  ]);
  console.log('Seeded: 2 genres, 2 movies');
}

const port = process.env.PORT || 3000;
const uri = getMongoUri();

mongoose.connect(uri).then(async () => {
  await seed();
  app.listen(port, () => {
    console.log('Movies API: http://localhost:' + port + '/api/movies');
    console.log('  GET /api/movies           — all movies (genre populated)');
    console.log('  GET /api/movies?genre=id  — movies by genre id');
    console.log('  GET /api/genres/:id/movies — movies by genre id');
    console.log('  POST /api/movies          — create (body: title, genre, year)');
  });
}).catch((err) => {
  if (err.name === 'MongooseServerSelectionError' || err.cause?.code === 'ECONNREFUSED') {
    console.error('MongoDB is not running. Start MongoDB or set MONGODB_URI / env vars.');
  } else {
    console.error('Fatal error:', err);
  }
  process.exit(1);
});
