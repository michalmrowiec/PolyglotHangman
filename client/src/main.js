import { createApp, nextTick } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";

const app = createApp(App);

app.directive("focus", {
  mounted(el) {
    nextTick(() => {
      el.focus();
    });
  },
});

app.mount("#app");
