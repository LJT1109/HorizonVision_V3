import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import "./global.css";

const app = createApp(App)
// 自定義指令，用於添加 data-component-name 屬性
const addComponentName = {
    mounted(el, binding) {
      el.dataset.componentName = binding.value;
    }
};
app.use(createPinia())
app.use(router)
app.directive('component-name', addComponentName);
app.mount('#app')
