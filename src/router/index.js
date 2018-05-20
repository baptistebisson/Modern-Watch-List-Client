import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: '/',
    routes: [
        {
            path: '/login',
            name: 'login',
            component: function (resolve) {
                require(['@/components/Login.vue'], resolve)
            }
        },
        {
            path: '/logout',
            name: 'logout',
            component: function (resolve) {
                require(['@/components/Logout.vue'], resolve)
            }
        },
        {
            path: '/',
            name: 'home',
            component: function (resolve) {
                require(['@/components/Home.vue'], resolve)
            },

        },
        {
            path: '/movie/details/:id',
            name: 'movie/details',
            component: function (resolve) {
                require(['@/components/Movie/Details.vue'], resolve)
            }
        },
        {
            path: '/actor/details/:id',
            name: 'actor/details',
            component: function (resolve) {
                require(['@/components/Actor/Details.vue'], resolve)
            }
        },
        {
            path: '/user/details',
            name: 'user/details',
            component: function (resolve) {
                require(['@/components/User/Details.vue'], resolve)
            }
        },
        {
            path: '/movie/reorder',
            name: 'movie/reorder',
            component: function (resolve) {
                require(['@/components/Movie/Reorder.vue'], resolve)
            }
        },
        {
            path: '/movie/popular',
            name: 'movie/popular',
            component: function (resolve) {
                require(['@/components/Movie/Popular.vue'], resolve)
            }
        },
    ],
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
})


router.beforeEach((to, from, next) => {
    const auth = store.state.auth;
    //store.dispatch('validToken');
    if (to.name == "logout" || to.name == "login") {
        next();
    } else {
        if (store.state.isLogged) {
            next();
        } else {
            next('login');
        }
        Vue.http.get('https://api.baptiste-bisson.com/auth/valid').then((response) => {
        
        }, () => {
        
        })
    }
})

export default router;
