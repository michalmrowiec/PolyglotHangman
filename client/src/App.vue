<template>
  <div>
    <MenuApp
      class="center-card"
      v-show="menuActive"
      @wordReceivedAndUsername="updateWordAndUsername"
    />
    <GameApp
      class="center-card"
      v-show="!menuActive"
      :inputWord="myWord"
      :inputUsername="myUsername"
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
    };
  },
  methods: {
    async updateWordAndUsername(newWord, newUsername) {
      this.myWord = newWord;
      this.myUsername = newUsername;
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
