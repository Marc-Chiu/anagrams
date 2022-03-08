'use strict';
const express = require('express');
const app = express();
const fs = require('fs');
const dictionary = JSON.parse(fs.readFileSync('dictionary.json', 'utf8'));
const nineT = 9000;
const grand = 1000;
const decimals = 4;
const hundo = 100;

// console.log(dictionary);
const players = {};
const multer = require('multer');

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware

// for application/json
app.use(express.json()); // built-in middleware

// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module

// define all endpoints here
app.get('/start', function(req, res) {
  let done = false;
  let id = "";
  while (!done) {
    id = "player_" + Math.round(Math.random() * nineT + grand, decimals);
    let keys = Object.keys(players);
    if (!keys.includes(id)) {
      players[id] = {"score": 0, "words": 0, "found": {}};
      done = true;
    }
  }
  res.json({"player_id": id});
});

app.post("/word", function(req, res) {
  if (!(req.body["word"] && req.body["player_id"])) {
    res.type('text').status(400).send('Error, Bad Request!');
  } else {
    let word = req.body["word"];
    let player_id = req.body["player_id"];
    let data =
    {
      "response": "",
      "score": players[player_id]["score"],
      "words": players[player_id]["words"],
      "isWord": false
    };

    let keys = Object.keys(dictionary);
    let wordsFound = Object.keys(players[player_id]["found"]);
    if (!keys.includes(word)) {
      data["response"] = "Not a Word";
      res.json(data);
    } else if (wordsFound.includes(word)) {
      data["response"] = "Already Found";
      res.json(data);
    } else {
      data["isWord"] = true;
      data["response"] = "Nice Find";
      players[player_id]["found"][word] = 1;
      players[player_id]["words"]++;
      data["words"] = players[player_id]["words"];
      players[player_id]["score"] += word.length * hundo;
      data["score"] = players[player_id]["score"];
      res.json(data);
    }
  }
});

app.get('/end/:player_id', function(req, res) {
  if (!req.params["player_id"]) {
    res.type('text').status(400).send('Error, Bad Request!');
  } else {
    res.json(players[req.params["player_id"]]["found"]);
  }
});

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);