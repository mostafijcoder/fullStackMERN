var courses = [
    {
    title: "Event Driven Cakes",
    cost: 50
    },
    {
    title: "Asynchronous Artichoke",
    cost: 25
    },
    {
    title: "Object Oriented Orange Juice",
    cost: 10
    }
   ];

exports.showCourses = (req, res) => {
    res.render("courses", { title: "Courses", courses: courses, showNotification: true, offeredCourses: courses
    });
   };

exports.postedSignUpForm = (req, res) => {
    res.render("thanks", { title: "Thank You", showNotification: true });
   };



exports.sendReqParam = (req, res) => {
    let vegetable = req.params.vegetable;
    res.send(`This is the page for ${vegetable}`);
};
// Rendering a view from a controller action in homeController.js

exports.respondWithName = (req, res) => {
    let paramsName = req.params.myName;
    res.render("index", { name: paramsName, title: "User Page" }); // Pass title
};

exports.homePage = (req, res) => {
    res.render("index", { title: "Home Page", name: "Guest", showNotification: true });
};

exports.respondWithName = (req, res) => {
    let paramsName = req.params.myName;
    res.render("index", { title: `Hello, ${paramsName}`, name: paramsName, showNotification: true });
};

