<template>
  <div>
    <div class="center-card">
      <div class="card m-auto">
        <div class="card-header">
          <h5>Polyglot Hangman Game</h5>
        </div>
        <div class="card-body">
          <div class="text-center">
            <div style="font-size: 30px">
              ⏱️ {{ minutes }} : {{ seconds.toString().padStart(2, "0") }} :
              {{ milliseconds.toString().padStart(2, "0") }}
            </div>
            <div class="mt-2" style="font-size: 20px">
              Attempts left: <b>{{ attempts }}</b>
            </div>
            <div style="font-size: 20px">
              Wrong letters: <b>{{ letters.join(" ") }}</b>
            </div>
            <div
              class="mt-3 p-2 border border-secondary rounded d-inline-block w-100"
            >
              <p class="fs-5 mb-2">👇<b> Guess the word </b>👇</p>
              <p class="display-4 px-3">{{ coveredWord.join(" ") }}</p>
            </div>
          </div>

          <div v-if="!stopGame" class="d-flex mt-4">
            <div class="input-group">
              <input
                v-focus
                type="text"
                v-model="letter"
                maxlength="1"
                placeholder="Enter a letter..."
                @keyup.enter="checkLetter"
                class="form-control"
              />

              <button
                class="btn btn-success"
                @click="checkLetter"
                v-show="!stopGame"
                type="submit"
              >
                Check
              </button>
            </div>
          </div>

          <div v-if="!stopGame" class="d-flex">
            <div v-show="alert" style="color: red" class="mt-1 mx-auto">
              <b>{{ alert }}</b> is arleady entered
            </div>
          </div>

          <div v-else class="mt-3">
            <div v-if="isWin">
              <div
                class="alert alert-success text-center display-6"
                role="alert"
              >
                🏆 <b>You Won!</b> 👏
              </div>
            </div>
            <div v-else>
              <div
                class="alert alert-danger text-center display-6"
                role="alert"
              >
                😿 <b>You Lose!</b> 😿
              </div>
            </div>

            <button
              @click="goToMenu"
              type="submit"
              class="btn btn-outline-primary w-100"
            >
              Play again
            </button>

            <table class="table mt-1">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Player</th>
                  <th scope="col">Time</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in scoreBoard" :key="index">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>{{ item.user }}</td>
                  <td>
                    {{ Math.floor(item.time / 60000) }} :
                    {{
                      Math.floor((item.time % 60000) / 1000)
                        .toString()
                        .padStart(2, "0")
                    }}
                    : {{ (item.time % 1000).toString().padStart(2, "0") }}
                  </td>
                  <td v-if="index === 0">🥇</td>
                  <td v-else-if="index === 1">🥈</td>
                  <td v-else-if="index === 2">🥉</td>
                  <td v-else></td>
                </tr>
              </tbody>
            </table>
          </div>
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
        this.alert = this.letter;
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
    goToMenu() {
      this.$emit("isEnd", true);
    },
  },
};
</script>

<style scoped></style>
