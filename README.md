The content below is an example project proposal / requirements document. Replace the text below the lines marked "__TODO__" with details specific to your project. Remove the "TODO" lines.

# Visualized 

## Overview

Finding out how good a show is before watching it can save both time and money. But going through various review sites to see how good a show's score is can also be a chore. Visualized is a one-stop-shop for seeing a show's scores on IMDB, Rotten Tomatoes, and more!

What's more is that Visualized will not only give you the current score of a show, but it will also reveal that show's trends by presenting its historical score as a graph. You decide which websites will be included in this graph. Visualized gives you the flexibility you need in a simple yet powerful way.

## Data Model

The application will store Shows, Scores, and Data_Points

* Shows can have multiple scores (via references)
* Each Score has an array of DataPoints

An Example Show:

```javascript
{
  title: "best show evar",
  id: // uniquely generated
  scores: // an array of references to Score documents
}
```

An Example Score with Embedded DataPoints:

```javascript
{
  source: "IMDB",
  data: // array of DataPoint objects
  lastUpdated: //last time data was updated
  min: 1
  max: 10
}
```

An Example DataPoint:

```javascript
{
  score: 10
  date: // timestamp
}
```

## [Link to Main Project File](app.js) 

![app](src/server.js)