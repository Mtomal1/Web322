/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: MD Rasheduzzaman Khan Tomal ID:112315221 
*
*
********************************************************************************/

// Importing required modules
const express = require("express");
const legoData = require("./modules/legoSets");

// Create an Express application instance
const app = express();
const PORT = 8080;

// Serve static files from the "public" directory
app.use(express.static("public"));

// Define route for the home page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/view/home.html");
});

// Define route for retrieving LEGO sets
app.get("/lego/sets", (req, res) => {
  // Check if a theme is provided in the query parameters
  const theme = req.query.theme;
  if (theme) {
    // Retrieve LEGO sets filtered by theme
    legoData
      .getSetsByTheme(theme)
      .then((sets) => res.json(sets))
      .catch((error) => res.status(404).json({ error: error.message }));
  } else {
    // Retrieve all LEGO sets
    legoData
      .getAllSets()
      .then((sets) => res.json(sets))
      .catch((error) => res.status(404).json({ error: error.message }));
  }
});

// Define route for retrieving a specific LEGO set by set number
app.get("/lego/sets/:set_num", (req, res) => {
  const set_num = req.params.set_num;
  legoData
    .getSetByNum(set_num)
    .then((set) => res.json(set))
    .catch((error) => res.status(404).json({ error: error.message }));
});

// Define route for a demo of retrieving a specific LEGO set by set number
app.get("/lego/sets/num-demo", (req, res) => {
  legoData
    .getSetByNum("001-1")
    .then((set) => res.json(set))
    .catch((error) => res.status(404).json({ error: error.message }));
});

// Define route for the "about" page
app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/view/about.html");
});

// Handle 404 errors by serving a custom 404 page
app.use((req, res) => {
  res.status(404).sendFile(__dirname + "/view/404.html");
});

// Initialize LEGO data and start the server on the specified port
legoData
  .initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("Error initializing Lego data:", error));
