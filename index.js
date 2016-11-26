// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var fs         = require('fs');
const md5File  = require('md5-file')

// configure app
app.use(morgan('dev')); // log requests to the console

app.use(express.static('node_modules'))
app.use(express.static('/Volumes/EXTERNAL-DRIVE'))

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/file-tagger'); // connect to our database
var File     = require('./models/file');

// INDEX

app.get('/', function(req,res) {
  res.sendfile('index.html');
});


// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// on routes that end in /Files
// ----------------------------------------------------
router.route('/files')

	// create a File (accessed at POST http://localhost:8080/Files)
	.post(function(req, res) {
		
		var file = new File();		// create a new instance of the File model
		file.name = req.body.name;  // set the Files name (comes from the request)

		file.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'File created!' });
		});

		
	})

	// get all the Files (accessed at GET http://localhost:8080/api/Files)
	.get(function(req, res) {
		File.find(function(err, files) {
			if (err)
				res.send(err);

			res.json(files);
		});
	});

// on routes that end in /Files/:File_id
// ----------------------------------------------------
router.route('/files/:id')

	// get the File with that id
	.get(function(req, res) {
		File.findById(req.params.id, function(err, file) {
			if (err)
				res.send(err);
			res.json(File);
		});
	})

	// update the File with this id
	.put(function(req, res) {
		File.findById(req.params.id, function(err, file) {

			if (err)
				res.send(err);

			file.name = req.body.name;
			file.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'File updated!' });
			});

		});
	})

	// delete the File with this id
	.delete(function(req, res) {
		File.remove({
			_id: req.params.id
		}, function(err, File) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

// on routes that end in /Files
// ----------------------------------------------------
router.route('/filelist')

	// create a File (accessed at POST http://localhost:8080/Files)
	.get(function(req, res) {
		
    const filesDir = '/Volumes/EXTERNAL-DRIVE/UNSORTED';
    var filelist = [];
    fs.readdir(filesDir, (err, files) => {
      files.forEach(file => {
        //var hash = md5File.sync(filesDir+'/'+file);
        var hash;
        filelist.push({ file: file, path: 'UNSORTED/'+file, hash: hash });
      });
      res.json(filelist);
    })
	});

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);