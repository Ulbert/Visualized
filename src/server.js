const mongoose = require("mongoose")
const express = require("express");
const sanitize = require('mongo-sanitize');
const path = require('path');
const app = express();
const fetch = require("node-fetch");
// const cors = require("cors");
require("./db");

const Show = mongoose.model('Show');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: false
}));

// app.use(cors());

app.get('/', (req, res) => {
    fetch('https://api.jikan.moe/v3/anime/1/episodes/2')
    .then((res) => res.json())
    .catch((err) => console.log(err))

    if (Object.keys(req.query).length === 0) {
        Show.find({}, (err, show) => {
            if (err) {
                res.render('search', {
                    'err': err
                });
            } else {
                res.render('search', {
                    'show': show,
                });
            }
        });
    } else {
        Show.find({
            title: req.query.value
        }, (err, show) => {
            if (err) {
                res.render('search', {
                    'err': err
                });
            } else {
                res.render('search', {
                    'show': show,
                });
            }
        });
    }
});

app.get('/search/:slug', (req, res) => {
    Show.findOne({
        'slug': req.params.slug
    }, (err, show) => {
        if (err) {
            res.render('details', {
                'err': err
            });
        } else {
            console.log(show.score);
            show.stars = "";
                for (let i = 0; i < show.score; i++) {
                    show.stars += "*";
                }

            res.render('details', {
                'show': show,
            });
        }
    });
});

app.post('/search/:slug', (req, res) => {
    Show.findOneAndUpdate({
        slug: req.params.slug
    }, {
        $set: {
            'score': sanitize(req.body.rating)
        }
    }, function (err) {
        if (err) {
            res.render('/search/' + req.params.slug, {
                'err': err
            });
        } else {
            res.redirect('/search/' + req.params.slug);
        }
    });
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {
    const s = new Show({
        'title': sanitize(req.body.title),
    });

    s.save((err) => {
        if (err) {
            res.render('add', {
                'err': err
            });
        } else {
            res.redirect('/');
        }
    });
});

app.listen(13218, () => console.log(`LISTENING...`));

// linserv1.cims.nyu.edu ... port 13218
// mongodb 6nTEu3VT