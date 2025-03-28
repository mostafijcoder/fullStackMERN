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
