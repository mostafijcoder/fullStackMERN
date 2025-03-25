const httpStatus = require("http-status-codes");
const contentTypes = require("./contentTypes");
const utils = require("./utils");

const routes = {
    "GET": {},
    "POST": {}
};

exports.handle = (req, res) => {
    try {
        if (routes[req.method][req.url]) {
            routes[req.method][req.url](req, res);
        } else {
            res.writeHead(httpStatus.NOT_FOUND, contentTypes.html);
            utils.getFile("views/error.html", res);
        }
    } catch (e) {
        console.error("Internal Server Error:", e);
        res.writeHead(httpStatus.INTERNAL_SERVER_ERROR, contentTypes.html);
        res.end("<h1>500 Internal Server Error</h1>");
    }
};

// Register GET route
exports.get = (url, action) => {
    routes["GET"][url] = action;
};

// Register POST route
exports.post = (url, action) => {
    routes["POST"][url] = action;
};
