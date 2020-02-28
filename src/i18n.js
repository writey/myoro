import Vue from 'vue';
import VueI18n from 'vue-i18n'

Vue.use(VueI18n);
function loadLocaleMessage () { // 读取locales下的json文件 添加至i18n中
  const locales = require.context('./locales', true, /[a-zA-Z0-9_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach(key => {
    const match = key.match(/([A-Za-z0-9-_]+)\./i);
    if (match && match.length > 0) {
      const locale = match[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'zh_cn',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'zh_cn',
  messages: loadLocaleMessage()
});