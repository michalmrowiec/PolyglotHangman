<template>
    <div>
      <div class="card w-75 m-auto">
        <div class="card-header">
          Polyglot Hangman Menu
        </div>
        <div class="card-body">
          <select v-model="language">
        <option value="en">Angielski</option>
        <option value="pl">Polski</option>
      </select>
      <select v-model="difficulty">
        <option value="easy">Łatwy</option>
        <option value="medium">Średni</option>
        <option value="hard">Trudny</option>
      </select>
      <input v-model="username" placeholder="Nickname"/>
      <button class="btn btn-outline-primary" @click="fetchData">Play</button>
        </div>
      </div>

      
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        language: "en",
        difficulty: "easy",
        word: "",
        username: ""
      }
    },
    methods: {
      async fetchData() {
        const response = await fetch(`http://localhost:3000/word?language=${this.language}&difficulty=${this.difficulty}`);
        const data = await response.json();
        this.$emit('wordReceivedAndUsername', data.word, this.username);
      },

    }
  }
  </script>
  