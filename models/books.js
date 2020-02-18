// Fitness Tracker - mongoose db and models
const mongoose = require("mongoose");

//*******************************
//***   Database Connection   ***
//*******************************

// set the db name here
const dbName = "googlebooks";

mongoose.connect(
  process.env.MONGODB_URI ? process.env.MONGODB_URI : ("mongodb://localhost/"+dbName), 
  {useNewUrlParser: true, useUnifiedTopology: true}
);

// Get the connection
const db = mongoose.connection;
// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//****************************
//***   Model Definition   ***
//****************************

const BookSchema = new mongoose.Schema({
  added         : {type: Date},
  googleId      : {type: String},
  title         : {type: String},
  subtitle      : {type: String},
  authors       : {type: []},
  published     : {type: Number, min: 800, max: 2025},
  imageUrl      : {type: String},
  description   : {type: String},
  viewDetails   : Boolean
});

//**************************
//***   Model Creation   ***
//**************************

const Books  = mongoose.model("Books" , BookSchema );

// And let the model be known!
exports.Books  = Books;