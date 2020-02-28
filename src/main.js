import Vue from 'vue'
import App from './App.vue'
import i18n from './i18n'
import store from './store'

Vue.config.productionTip = false;

i18n.locale = store.state.lang;
new Vue({
  el: '#app',
  i18n,
  render: c => c(App),
  store
});