const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let database = JSON.parse(fs.readFileSync("database.json", "utf8"));

app.get("/word", (req, res) => {
  let word = getWord(req.query.language, req.query.difficulty);
  let language = database.languages.find(
    (l) => l.language === req.query.language
  );
  console.log(language);
  res.send({ word: word.word, language: language.full });
});

app.post("/score", (req, res) => {
  console.log("body");
  console.log(req.body);

  let isBestScore;

  if (req.body.user != "") {
    console.log("req.body.user ==  - is true");
    saveScore(req.body.user, req.body.word, req.body.time);
    isBestScore = checkBestScore(req.body.user, req.body.word, req.body.time);
  }

  let scores = getOverall(req.body.word);

  res.send({ scores: scores, isBestScore: isBestScore });
});

function getWord(language, difficulty) {
  let filteredWords = database.words.filter(
    (word) => word.language === language && word.difficulty === difficulty
  );

  let randomIndex = Math.floor(Math.random() * filteredWords.length);
  let selectedWord = filteredWords[randomIndex];

  return selectedWord;
}

function saveScore(user, word, time) {
  if (user.length === 0) return;

  database.scores.push({ user: user, word: word, time: time });

  fs.writeFileSync("database.json", JSON.stringify(database));
}

function checkBestScore(user, word, time) {
  console.log("check best score=============");
  let wordEntry = database.words.find((entry) => entry.word === word);
  console.log("word entry: " + wordEntry);

  if (wordEntry.bestScore.time === 0 || wordEntry.bestScore.time > time) {
    wordEntry.bestScore.nickname = user;
    wordEntry.bestScore.time = time;

    fs.writeFileSync("database.json", JSON.stringify(database));
    return true;
  }
  return false;
}

function getOverall(word) {
  let scores = database.scores
    .filter((score) => score.word === word)
    .slice(0, 10);

  scores.sort((a, b) => a.time - b.time);

  return scores;
}

app.listen(3000, () => console.log("A  App running at  http://localhost:3000"));
