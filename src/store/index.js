import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import ui from './modules/ui'

Vue.use(Vuex);
Vue.use(VueResource);

const state = {
    isLogged: !!localStorage.getItem('token'),
    savedData: null,
    tvData: null,
    popularMovies: null,
    validToken: false,
    isLoaded: false,
};

const mutations = {
    LOGIN_USER(state) {
        state.isLogged = true
    },

    LOGOUT_USER(state) {
        state.isLogged = false
    },

    updateSavedData(state, data) {
        state.savedData = data
    },
    
    updateTvData(state, data) {
        state.tvData = data
    },
    
    updatePopularMovie(state, data) {
        state.popularMovies = data
    },

    updateValidToken(state, data) {
        state.validToken = data
    }
};

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state,
    mutations,
    modules: {
        ui,
    },
    actions: {
        fetchData({commit}, params) {
            if (localStorage.getItem("movies") && params.refresh === false) {
                const movies = JSON.parse(localStorage.getItem("movies"));
                commit('updateSavedData', movies);
                //We need to check if our local storage is up to date
                const list = [];
                movies.forEach(function(e) {
                    list.push({
                        'id': e['id'],
                        'position': e['pivot']['position']
                    });
                });
                Vue.http.post(process.env.API_URL + '/movie/refresh', {
                    movies: list,
                }).then((response) => {
                    if (response.body === 'true') {
                        Vue.http.get(process.env.API_URL + '/movie/get').then((response) => {
                            commit('updateSavedData', response.body)
                            localStorage.setItem('movies', JSON.stringify(response.body));
                        }, () => {

                        })
                    }
                }, () => {

                })
            } else {
                Vue.http.get(process.env.API_URL + '/movie/get').then((response) => {
                    commit('updateSavedData', response.body);
                    localStorage.setItem('movies', JSON.stringify(response.body));
                }, () => {

                })
            }
    
            // Get tv shows
            if (localStorage.getItem("tv") && params.refresh === false) {
                const tv = JSON.parse(localStorage.getItem("tv"));
                commit('updateTvData', tv);
                //We need to check if our local storage is up to date
                const list = [];
                tv.forEach(function(e) {
                    list.push({
                        'id': e['id'],
                        'position': e['pivot']['position']
                    });
                });
                Vue.http.post(process.env.API_URL + '/tv/refresh', {
                    tv: list,
                }).then((response) => {
                    if (response.body === 'true') {
                        Vue.http.get(process.env.API_URL + '/tv/get').then((response) => {
                            if (response.status !== 204) {
                                commit('updateTvData', response.body);
                                localStorage.setItem('tv', JSON.stringify(response.body));
                            }
                        }, () => {
                        
                        })
                    }
                }, () => {
            
                })
            } else {
                Vue.http.get(process.env.API_URL + '/tv/get').then((response) => {
                    if (response.status !== 204) {
                        commit('updateSavedData', response.body);
                        localStorage.setItem('tv', JSON.stringify(response.body));
                    }
                }, () => {
                
                })
            }
            
            // Popular movies
            if (!localStorage.getItem("popular_movies")) {
                Vue.http.get(process.env.API_URL + '/movie/popular').then((response) => {
                    commit('updatePopularMovie', response.body);
                    localStorage.setItem('popular_movies', JSON.stringify(response.body));
                }, () => {
    
                })
            } else {
                const moviesPopular = JSON.parse(localStorage.getItem("movies"));
                commit('updatePopularMovie', moviesPopular);
            }
        },
        getPopularMovies({commit}, params) {
            // Popular movies
            if (!localStorage.getItem("popular_movies")) {
                Vue.http.get(process.env.API_URL + '/movie/popular').then((response) => {
                    commit('updatePopularMovie', response.body);
                    localStorage.setItem('popular_movies', JSON.stringify(response.body));
                }, () => {
                
                })
            } else {
                const moviesPopular = JSON.parse(localStorage.getItem("popular_movies"));
                commit('updatePopularMovie', moviesPopular);
            }
        },
        validToken({
            commit
        }) {
            Vue.http.get(process.env.API_URL + '/auth/valid').then((response) => {
                commit('updateValidToken', true)
            }, () => {

            })
        }
    }
})
