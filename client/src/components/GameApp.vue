<template>
  <div>
    <p>{{  }}</p>
    <p>cover: {{ coveredWord.join(' ') }}</p>
    <p>lett: {{ letters.join(' ') }}</p>

    <p>Attempts left: {{ attempts }}</p>

    <div v-if="!stopGame">
      <input v-model="letter" maxlength="1" />
      <button @click="checkLetter">Sprawdź</button>
    </div>
    <div v-else>
      <p v-if="isWin">You Win!</p>
      <p v-else>You Lose!</p>
    </div>

    <p v-show="alert">{{ alert }}</p>

  </div>
</template>

<script>
export default {
  props: ['inputWord'],
  data() {
    return {
      word: "",
      coveredWord: [],
      letter: "",
      letters: [],
      stopGame: false,
      isWin: false,
      alert: "",
      attempts: 10
    }
  },
  watch: {
    inputWord(newVal) {
      this.word = newVal;
      this.coverWord();
      this.stopGame = false;
      this.isWin = false;
      this.attempts = 10;
    }
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
      this.alert = "";
      if(this.word.includes(this.letter) && !this.coveredWord.includes(this.letter)) {
        for (let i = 0; i < this.word.length; i++) {
          if(this.word[i] == this.letter) {
            this.coveredWord[i] = this.letter;
          }
        }
      }
      else if(this.letters.includes(this.letter) || this.coveredWord.includes(this.letter)) {
        this.alert = this.letter + " is arleady entered"
      }
      else {
        this.letters.push(this.letter);
        this.attempts--;
      }

      this.letter = "";
      
      this.checkWin();
    },

    checkWin() {
      if(this.word === this.coveredWord.join("")) {
        console.log('is win.');
        this.stopGame = true;
        this.isWin = true;
      }
      else if(this.attempts == 0) {
        console.log('is lose.');
        this.stopGame = true;
        this.isWin = false;
        for (let i = 0; i < this.word.length; i++) {
          this.coveredWord[i] = this.word[i];
        }
      }
    }
  }
}
</script>
