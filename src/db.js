const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

const Score = new mongoose.Schema({
    source: {
        type: String,
        required: false,
        minlength: 1
    },
    score: {
        type: Number,
        required: false,
        min: 1,
        max: 10
    }
});

const Show = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 1
    },
    director: {
        type: String,
        required: true,
        minLength: 1
    },
    year: {
        type: String,
        required: true,
        minLength: 4,
    },
    score: {
        type: Score,
        required: false,
    },
});
// "mongodb://ma4759:6nTEu3VT@class-mongodb.cims.nyu.edu/ma4759"
Show.plugin(URLSlugs('title'));
const shows = {
    Show: mongoose.model('Show', Show),
    Score: mongoose.model('Score', Score)
};
mongoose.connect(
    "mongodb://ma4759:6nTEu3VT@class-mongodb.cims.nyu.edu/ma4759", {
        useNewUrlParser: true
    }
);

module.exports = shows;