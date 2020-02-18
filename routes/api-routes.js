// api-routes.js - mongoose CRUD for the googlebooks database

// Dependencies
// const mongoose = require("mongoose");
// const mongojs = require("mongojs");
const db = require("../models/books");
const debug = false;

// Routes
module.exports = function(app) {

  function fulfillment(err,data,res) {
    if (err) {
      if (debug) {console.log(err);}
      res.json(err);
    } else {
      if (debug) {console.log(data);}
      res.json(data);
    }
  }

  // CREATE a new book document
  app.post("/api/create", (req, res) => {
    if (debug) {console.log('received request to create new DB document');}
    const newBook = {
      added       : Date.now(),
      googleId    : req.body.googleId,
      title       : req.body.title,
      subtitle    : req.body.subtitle,
      authors     : req.body.authors,
      published   : req.body.published,
      imageUrl    : req.body.imageUrl,
      altUrl      : req.body.altUrl,
      description : req.body.description,
      viewDetails : req.body.viewDetails
    };
    if (debug) {console.log(`Post to /api/create: ${JSON.stringify(newBook)}`);}
    db.Books.
      create(newBook, (err, data) => {
        fulfillment(err,data,res);
      });
  });

  // READ all books
  app.get("/api/read", (req, res) => {
    if (debug) {console.log(`Get all books`);}
    db.Books.
      find().
      sort({ title: 1 }).
      exec( (err, data) => {
        fulfillment(err,data,res);
      });
  });

  // DELETE one book
  app.get("/api/delete/:id", (req,res) => {
    if (debug) {console.log(`Request to delete googleId ${req.params.id}`);}  
    db.Books.
      deleteOne({googleId : req.params.id}).
      exec( (err, data) => {
        fulfillment(err,data,res);
    });
  });

}