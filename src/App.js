const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const sanitize = require('sanitize');

const {
  Show,
  Score
} = require('./db.js');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/search', (req, res) => {
  if (!req.query.showTitle) {
    res.json({});
  } else {
    req.query.showTitle = sanitize(req.query.showTitle);
    Show.find({
      title: req.query.showTitle
    }, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result.length !== 0) {
        res.json(result.map((show) => {
          console.log(JSON.stringify(show));
          return {
            title: show.title,
            director: show.director,
            year: show.year,
            score: show.score
          };
        }));
      } else {
        const title = req.query.showTitle.split(" ").join("+");
        const link = 'https://www.omdbapi.com/?t=' + title + '&apikey=23c8330d';
        fetch(link)
          .then(response => response.json())
          .then((result) => {
            console.log("TITLE: " + result["Title"]);
            const score = new Score({
              source: 'IMDb'
            });
            const show = new Show({
              title: result["Title"],
              director: result["Director"],
              year: result["Year"],
              score: score
            });
            show.save((err, shows) => {
              if (err) {
                console.log(err);
              } else {
                console.log(JSON.stringify(shows));
                res.json({
                  show
                });
              }
            });
          });
      }
    });
  }
});

app.get('/api/visualize', (req, res) => {
  req.query.showTitle = sanitize(req.query.showTitle);
  const title = req.query.showTitle.split(" ").join("+");
  const link = 'https://www.omdbapi.com/?t=' + title + '&Season=1&apikey=23c8330d';
  console.log(link);
  fetch(link)
    .then(response => response.json())
    .then(result => res.json(result));
});

app.post('/api/add', (req, res) => {
  const score = new Score({
    source: 'Manual'
  });
  const show = new Show({
    title: sanitize(req.body.title),
    director: sanitize(req.body.director),
    year: sanitize(req.body.year),
    score: score
  });

  show.save((err, show) => {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      res.json(show);
    }
  });
});

app.post('/api/remove', (req, res) => {
  Show.findOneAndDelete({title: req.body.title}, (err, data) => {
    if(err) {
      res.json(err);
    } else {
      res.json(data);
    }
  });
});

app.listen(13218);