var finalhandler = require('finalhandler')
var http         = require('http')
var Router       = require('router')

var json         = require('../lib/')

var router = Router()
router.use(json());

router.get('/', function (req, res) {
  res.json({ message: 'Hello World!' });
});

router.get('/jsonp', function (req, res) {
  res.jsonp({ message: 'Goodbye!' });
});

var server = http.createServer(function(req, res) {
  router(req, res, finalhandler(req, res));
});

server.listen(3000, function() {
  console.log('Server running on port 3000');
})
