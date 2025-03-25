
var express = require('express');
var bodyParser= require('body-parser');

// an inmemory database
var items = [];
// create a router
var router = express.Router();
router.use(bodyParser());

//setup collection routes

router.route('/')
    .get(function(req, res,next){
        res.send ({
            status: 'items found',
            items: items
        })
    })
    .post(function(req, res, next){
        items.push(req.body);
        res.send({
            status: 'item added',
            item: req.body,
            itemID: items.length-1
        })
    })
    .put(function(req, res, next){
        items = req.body;
        res.send({
            status: 'items replaced',
            items: items,
            itemsID: items.length-1
        })
    })
    .delete(function(req, res, next){
        items = [];
        res.send({
            status: 'items cleared',
            items: items,
            itemID: items.length-1
        })
    })


    // setup item routes
    router.route('/:id')
        .get(function(req, res, next){
            var id = req.params['id'];
            if (id && items[Number(id)]){
                res.send({
                    status: 'item found',
                    item: items[Number(id)]
                })
            } else {
                res.send({
                    status: 'item not found'
                })
            }
        })
        .post(function(req, res, next){
            var id = req.params.id;
            items[id] = req.body;
            res.send({
                status: 'item updated',
                item: items[id],
                itemID: id
            })
        })
        .put(function(req, res, next){
            var id = req.params.id;
            items[id] = req.body;
            res.send({
                status: 'item replaced',
                item: items[id],
                itemID: id
            })
        }
        )
        .delete(function(req, res, next){
            var id = req.params.id;
            items.splice(id, 1);
            res.send({
                status: 'item deleted',
                itemID: id
            })
        })
        .all(function(req, res, next){
            res.send({
                status: 'operation not supported'
            })
        }
        )
// use the router
var app = express()
.use ('/items', router)
.listen(3014, function(){
    console.log('server running on port 3014');
}
);









/*
In fact, by using the app.param function, you can register a middleware to load the relevant information for you. The app.param middleware function is called whenever a parameter name matches in a route and is also passed in the parameter value as a fourth argument. 

You can see that the param function is called if a route with 
the specified param matches before any other middleware gets a whack at it. This allows you to create a reusable parameter loading middleware

*/