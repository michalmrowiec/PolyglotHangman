const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

let database = JSON.parse(fs.readFileSync('database.json', 'utf8'));

app.get('/word', (req, res) => {
  let word = getWord(req.query.language, req.query.difficulty);
  res.send(word);
});

app.post('/score', (req, res) => {
  saveScore(req.body.user, req.body.word, req.body.time);
  let isBestScore = checkBestScore(req.body.user, req.body.word, req.body.time);
  let scores = getOverall(req.body.word);

  res.send({scores: scores, isBestScore: isBestScore});
});

function getWord(language, difficulty) {
  let filteredWords = database.words.filter(word => word.language === language && word.difficulty === difficulty);
  
  let randomIndex = Math.floor(Math.random() * filteredWords.length);
  let selectedWord = filteredWords[randomIndex];
  
  return selectedWord;
}

function saveScore(user, word, time) {
  // Dodaj nowy wynik do tablicy wyników
  database.scores.push({ user: user, word: word, time: time});
  
  // Zapisz zmienioną bazę danych do pliku
  fs.writeFileSync('database.json', JSON.stringify(database));
}

function checkBestScore(user, word, time) {
    // Znajdź słowo w bazie danych
    let wordEntry = database.words.find(entry => entry.word === word);
    
    // Sprawdź, czy nowy wynik jest lepszy od aktualnego najlepszego wyniku
    if(wordEntry.bestScore.time === 0 || wordEntry.bestScore.time > time) {
        // Jeśli tak, zaktualizuj najlepszy wynik
        wordEntry.bestScore.nickname = user;
        wordEntry.bestScore.time = time;
        
        // Zapisz zmienioną bazę danych do pliku
        fs.writeFileSync('database.json', JSON.stringify(database));
        return true;
    }
    return false;
}

function getOverall(word) {
    let scores = database.scores.filter(score => score.word === word);

    scores.sort((a, b) => a.time - b.time);

    return scores;
}

app.listen(3000, () => console.log('Aplikacja działa na localhost:3000'));