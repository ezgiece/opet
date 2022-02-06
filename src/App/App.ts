import Vue from 'vue'
import Component from 'vue-class-component'
import Loading from '@/components/layout/Loading/Loading.vue'
import Header from '@/components/layout/Header/Header.vue'
import SideBar from '@/components/layout/SideBar/SideBar.vue'
import Footer from '@/components/layout/Footer/Footer.vue'
import { isLoggedIn } from '../utils/auth'

@Component({
    components: {
        Loading,
        Header,
        SideBar,
        Footer
    },
})

export default class App extends Vue {

    constructor() {
        super();
    }

    isLoggedIn() {
        return true;
    }

    isLoginPage() {
        return false;
    }

    data() {
        return {
            drawer: null
        };
    }

}