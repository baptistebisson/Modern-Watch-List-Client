<template>
    <div>
        <div class="loader"><img src="/static/img/logo-mwl-black.svg" alt=""></div>
        <app-nav v-if="this.$route.name !== 'login'"></app-nav>
        <div id="app">
            <router-view/>
        </div>
        <sidebar v-if="this.$route.name !== 'login'"/>
        <!-- <app-footer v-if="this.$route.name !== 'login'"></app-footer> -->
    </div>
</template>

<script>
import AppNav from './components/Structure/Navbar.vue'
import AppFooter from './components/Structure/Footer.vue'
import Sidebar from './components/Structure/Sidebar.vue'

export default {
    name: 'App',
    components: { AppNav, AppFooter, Sidebar },
    data() {
        return {

        }
    },
    mounted () {

    },
    created () {
        // this.$router.beforeEach((to, from, next) => {
        //     next()
        // })
        // this.$router.afterEach((to, from) => {
        //
        // })
    }
}
</script>
