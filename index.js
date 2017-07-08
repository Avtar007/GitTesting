var express = require('express');
var app = express();
var master = require('./master');
var bodyparser = require('body-parser');
var session = require('express-session');

app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(session({secret:"123456"}));

app.set('view engine','pug');
app.set('views','./views');

app.use('/',master);
app.listen(8888,()=>
{
  console.log('Server started at 8888');
});


This is Avtar Sahotta
