<template>
  <div class="center-card">
    <div class="card m-auto">
      <div class="card-header">
        <h5>Polyglot Hangman Menu</h5>
      </div>
      <div class="card-body">
        <div>
          <select v-model="language" class="form-select">
            <option value="en">Angielski</option>
            <option value="pl">Polski</option>
          </select>

          <select v-model="difficulty" class="form-select mt-3">
            <option value="easy">Łatwy</option>
            <option value="medium">Średni</option>
            <option value="hard">Trudny</option>
          </select>
        </div>

        <div class="mt-3">
          <input
            v-model="username"
            placeholder="Nickname"
            class="form-control"
          />
          <button class="btn btn-primary w-100 mt-3" @click="fetchData">
            Play
          </button>
        </div>
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
      username: "",
    };
  },
  methods: {
    async fetchData() {
      const response = await fetch(
        `http://localhost:3000/word?language=${this.language}&difficulty=${this.difficulty}`
      );
      const data = await response.json();
      this.$emit("wordReceivedAndUsername", data.word, this.username);
    },
  },
};
</script>

<style scoped>
.card {
  background-color: rgba(104, 184, 104, 0.726);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
