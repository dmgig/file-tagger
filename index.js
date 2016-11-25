var express = require('express')
var app = module.exports = express();
var mustacheExpress = require('mustache-express');

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', './views');

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.get('/users/:id', function (req, res) {
  res.send(req.params)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})