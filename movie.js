const express = require('express');
const bodyParser = require('body-parser');

class Movie {
    constructor(id, title, genre) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.available = true;
    }
}

class MovieStore {
    constructor() {
        this.movies = [
            new Movie(1, "Inception", "Sci-Fi"),
            new Movie(2, "The Shawshank Redemption", "Drama"),
            new Movie(3, "The Dark Knight", "Action"),
        ];

        this.rentedMovies = [];
    }

    getMovies() {
        return this.movies;
    }

    rentMovie(movieId) {
        const movie = this.movies.find(movie => movie.id === movieId);

        if (movie && movie.available) {
            movie.available = false;
            this.rentedMovies.push(movie);
            return { message: `Movie '${movie.title}' rented successfully.` };
        } else {
            return { error: "Movie not available or does not exist." };
        }
    }

    returnMovie(movieId) {
        const rentedMovieIndex = this.rentedMovies.findIndex(movie => movie.id === movieId);

        if (rentedMovieIndex !== -1) {
            const movie = this.rentedMovies.splice(rentedMovieIndex, 1)[0];
            movie.available = true;
            return { message: `Movie '${movie.title}' returned successfully.` };
        } else {
            return { error: "Movie not found or not rented." };
        }
    }
}

const app = express();
const port = 3000;

app.use(bodyParser.json());

const movieStore = new MovieStore();

app.get('/movies', (req, res) => {
    res.json({ movies: movieStore.getMovies() });
});

app.post('/rent', (req, res) => {
    const { movieId } = req.body;

    if (!movieId) {
        return res.status(400).json({ error: "Please provide a movieId." });
    }

    const result = movieStore.rentMovie(movieId);
    res.json(result);
});

app.post('/return', (req, res) => {
    const { movieId } = req.body;

    if (!movieId) {
        return res.status(400).json({ error: "Please provide a movieId." });
    }

    const result = movieStore.returnMovie(movieId);
    res.json(result);
});

app.listen(port, () => {
    console.log(`Movie renting API listening at http://localhost:${port}`);
});
