// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import Notyf from 'notyf'
import store from '@/store'

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(Notyf);

Vue.http.interceptors.push((request, next) => {
    request.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
    return function (response) {
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            store.commit('LOGOUT_USER');
            router.push('login')
        } else {
            next()
        }
    }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
});
