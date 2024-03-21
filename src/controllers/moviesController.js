const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
      Genres.findAll()
          .then(allGenres => {
              res.render("moviesAdd.ejs", { allGenres: allGenres });
          })
          .catch(error => {
              console.log(error);
          });
      },
      create: function (req, res) {
        // Obtener los datos del formulario
        const { title, rating, awards, release_date, length, genre_id } = req.body;
    
        // Crear la nueva película en la base de datos
        Movies.create({
            title: title,
            rating: rating,
            awards: awards,
            release_date: release_date,
            length: length,
            genre_id: genre_id
        })
        .then(newMovie => {
            // Redirigir al listado de películas después de crear la nueva película
            res.redirect('/movies');
        })
        .catch(error => {
            // Manejar errores si ocurrieron durante la creación de la película
            console.log(error);
            res.send("Error occurred while creating the movie");
        });
    },
    
    edit: function (req, res) {
        const movieId = req.params.id;
    
        Movies.findByPk(movieId, {
            include: [{ model: db.Genre, as: 'genre' }]
        })
        .then(movie => {
            if (movie) {
                // Aquí obtén los géneros disponibles
                Genres.findAll()
                .then(genres => {
                    res.render('moviesEdit.ejs', { movie, allGenres: genres });
                })
                .catch(error => {
                    console.log(error);
                    res.send("Error occurred while fetching genres");
                });
            } else {
                res.redirect('/movies');
            }
        })
        .catch(error => {
            console.log(error);
            res.send("Error occurred while fetching movie details");
        });
    },    
    update: function (req, res) {
        const movieId = req.params.id;
        const updatedMovie = req.body;
    
        Movies.update(updatedMovie, {
            where: {
                id: movieId
            }
        })
        .then(result => {
            if (result[0]) {
                res.redirect('/movies');
            } else {
                res.send("Movie not found or no changes were made.");
            }
        })
        .catch(error => {
            console.log(error);
            res.send("Error occurred while updating the movie.");
        });
    },
    delete: function (req, res) {
        const movieId = req.params.id;
    
        Movies.findByPk(movieId)
            .then(movie => {
                if (movie) {
                    res.render('moviesDelete.ejs', { movie });
                } else {
                    res.redirect('/movies');
                }
            })
            .catch(error => {
                console.log(error);
                res.send("Error occurred while fetching movie details");
            });
    },
    
    destroy: function (req, res) {
        const movieId = req.params.id;
    
        Movies.destroy({
            where: {
                id: movieId
            }
        })
            .then(() => {
                res.redirect('/movies');
            })
            .catch(error => {
                console.log(error);
                res.send("Error occurred while deleting movie");
            });
    },
    
    
};

module.exports = moviesController;