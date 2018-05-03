<template>
    <form class="form form-login" v-on:submit.prevent="login">
        <h2 class="form_title">Login</h2>

        <div class="alert alert-danger" role="alert" v-if="infoError">Login failed. Please try again.</div>

        <div class="content" :class="{'is-waiting': loader}">
            <div class="form-group">
                <input v-model.trim="email" class="form-control" name="email" type="email" placeholder="E-mail address" required>
            </div>
            <div class="form-group">
                <input v-model.trim="password" class="form-control" name="password" type="password" placeholder="Password" required>
            </div>
        </div>

        <div class="form_actions col-md-12 align-self-center">
            <button class="btn btn-primary">Login</button>
        </div>
    </form>
</template>

<script>
    import router from '@/router'
    import store from '@/store'
    export default {
        name: 'login',
        data () {
            return {
                loader: false,
                infoError: false,
                email: '',
                password: ''
            }
        },
        beforeCreate () {
            if (store.state.isLogged) {
                router.push('/');
            }
            document.body.className = 'login';
        },
        methods: {
            login () {
                this.loader = true
                this.infoError = false
                this.$http.post('http://api.baptiste-bisson.com/auth/login', {
                    email: this.email,
                    password: this.password
                }).then((response) => {
                    localStorage.setItem('token', response.body.token)
                    localStorage.setItem('user', JSON.stringify(response.body.user))
                    store.commit('LOGIN_USER')
                    router.push('/')
                }, () => {
                    this.infoError = true
                    this.loader = false
                    this.password = ''
                })
            }
        }
    }
</script>

<style lang="scss">
html {
    font-size: 100%;
    line-height: 1.5;
    height: 100%;
}
</style>
