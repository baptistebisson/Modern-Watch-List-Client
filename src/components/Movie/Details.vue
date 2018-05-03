<template>
    <div v-if="movie.backdrop_path">
        <div class="background-section">
            <div class="background-image" v-bind:style="{ backgroundImage: 'url(http://api.baptiste-bisson.com/img/b/' + movie.backdrop_path + ')' }">

            </div>
        </div>
        <div class="row justify-content-md-center">
            <div class="col-md-10 card movie_details row">
                <div class="col-lg-4 no-padding">
                    <div class="movie_image">
                        <v-lazy-image v-bind:src="'http://api.baptiste-bisson.com/img/'+movie.image_original"
                        v-bind:src-placeholder="'http://api.baptiste-bisson.com/img/'+movie.image_small"/>
                    </div>
                </div>
                <div class="col-lg-8 droite">
                    <div class="details">
                        <div class="rating">
                            <span class="rate">
                                <i v-if="movie.user_rate == 0" class="material-icons">add</i>
                                <i v-else-if="movie.user_rate == 1" class="material-icons">thumb_down</i>
                                <i v-else-if="movie.user_rate == 2" class="material-icons">thumb_up</i>
                                <i v-else-if="movie.user_rate == 3" class="material-icons">favorite</i>
                            </span>
                            <div class="rate-group">
                                <i @click="addMark(1)" class="material-icons">thumb_down</i>
                                <i @click="addMark(2)" class="material-icons">thumb_up</i>
                                <i @click="addMark(3)" class="material-icons">favorite</i>
                            </div>
                        </div>
                        <h1 v-if="language == 'en'" v-on:click="showFrench">{{ movie.title }}
                            <small v-if="movie.french_title"><button type="button" name="button">{{ language }}</button></small>
                        </h1>
                        <h1 v-else v-on:click="showFrench">{{ movie.other_title }}
                            <small v-if="movie.french_title"><button type="button" name="button">{{ language }}</button></small>
                        </h1>
                        <ul class="liste">
                            <li>
                                <span>{{ movie.release_date }}</span>
                            </li>
                            <li>
                                <span>{{ readable(movie.duration) }}</span>
                            </li>
                            <li class="categories">
                                <span v-for="(list, index) in movie.genres">
                                    <span>{{ list.name }}</span><span v-if="index+1 < movie.genres.length">, </span>
                                </span>
                            </li>
                        </ul>
                        <ul class="resume">
                            <li>
                                <span class="data">"{{ movie.description }}"</span>
                            </li>
                        </ul>
                        <div class="movie_data">
                            <ul>
                                <li>
                                    <span class="titre">Country</span>
                                    <span class="data">{{ movie.country }}</span>
                                </li>
                                <li v-if="movie.budget !== 0">
                                    <span class="titre">Budget</span>
                                    <span class="data">{{ formatPrice(movie.budget) }}$</span>
                                </li>
                                <li v-if="movie.gross !== 0">
                                    <span class="titre">Gross</span>
                                    <span class="data">{{ formatPrice(movie.gross) }}$</span>
                                </li>
                            </ul>
                        </div>
                        <div class="button-group">
                            <button @click="deleteMovie" type="button" class="btn btn-warning btn-sm"><i class="material-icons">delete</i> Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <h2 class="title_center">Actors</h2>
            <div class="section_actors">
                <div class="people_card" v-for="(value, key, index) in movie.actors">
                    <router-link :to="{ name: 'actor/details', params: { id: value.id }}">
                        <div class="content">
                            <v-lazy-image v-bind:src="'http://api.baptiste-bisson.com/img/a/'+value.image_small"
                            v-bind:src-placeholder="'http://api.baptiste-bisson.com/img/a/'+value.image_small"/>
                            <article>
                                <h1>{{ value.name }}</h1>
                                <span>#{{ value.pivot.name }}</span>
                            </article>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="row">
            <h2 class="title_center mt-30">Directors</h2>
            <div class="section_directors">
                <div class="people_card" v-for="(value, key, index) in movie.directors">
                    <router-link :to="{ name: 'movie/details', params: { id: value.id }}">
                        <div class="content">
                            <v-lazy-image v-bind:src="'http://api.baptiste-bisson.com/img/d/'+value.image_small"
                            v-bind:src-placeholder="'http://api.baptiste-bisson.com/img/d/'+value.image_small"/>
                            <article>
                                <h1>{{ value.name }}</h1>
                            </article>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import router from '@/router'

export default {
    beforeCreate () {
        document.body.className = 'body-details';
    },
    data () {
        return {
            movie: [],
            language: "en",
        }
    },
    created: function() {
        this.$http.post('http://api.baptiste-bisson.com/movie/details', {
            id: this.$route.params.id,
        }).then((response) => {
            this.movie = response.body;
        }, (error) => {
            router.push('/')
        })
    },
    methods: {
        showFrench() {
            // if (this.language == "en") {
            //     this.language = "fr";
            // } else {
            //     this.language = "en";
            // }
        },
        readable(duration) {
            var hours = Math.floor(duration/60);
            var minutes = duration % 60;
            return hours + 'h ' + minutes + 'm';
        },
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',');
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        addMark(mark) {
            var notyf = new Notyf();
            if (mark !== this.movie.user_rate) {
                this.$http.post('http://api.baptiste-bisson.com/user/mark', {
                    id: this.movie.id,
                    type: "movie",
                    mark: mark
                }, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    },
                }).then((response) => {
                    if (response.body.error === false) {
                        this.movie.user_rate = mark;
                        notyf.confirm(response.body.message);
                    } else {
                        notyf.alert(response.body.message);
                    }
                }, () => {

                })
            }
        },
        deleteMovie() {
            swal({
                title: "Are you sure?",
                text: "You will delete "+ this.movie.title +" from your list",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    this.$http.post('http://api.baptiste-bisson.com/user/delete', {
                        id: this.movie.id,
                        type: "movie",
                    }, {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        },
                    }).then((response) => {
                        if (response.body.error === false) {
                            swal("Movie deleted", {
                                icon: "success",
                            });
                            router.push('/home')
                        } else {
                            swal("An error has occured", {
                                icon: "error",
                            });
                        }
                    }, () => {

                    })
                }
            });
        }
    }
}
</script>
