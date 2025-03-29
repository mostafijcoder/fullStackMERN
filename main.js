const express = require("express");
const homeController = require("./controllers/homeController"); // Corrected file name
const errorController = require("./controllers/errorController");
const Subscriber = require("./models/subscriber")
const app = express();
const layouts = require("express-ejs-layouts");
app.use(layouts);

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/receipe_mongodb", {
    useUnifiedTopology: true, // ✅ No need for `useNewUrlParser`
})
.then(() => console.log("✅ Successfully connected to MongoDB!"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const db = mongoose.connection;

const createSubscribers = async () => {
    try {
        const subscriber1 = new Subscriber({
            name: "Jon Wexler",
            email: "jon@jonwexler.com"
        });

        const savedSubscriber = await subscriber1.save(); // ✅ Use await
        console.log("✅ Saved Subscriber:", savedSubscriber);

        const subscriber2 = await Subscriber.create({
            name: "Jane Doe",
            email: "jane@example.com"
        });

        console.log("✅ Created Subscriber:", subscriber2);
    } catch (error) {
        console.error("❌ Error creating subscriber:", error);
    }
};

createSubscribers();

const findWexler=Subscriber.findOne({ name: "Jon Wexler" })
    .where("email", /wexler/)
    .then(data => {
        if (data) console.log("✅ Found Subscriber:", data.name);
        else console.log("❌ No Subscriber found.");
    })
    .catch(error => console.error("Error fetching subscriber:", error));




const port = process.env.PORT || 3011;

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("layout", "layout"); // Set the default layout file to views/layout.ejs
/*
// Middleware to parse URL-encoded and JSON data
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 
*/
// Log each request to the console
app.use((req, res, next) => {
    console.log(`Request made to: ${req.url}`);
    next();
});

app.get("/courses", homeController.showCourses);

app.post("/contact", homeController.postedSignUpForm);

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
// Serve static files from the public directory
app.use(express.static("public"));
// ✅ Handle 404 Errors
app.use((req, res) => {
    res.status(404).render("404", { title: "Page Not Found", showNotification: true });
});

// ✅ Handle 500 Errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("500", { title: "Server Error", showNotification: true });
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
