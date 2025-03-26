const homeController = require("./controllers/homeControllers");
const port=3011;
const express = require('express');
const app = express();

    app.use(
    express.urlencoded({
    extended: false
    })
   ); 
   app.use(express.json());
   
    app.use((req, res, next) => {
    console.log(`request made to: ${req.url}`);
    next();
   });
   app.post("/", (req, res) => {
    console.log(req.body);
    console.log(req.query);
    res.send("POST Successful!");
   });
   // get the posted data
    app.get("/", (req, res) => {
    console.log(req.body);
    console.log(req.url);
    console.log(req.query);
    res.send("GET Successful!");
    }
    );

    app.get("/items/:vegetable", homeController.sendReqParam);
    app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    }
);