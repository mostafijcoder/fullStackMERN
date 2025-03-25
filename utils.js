const fs = require("fs"),
  httpStatus = require("http-status-codes"),
  contentTypes = require("./contentTypes");

module.exports = {
  getFile: (filePath, res) => {
    fs.readFile(`./${filePath}`, (error, data) => {
      if (error) {
        console.error(`Error reading file: ${filePath}`, error); // Log the error
        if (!res.headersSent) {  // Prevent duplicate header errors
          res.writeHead(httpStatus.INTERNAL_SERVER_ERROR, contentTypes.html);
          res.end("There was an error serving content!");
        }
        return;  // Stop execution if there's an error
      }
      
      if (!res.headersSent) { // Ensure headers are not already sent
        res.writeHead(httpStatus.OK, contentTypes.html);
      }
      res.end(data);
    });
  }
};
