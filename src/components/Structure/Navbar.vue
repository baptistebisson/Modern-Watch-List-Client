<template>
    <nav class="navbar navbar-expand-lg">
        <div class="container-nav">
            <span @click="showSidebar()" class="sidebar_toggle"><i class="material-icons">menu</i></span>
            <span class="logo"><a href="/"><img src="/static/img/logo-mwl.svg" alt=""></a></span>
            <div class="shortcut">
                <span @click="showMenu()" class="user-info"><i class="material-icons">person_outline</i>
                    <span class="name">{{ name }}</span></span>
                <div class="menu hide">
                    <ul>
                        <li><a href="/user/details">Personnal details</a></li>
                        <li><router-link to="logout">Logout</router-link></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import store from '@/store'

export default {
    name: 'navbar',
    created: function () {
        if (store.state.isLogged) {
            this.name = JSON.parse(localStorage.getItem('user')).name;
        } else {
            this.name = null;
        }
    },
    data () {
        return {
            name: "",
            user: JSON.parse(localStorage.getItem('user'))
        }
    },
    methods: {
        showMenu() {
            if ($('.menu').hasClass('hide')) {
                $('.menu').removeClass('hide');
            } else {
                $('.menu').addClass('hide');
            }
        },
        showSidebar() {
            store.dispatch('toggleSidebar')
        }
    },
}
</script>
