
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  list = require('./routes/lists');

var sass = require('node-sass'),
  sass.render(scss_content, callback [, options]);

var app = module.exports = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
  app.use(sass.middleware({
    src: __dirname + '/sass', //where the sass files are 
    dest: __dirname + '/public', //where css should go
    debug: true // obvious
  }));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API

app.get('/api/name', api.name);

app.get('/lists', list.findAll);
app.get('/lists/:id', list.findById);
app.post('/lists', list.addList);
app.put('/lists/:id', list.updateList);
app.delete('/lists/:id', list.deleteList);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(4000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
