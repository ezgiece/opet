import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  components: {}
})

export default class SideBar extends Vue {
  constructor() {
    super();
  }

  data() {
    return {
      drawer: null
    };
  }
}