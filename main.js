const port=3011;
const express = require('express');
const app = express();

app.use((req, res, next) => {
    console.log(`request made to: ${req.url}`);
    next();
   });
   
app.get('/items/:vegetable', (req, res) => {
    let veg = req.params.vegetable;
    res.send(`This is the page for ${veg}`);
    }
)
.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    }
);