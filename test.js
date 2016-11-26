var express         = require('express')
var app             = module.exports = express();
var mustacheExpress = require('mustache-express');
var path            = require('path');
var fs              = require('fs');

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', './views');

app.use(errorHandler);

function errorHandler(err, req, res, next) {

  // XHR Request?
  if (req.xhr) {
      logger.error(err);
      res.status(500).send({ error: 'Internal Error Occured.' });
      return;
  }

  // Not a XHR Request.
  logger.error(err);
  res.status(500);
  res.render('framework/error', { error: "Internal Server Error." });

  // Note: No need to call next() as the buck stops here.
  return;
}

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

// more routes for our API will happen here

// on routes that end in /bears
// ----------------------------------------------------

var File = require('./models/file');

router.route('/files')

    // create a file (accessed at POST http://localhost:8080/api/files)
    .post(function(req, res) {
        
        var file = new File();      // create a new instance of the Bear model
        file.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        file.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'File created!' });
        });

    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        File.find(function(err, files) {
            if (err)
                res.send(err);

            res.json(files);
        });
    });


// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/files/:id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        File.findById(req.params.id, function(err, file) {
            if (err)
                res.send(err);
            res.json(file);
        });
    })
    
    // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
    .put(function(req, res) {

        // use our bear model to find the bear we want
        File.findById(req.params.id, function(err, file) {

            if (err)
                res.send(err);

            file.name = req.body.name;  // update the bears info

            // save the bear
            file.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'File updated!' });
            });

        });
    })
    
    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function(req, res) {
        File.remove({
            _id: req.params.id
        }, function(err, file) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

app.use('/api', router);
