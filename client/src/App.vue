<template>
  <div>
    <MenuApp
      class="center-card"
      v-show="menuActive"
      @gameParams="updateGameParams"
    />
    <GameApp
      class="center-card"
      v-show="!menuActive"
      :inputWord="myWord"
      :inputUsername="myUsername"
      :inputLanguage="lang"
      :inputDifficulty="difficulty"
      @isEnd="gameEnd"
    />
  </div>
</template>

<script>
import GameApp from "./components/GameApp.vue";
import MenuApp from "./components/MenuApp.vue";

export default {
  components: {
    MenuApp: MenuApp,
    GameApp: GameApp,
  },
  data() {
    return {
      myWord: "",
      myUsername: "s",
      menuActive: true,
      lang: "",
      difficulty: "",
    };
  },
  methods: {
    async updateGameParams(newWord, newUsername, language, difficulty) {
      console.log(newUsername, language);
      this.myWord = newWord;
      this.myUsername = newUsername;
      this.lang = language;
      this.difficulty = difficulty;
      this.menuActive = false;
    },

    async gameEnd(isEnd) {
      if (isEnd) {
        this.menuActive = true;
      }
    },
  },
};
</script>

<style scoped>
.center-card {
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding-bottom: 10%; */
  height: 100vh;
}
</style>
