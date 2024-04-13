const db = require("../database/models");
const sequelize = db.sequelize;
// const { validationResult } = require('express-validator');
//Otra forma de llamar a los modelos
const Movies = db.Movie;
// const Genre = db.Genre;

const moviesController = {
  list: (req, res) => {
    db.Movie.findAll().then((movies) => {
      res.render("moviesList.ejs", { movies });
    });
  },
  detail: (req, res) => {
    db.Movie.findByPk(req.params.id).then((movie) => {
      res.render("moviesDetail.ejs", { movie });
    });
  },
  new: (req, res) => {
    db.Movie.findAll({
      order: [["release_date", "DESC"]],
      limit: 5,
    }).then((movies) => {
      res.render("newestMovies", { movies });
    });
  },
  recomended: (req, res) => {
    db.Movie.findAll({
      where: {
        rating: { [db.Sequelize.Op.gte]: 8 },
      },
      order: [["rating", "DESC"]],
    }).then((movies) => {
      res.render("recommendedMovies.ejs", { movies });
    });
  }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
  add: function (req, res) {
    res.render("moviesAdd.ejs");
  },
  create: function (req, res) {
    const { title, rating, awards, release_date, length } = req.body;
    const formatted_release_date = new Date(release_date);

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.render("moviesAdd.ejs", {
    //         title: "Agregar Película",
    //         errors: errors.mapped(),
    //         oldData: req.body,
    //     });
    // }

    Movies.create({
      title: title,
      rating: +rating,
      awards: +awards,
      release_date: formatted_release_date,
      length: +length,
    })
      .then((createdMovie) => {
        res.redirect("/movies");
      })
      .catch((errorCreate) => {
        console.log(errorCreate);
        res.render("moviesAdd.ejs", {
          title: "Agregar Película",
          errorMessage:
            "Error al crear la película. Por favor, inténtelo de nuevo.",
          oldData: req.body,
        });
      });
  },

  edit: function (req, res) {
    const { id } = req.params;
    Movies.findByPk(id)
      .then((movie) => {
        res.render("moviesEdit.ejs", { movie }); // Aquí debería ser { movie } en lugar de {movies}
      })
      .catch((error) => {
        console.log(error);
        res.send("Error al cargar la película para editar");
      });
  },


  update: function (req, res) {
    const { id } = req.params;
    const { title, rating, awards, release_date, length } = req.body;
    const formatted_release_date = new Date(release_date);

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.render("moviesEdit.ejs", {
    //         title: "Editar Película",
    //         errors: errors.mapped(),
    //         oldData: req.body,
    //     });
    // }

    Movies.update(
      {
        title: title,
        rating: +rating,
        awards: +awards,
        release_date: formatted_release_date,
        length: +length,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then(() => {
        res.redirect("/movies");
      })
      .catch((errorUpdate) => {
        console.log(errorUpdate);
        res.send("Error al actualizar la película");
      });
  },
  delete: function (req, res) {
    const { id } = req.params;
    Movies.findByPk(id)
      .then((movie) => {
        res.render("moviesDetail.ejs", { movie });
      })
      .catch((error) => {
        console.log(error);
        res.send("Error al cargar la película para eliminar");
      });
  },
  
  destroy: function(req, res) {
    const { id } = req.params;
    Movies.destroy({
        where: {
            id: id
        }
    })
    .then(movies => {
        res.redirect('/movies');
    })
    .catch(error => {
        console.log(error);
    });
},


};

module.exports = moviesController;
