import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    lang: localStorage['lang'] ? localStorage['lang'] : 'zh_cn',
    show: {loading: true, output: false},
    bgColorArr: [
      '#caad9f',
      '#f0c869',
      '#6abce0',
      '#9ac4bd',
      '#fad0c4',
      '#9ec6cd'
    ],
    languages: {
      中: 'zh_cn',
      En: 'en_us',
      日: 'ja_jp',
      De: 'de_de'
    },
    sources: {
      O: require('@/assets/images/O.png'),
      R: require('@/assets/images/R.png'),
      OB: require('@/assets/images/OB.png'),
    }
  },
  mutations: {
    setShow(state, show) {
      state.show = show;
    },
    setImageCache(state, images) {
      state.images = images;
    },
    changeLang(state, lang) {
      state.lang = lang;
      localStorage.lang = state.lang;
    }
  }
});

export default store;