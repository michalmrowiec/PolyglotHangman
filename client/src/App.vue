<template>
  <div>
    <MenuApp v-show="!game" @wordReceivedAndUsername="updateWordAndUsername"/>
    <GameApp v-show="myWord" :inputWord="myWord" :inputUsername="myUsername" @isEnd="gameEnd"/>
  </div>
</template>

<script>
import GameApp from './components/GameApp.vue'
import MenuApp from './components/MenuApp.vue'

export default {
  components : {
    MenuApp: MenuApp,
    GameApp: GameApp
  },
  data() {
    return {
      myWord: "",
      myUsername: "s",
      game: false
    }
  },
  methods: {
    async updateWordAndUsername(newWord, newUsername) {
      this.myWord = newWord;
      this.myUsername = newUsername;
      this.game = true;
      console.log(newUsername)
    },

    async gameEnd(isEnd) {
      if(isEnd) {
        this.game = false;
      }
    }
  }
}
</script>
