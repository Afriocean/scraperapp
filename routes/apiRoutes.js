const db = require('../models');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function (app) {

    // scraping for new articles
    app.get('/', function (req, res) {
        console.log("get something")
        const promises = []
        const url = 'https://www.nytimes.com/sports/'
        axios.get(url).then(function (response) {

            let $ = cheerio.load(response.data);

            $('article').each(function (i, element) {
                let articleResult = {};

                let image = $(element).find('img').attr('src');
                let headline =  $(element).find('a').text().trim();
                let link = url + $(element).find('a').attr('href').trim();
                let summary = $(element).find('p').text().trim();

                articleResult.image = image;
                articleResult.link = link;
                articleResult.headline = headline;
                articleResult.summary = summary;
                articleResult.category = 'sports'
                articleResult.saved = false;

                console.log('articleResult', articleResult)

                db.Article.findOne({ headline: headline }).then(function (checkIfDup) {
                    if (checkIfDup) {
                        return;
                    } else {
                        const promise = db.Article.create(articleResult)
                        promises.push(promise)
                        // .then(function (newArticle) {
                        //     console.log('scraping...');
                        // }).catch(function (err) {
                        //     res.json(err);
                        // });
                    }
                }).catch(function (err) {
                    res.json(err);
                });
            });
        })
            .catch(err => console.log(err))

        Promise.all(promises)
            .then(responses => res.redirect('/myarticles'))
    });

    // getting all articles
    app.get('/articles', function (req, res) {
        db.Article.find({ saved: false }).then(function (articles) {
            res.json(articles);
        }).catch(function (err) {
            res.json(err);
        });
    });

    // getting a fixed article/remarks
    app.get('/articles/:id', function (req, res) {
        db.Article.findOne({ _id: req.params.id }).populate('remark').then(function (theArticle) {
            res.json(theArticle);
        }).catch(function (err) {
            res.json(err);
        });
    });

    // remark on a fixed article
    app.post('/articles/:id', function (req, res) {
        db.Remark.create(req.body).then(function (newRemark) {
            return db.Article.findOneAndUpdate(
                { _id: req.params.id },
                {
                    '$push': {
                        remark: newRemark._id
                    }
                },
                { new: true });
        }).then(function (updatedArticle) {
            res.json(updatedArticle);
        }).catch(function (err) {
            res.json(err);
        });
    });

    // save an article
    app.put('/articles/:id/save', function (req, res) {
        db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }, { new: true }).then(function (updated) {
            res.json(updated);
        }).catch(function (err) {
            res.json(err);
        });
    });

    // get saved articles
    app.get('/saved', function (req, res) {
        db.Article.find({ saved: true }).then(function (articles) {
            res.json(articles);
        }).catch(function (err) {
            res.json(err);
        });
    });

    // delete an article
    app.delete('/articles/:id/delete', function (req, res) {
        db.Article.remove({ _id: req.params.id }).then(function (articles) {
            res.json(articles);
        }).catch(function (err) {
            res.json(err);
        });
    });

    // delete a comment
    app.delete('/articles/deletecomment/:commid', function (req, res) {
        db.Comment.remove({ _id: req.params.commid }).then(function (comments) {
            res.json(comments);
        }).catch(function (err) {
            res.json(err);
        });
    });

    // delete unsaved articles
    app.delete('/articles', function (req, res) {
        db.Article.remove({ saved: false }).then(function (removed) {
            res.redirect('/');
        }).catch(function (err) {
            res.json(err)
        });
    });

    // delete all saved articles
    app.delete('/articles/saved', function (req, res) {
        db.Article.remove({ saved: true }).then(function (removed) {
            res.redirect('/myarticles');
        }).catch(function (err) {
            res.json(err)
        });
    });

};