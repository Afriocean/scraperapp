const express = require('express');
const mongoose = require('mongoose');
const exphbs = require("express-handlebars");

let PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/newsArticles', {useNewUrlParser: true});

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

require('./routes/apiRoutes')(app);
require('./routes/htmlRoutes')(app);

app.listen(PORT, function() {
    console.log('App running on port ' + PORT + '.');
});

module.exports = app;