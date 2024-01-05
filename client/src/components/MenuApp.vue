<template>
    <div>
      <select v-model="language">
        <option value="en">Angielski</option>
        <option value="pl">Polski</option>
      </select>
      <select v-model="difficulty">
        <option value="easy">Łatwy</option>
        <option value="medium">Średni</option>
        <option value="hard">Trudny</option>
      </select>
      <button @click="fetchData">Wyślij</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        language: "en",
        difficulty: "easy",
        word: "",
      }
    },
    methods: {
      async fetchData() {
        const response = await fetch(`http://localhost:3000/word?language=${this.language}&difficulty=${this.difficulty}`);
        const data = await response.json();
        this.$emit('wordReceived', data.word);
      },

    }
  }
  </script>
  