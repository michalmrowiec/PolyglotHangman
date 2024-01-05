<template>
  <div>
    <MenuApp  @wordReceived="updateWord"/>
    
    <GameApp v-show="myWord" :inputWord="myWord"/>
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
      myWord: ""
    }
  },
  methods: {
    async updateWord(newWord) {
      this.myWord = newWord;
    }
  }
}
</script>
