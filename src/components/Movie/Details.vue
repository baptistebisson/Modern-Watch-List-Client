<template>
    <div v-if="movie.backdrop_path" class="container">
        <div class="background-section">
            <div class="background-image" v-bind:style="{ backgroundImage: 'url(http://res.cloudinary.com/dsxar8lse/image/upload/v1527690379/movie/c/' + movie.imdb_id + '.jpg)' }">
            </div>
            <!--<div class="container-button">-->
                <!--<a href="/" class="get_back"><i class="material-icons">arrow_back</i> Movies</a>-->
            <!--</div>-->
        </div>
        <div class="row justify-content-md-center">
            <div class="col-md-10 card movie_details row">
                <div class="col-lg-4 no-padding">
                    <div class="movie_image">
                        <img v-bind:src="'https://res.cloudinary.com/dsxar8lse/image/upload/c_scale,h_583,w_389/v1526292604/movie/p/'+movie.image_api" v-bind:alt="movie.title">
                    </div>
                </div>
                <div class="col-lg-8 droite">
                    <div class="details">
                        <div v-if="movie.user_rate !== 404" class="rating">
                            <span class="rate">
                                <i title="Not seen" v-if="movie.user_rate === 0" class="material-icons">
                                    visibility_off
                                </i>
                                <i title="Bad" v-else-if="movie.user_rate === 1" class="material-icons">
                                    thumb_down
                                </i>
                                <i title="Okay" v-else-if="movie.user_rate === 2" class="material-icons">
                                    thumbs_up_down
                                </i>
                                <i title="Good" v-else-if="movie.user_rate === 3" class="material-icons">
                                    thumb_up
                                </i>
                                <i title="Great !" v-else-if="movie.user_rate === 4" class="material-icons">
                                    favorite
                                </i>
                            </span>
                            <div class="rate-group">
                                <i title="Bad" @click="addMark(1)" class="material-icons">thumb_down</i>
                                <i title="Okay" @click="addMark(2)" class="material-icons">thumbs_up_down</i>
                                <i title="Good" @click="addMark(3)" class="material-icons">thumb_up</i>
                                <i title="Great !" @click="addMark(4)" class="material-icons">favorite</i>
                            </div>
                        </div>
                        <div v-else class="rating">
                            <span class="rate">
                                <i title="Add to list" @click="addToList()" class="material-icons">add</i>
                            </span>
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
                                    <span class="badge badge-pill" :class="'badge-'+list.name.toLowerCase()">{{ list.name }}</span>
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
                                <li v-if="movie.budget !== null">
                                    <span class="titre">Budget</span>
                                    <span class="data">{{ formatPrice(movie.budget) }}$</span>
                                </li>
                                <li v-if="movie.gross !== null">
                                    <span class="titre">Gross</span>
                                    <span class="data">{{ formatPrice(movie.gross) }}$</span>
                                </li>
                            </ul>
                        </div>
                        <div v-if="movie.user_rate !== 404" class="button-group">
                            <button @click="updateMovie" type="button" class="btn btn-outline-primary"><i class="material-icons">refresh</i> Update</button>
                            <button @click="deleteMovie" type="button" class="btn btn-outline-danger"><i class="material-icons">delete</i> Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-if="movie.actors.length !== 0">
            <h2 class="title_center">Actors</h2>
            <div class="section_actors">
                <div class="item_card" v-for="(value, key, index) in movie.actors">
                    <router-link :to="{ name: 'actor/details', params: { id: value.id }}">
                        <div class="content">
                            <img v-if="value.image_api === '.jpg'" src="https://res.cloudinary.com/dsxar8lse/image/upload/v1526302908/movie/a/no_picture.jpg" alt="">
                            <img v-else v-bind:src="'https://res.cloudinary.com/dsxar8lse/image/upload/c_scale,w_180/v1526292604/movie/a/'+value.image_api" alt="">
                            <article>
                                <h1>{{ value.name }}</h1>
                                <span>#{{ value.pivot.name }}</span>
                            </article>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="row" v-if="movie.directors.length !== 0">
            <h2 class="title_center mt-30">Directors</h2>
            <div class="section_directors">
                <div class="item_card" v-for="(value, key, index) in movie.directors">
                    <router-link :to="{ name: 'movie/details', params: { id: value.id }}">
                        <div class="content">
                            <img v-if="value.image_api === 'no_picture.jpg'" src="https://res.cloudinary.com/dsxar8lse/image/upload/v1526302908/movie/a/no_picture.jpg" alt="">
                            <img v-else v-bind:src="'https://res.cloudinary.com/dsxar8lse/image/upload/c_scale,w_180/v1526292604/movie/d/'+value.image_api" alt="">
                            <article>
                                <h1>{{ value.name }}</h1>
                            </article>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>

        <div class="row hide" id="video_section">
            <div class="col-md-10 offset-1">
                <div class="card card-m">
                    <h2>Videos</h2>
                    <div class="content videos" style="min-height: 116px;">
                        <div class="container-video">
                            <div class="inner-video">
                                <div class="fake-background"><i class="material-icons">play_arrow</i></div>
                            </div>
                        </div>
                        <div class="container-video">
                            <div class="inner-video">
                                <div class="fake-background"><i class="material-icons">play_arrow</i></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import router from '@/router';
import swal from 'sweetalert';

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
        this.$http.post(process.env.API_URL + '/movie/details', {
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
            if (hours === 0) {
                return minutes + 'm';
            }
            return hours + 'h ' + minutes + 'm';
        },
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',');
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        addMark(mark) {
            var notyf = new Notyf();
            if (mark !== this.movie.user_rate) {
                this.$http.post(process.env.API_URL + '/user/mark', {
                    id: this.movie.id,
                    type: "movie",
                    mark: mark
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
        addToList() {
            var notyf = new Notyf();
            this.$http.post(process.env.API_URL + '/user/add', {
                id: this.movie.id,
                type: "movie",
            }).then((response) => {
                if (response.body.error === false) {
                    notyf.confirm(response.body.message);
                } else {
                    notyf.alert(response.body.message);
                }
            }, () => {

            })
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
                    this.$http.post(process.env.API_URL + '/user/delete', {
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
                            router.push('/')
                        } else {
                            swal("An error has occured", {
                                icon: "error",
                            });
                        }
                    }, () => {

                    })
                }
            });
        },
        updateMovie() {
            swal({
                title: "Update",
                text: "You will update "+ this.movie.title +" data",
                icon: "info",
                buttons: true,
            })
                .then((willUpdate) => {
                    if (willUpdate) {

                    }
                });
        }
    }
}
</script>
