import Vue from 'vue'
import Vuex from 'vuex'
import App from './App/App.vue'
import router from './router'
import Cookies from "js-cookie";
import store from './store'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@/assets/css/style.css'
import VueMask from 'v-mask'
import VuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.css'
import VuetifyToast from 'vuetify-toast-snackbar-ng'
import fullscreen from 'vue-fullscreen'
import DatetimePicker from 'vuetify-datetime-picker'
import VueDraggable from 'vue-draggable'
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';
import VueGoogleCharts from 'vue-google-charts';
import locale from 'element-ui/lib/locale'

Vue.config.productionTip = false;
Vue.use(Vuex);
locale.use(Cookies.get('language'))
Vue.use(VueMask);
Vue.use(VuetifyToast);
Vue.use(VuetifyDialog, {
  context: {
    vuetify
  }
});
Vue.use(fullscreen);
Vue.use(DatetimePicker);
Vue.use(VueDraggable);
Vue.use(VueGoogleCharts);

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')

