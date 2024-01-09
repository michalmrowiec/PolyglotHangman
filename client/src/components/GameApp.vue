<template>
  <div>
    <div class="center-card">
      <div class="card m-auto">
        <div class="card-header">
          <h5>Polyglot Hangman Menu</h5>
        </div>
        <div class="card-body">
          <p>{{ minutes }} : {{ seconds }} : {{ milliseconds }}</p>
          <p>cover: {{ coveredWord.join(" ") }}</p>
          <p>lett: {{ letters.join(" ") }}</p>

          <p>Attempts left: {{ attempts }}</p>
          <div v-if="!stopGame">
            <input
              v-model="letter"
              maxlength="1"
              placeholder="Enter a letter..."
              v-focus
              @keyup.enter="checkLetter"
            />
            <button @click="checkLetter" type="submit" class="btn btn-success">
              Sprawdź
            </button>
          </div>

          <div v-else>
            <p v-if="isWin">You Won!</p>
            <p v-else>You Lose!</p>

            <table>
              <tr v-for="(item, index) in scoreBoard" :key="index">
                <td>{{ item.user }}</td>
                <td>{{ item.time }}</td>
              </tr>
            </table>
          </div>

          <p v-show="alert">{{ alert }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["inputWord", "inputUsername"],
  data() {
    return {
      word: "",
      username: "",
      coveredWord: [],
      letter: "",
      letters: [],
      stopGame: false,
      isWin: false,
      alert: "",
      attempts: 10,
      timeStart: false,
      milliseconds: 0,
      seconds: 0,
      minutes: 0,
      intervalId: null,
      isBestScore: false,
      scoreBoard: [],
    };
  },
  watch: {
    inputWord(newVal) {
      this.word = newVal;
      this.coverWord();
      this.stopGame = false;
      this.isWin = false;
      this.attempts = 10;
      this.resetTimer();
    },
    inputUsername(newVal) {
      this.username = newVal;
    },
  },
  methods: {
    coverWord() {
      this.coveredWord = [];
      this.letters = [];
      for (let i = 0; i < this.word.length; i++) {
        this.coveredWord.push("_");
      }
    },

    checkLetter() {
      if (!this.timeStart) {
        this.timeStart = true;
        this.startTimer();
      }
      this.alert = "";
      if (
        this.word.includes(this.letter) &&
        !this.coveredWord.includes(this.letter)
      ) {
        for (let i = 0; i < this.word.length; i++) {
          if (this.word[i] == this.letter) {
            this.coveredWord[i] = this.letter;
          }
        }
      } else if (
        this.letters.includes(this.letter) ||
        this.coveredWord.includes(this.letter)
      ) {
        this.alert = this.letter + " is arleady entered";
      } else {
        this.letters.push(this.letter);
        this.attempts--;
      }

      this.letter = "";

      this.checkWin();
    },

    checkWin() {
      if (this.word === this.coveredWord.join("")) {
        this.stopTimer();
        this.getScores();
        console.log("is win.");
        this.stopGame = true;
        this.isWin = true;
      } else if (this.attempts == 0) {
        this.stopTimer();
        this.getScores();
        console.log("is lose.");
        this.stopGame = true;
        this.isWin = false;
        for (let i = 0; i < this.word.length; i++) {
          this.coveredWord[i] = this.word[i];
        }
      }
    },

    async getScores() {
      let requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: this.username,
          word: this.word,
          time: this.minutes * 60000 + this.seconds * 1000 + this.milliseconds,
        }),
      };

      fetch("http://localhost:3000/score", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.scoreBoard = data.scores;
          this.isBestScore = data.isBestScore;
        });

      this.$emit("isEnd", true);
    },

    startTimer() {
      this.intervalId = setInterval(() => {
        this.milliseconds++;
        if (this.milliseconds >= 100) {
          this.seconds++;
          this.milliseconds = 0;
        }
        if (this.seconds >= 60) {
          this.minutes++;
          this.seconds = 0;
        }
      }, 1);
    },
    stopTimer() {
      clearInterval(this.intervalId);
    },
    resetTimer() {
      this.stopTimer();
      this.timeStart = false;
      this.minutes = 0;
      this.seconds = 0;
      this.milliseconds = 0;
    },
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      },
    },
  },
};
</script>

<style scoped>
.center-card {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10%;
  height: 100vh;
}
</style>
