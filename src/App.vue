<template>
    <div>
        <vue-progress-bar></vue-progress-bar>
        <app-nav v-if="this.$route.name !== 'login'"></app-nav>
        <div id="app" class="container">
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
        this.$Progress.finish()
    },
    created () {
        this.$Progress.start()
        this.$router.beforeEach((to, from, next) => {
            if (to.meta.progress !== undefined) {
                let meta = to.meta.progress
                this.$Progress.parseMeta(meta)
            }
            this.$Progress.start()
            next()
        })
        this.$router.afterEach((to, from) => {
            this.$Progress.finish()
        })
    }
}
</script>
