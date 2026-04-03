import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

// 修复笔误：#app 必须完整，不能少写 p
createApp(App).mount("#app");