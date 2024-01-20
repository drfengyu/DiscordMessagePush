const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.post('/api/event', (req, res) => {
  if (req.body.hasOwnProperty('challenge')) {
    res.status(200).send({ challenge: req.body.challenge });
  } else {
    res.status(400).send('No challenge found in request');
  }
});
module.exports = app;
