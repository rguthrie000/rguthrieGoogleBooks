// Server for MERN app.  
// Responsible for implementing Mongoose/MongoDB CRUD with
// corresponding db API routes served by express.

// Set up mongoose/mongoDB
const mongoose = require("mongoose");
const db = require("./models");

// Configure Express
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// When deployed, identify home for client assets
// (during development, server and client are on the
// same machine; the react client app will load the
// client side)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("./client/build"));
}

// API routes
require("./routes/api-routes.js")(app);
// For any other route request, send the main page.
const path = require('path');
app.get("*", (req, res) => {
  res.sendFile(path.dirname("./client/build/index.html"));
});

// Be the Server
const PORT = process.env.PORT ? process.env.PORT : 3001;
app.listen(PORT, () => {console.log(`Serving clients on ${PORT}`);});
