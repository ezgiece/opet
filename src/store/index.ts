import Vue from 'vue'
import Vuex from 'vuex'
import config from '@/config';
import { getSettings, setConfig } from '@/services/application';
import vuetify from '@/plugins/vuetify';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    dark: getSettings().dark === null ? config.DEFAULT_DARK : getSettings().dark
  },
  mutations: {
    dark(state, dark) {
      vuetify.framework.theme.dark = dark;

      state.dark = setConfig({ dark }).dark;
    },
  },
  actions: {
    setDark(context, value) {
      context.commit('dark', value);
    },
  },
  modules: {
  }
})
