import Vue from 'vue'
import Component from 'vue-class-component'
import {  getUsername, getIsAdmin,setLanguageCode } from '@/utils/auth'

@Component({
  components: {
  },
  computed: {
    dark: {
      get() {
        return this.$store.state.dark
      },
      set(value) {
        this.$store.dispatch('setDark', value)
      }
    }
  },
})

export default class Header extends Vue {

  constructor() {
    super();
  }

  userName: string = getUsername();
  selectedLang: string = this.$i18n.locale;
  isAdmin: boolean = getIsAdmin();



  async logOut() {

  }

  isLoginPage() {
    return false;
  }

  changeLang() {
    this.$vuetify.lang.current = this.selectedLang;
    this.$i18n.locale = this.selectedLang;
    setLanguageCode(this.selectedLang);
    location.reload();
  }

  data() {
    return {
      langs: [
        { text: 'EN', value: 'en' },
        { text: 'TR', value: 'tr' }
      ]
    };
  }

}

