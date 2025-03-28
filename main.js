const express = require("express");
const homeController = require("./controllers/homeController"); // Corrected file name
const app = express();
const layouts = require("express-ejs-layouts");
app.use(layouts);

const port = process.env.PORT || 3011;

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("layout", "layout"); // Set the default layout file to views/layout.ejs
/*
// Middleware to parse URL-encoded and JSON data
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); */

// Serve static files from the public directory
app.use(express.static("public"));

// Log each request to the console
app.use((req, res, next) => {
    console.log(`Request made to: ${req.url}`);
    next();
});

// Route for homepage
app.get("/", homeController.homePage);

app.get("/", (req, res) => {
    res.render("index", { title: "Home", showNotification: true });
});

app.get("/contact", (req, res) => {
    res.render("contact", { title: "Contact Us", showNotification: true });
});

// Form submission handling
app.post("/contact", (req, res) => {
    console.log(req.body); // Handle form data (save to DB, send email, etc.)
    res.send("Thank you for contacting us!");
});

// Route to render index.ejs
app.get("/", (req, res) => {
    res.render("index"); // Render index.ejs from the views folder
});

// Example route with parameter handling
app.get("/items/:vegetable", homeController.sendReqParam);

// Route to render a view with a parameter

app.get("/name/:myName", homeController.respondWithName);


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
