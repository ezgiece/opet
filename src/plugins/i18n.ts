import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Cookies from 'js-cookie';
import en from '@/locales/en.json';
import tr from '@/locales/tr.json';


Vue.use(VueI18n)

//const lang = getSettings().lang === undefined ? 'en' : getSettings().lang;

export function getLanguage() {
    const chosenLanguage = Cookies.get('language');
    if (chosenLanguage) return chosenLanguage;
  
    // if no language chosen
    const language = navigator.language.toLowerCase();
    const locales = ['en', 'tr'];
    for (const locale of locales) {
        if (language.indexOf(locale) > -1) {
            return locale;
        }
    }
    return 'en';
}


export default new VueI18n({
    locale: getLanguage(), 
    messages: {en, tr}
});
