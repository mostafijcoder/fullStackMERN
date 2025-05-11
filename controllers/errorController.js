const httpStatus = require("http-status-codes");
exports.respondNoResourceFound = (req, res) => {
    let errorCode = httpStatus.NOT_FOUND;
    res.status(errorCode);
    res.sendFile(`./public/html/${errorCode}.html`, {
    root: "./"
    });
   };
exports.respondInternalError = (error, req, res, next) => {
 let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
 console.log(`ERROR occurred: ${error.stack}`)
 res.status(errorCode);
 res.send(`${errorCode} | Sorry, our application is 
➥experiencing a problem!`);
};
exports.errorJSON = (error, req, res, next) => {
    let errorObject;
    if (error) {
      errorObject = {
        status: 500,
        message: error.message
      };
    } else {
      errorObject = {
        status: 500,
        message: "Unknown Error"
      };
    }
  
    res.json(errorObject);
  };
  