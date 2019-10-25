const db = require("../models");
module.exports = function(app) {

    app.get('/', function(req, res) {
        db.Article.find({saved: false}).then(function(articles) {
            res.render('index', {articles});
        }).catch(function(err) {
            res.json(err);
        });
    });

    app.get('/myarticles', function(req, res) {
        db.Article.find({}).then(function(articles) {
            res.render('myarticles', {articles});
        }).catch(function(err) {
            res.json(err);
        });
    });

    app.get('*', function(req, res) {
        db.Article.find({}).then(function(articles) {
            res.render('index', {articles});
        }).catch(function(err) {
            res.json(err);
        });
    });

};