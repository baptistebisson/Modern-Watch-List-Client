<template>
    <div v-if="show.backdrop_path" class="container">
        <div class="background-section">
            <div class="background-image" v-bind:style="{ backgroundImage: 'url(http://res.cloudinary.com/dsxar8lse/image/upload/v1527690379/tv/c/' + show.api_id + '.jpg)' }">
            </div>
            <!--<div class="container-button">-->
                <!--<a href="/" class="get_back"><i class="material-icons">arrow_back</i> Movies</a>-->
            <!--</div>-->
        </div>
        <div class="row justify-content-md-center">
            <div class="col-md-10 card movie_details row">
                <div class="col-lg-4 no-padding">
                    <div class="movie_image">
                        <img v-bind:src="'https://res.cloudinary.com/dsxar8lse/image/upload/c_scale,h_583,w_389/v1526292604/tv/p/'+show.api_id" v-bind:alt="show.title">
                    </div>
                </div>
                <div class="col-lg-8 droite">
                    <div class="details">
                        <div v-if="show.user_rate !== 404" class="rating">
                            <span class="rate">
                                <i title="Not seen" v-if="show.user_rate === 0" class="material-icons">
                                    visibility_off
                                </i>
                                <i title="Bad" v-else-if="show.user_rate === 1" class="material-icons">
                                    thumb_down
                                </i>
                                <i title="Okay" v-else-if="show.user_rate === 2" class="material-icons">
                                    thumbs_up_down
                                </i>
                                <i title="Good" v-else-if="show.user_rate === 3" class="material-icons">
                                    thumb_up
                                </i>
                                <i title="Great !" v-else-if="show.user_rate === 4" class="material-icons">
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
                        <h1 v-if="language === 'en'" v-on:click="showFrench">{{ show.title }}
                            <small v-if="show.french_title"><button type="button" name="button">{{ language }}</button></small>
                        </h1>
                        <h1 v-else v-on:click="showFrench">{{ show.other_title }}
                            <small v-if="show.french_title"><button type="button" name="button">{{ language }}</button></small>
                        </h1>
                        <ul class="liste">
                            <li>
                                <span>{{ show.release_date }}</span>
                            </li>
                            <li>
                                <span>{{ readable(show.duration) }}</span>
                            </li>
                            <li class="categories">
                                <span v-for="(list, index) in show.genres">
                                    <span class="badge badge-pill" :class="'badge-'+list.name.toLowerCase()">{{ list.name }}</span>
                                </span>
                            </li>
                        </ul>
                        <ul class="resume">
                            <li>
                                <span class="data">"{{ show.description }}"</span>
                            </li>
                        </ul>
                        <div class="movie_data">
                            <ul>
                                <li v-if="show.country !== null">
                                    <span class="titre">Country</span>
                                    <span class="data">{{ show.country }}</span>
                                </li>
                                <li v-if="show.budget !== null">
                                    <span class="titre">Budget</span>
                                    <span class="data">{{ formatPrice(show.budget) }}$</span>
                                </li>
                                <li v-if="show.gross !== null">
                                    <span class="titre">Gross</span>
                                    <span class="data">{{ formatPrice(show.gross) }}$</span>
                                </li>
                                <li v-if="show.homepage !== null">
                                    <span class="titre">Homepage</span>
                                    <span class="data"><a v-bind:href="show.homepage">{{ show.homepage }}</a></span>
                                </li>
                                <li v-if="show.network !== null">
                                    <span class="titre">Network</span>
                                    <span class="data">{{ show.network }}</span>
                                </li>
                                <li v-if="show.first_air_date !== null">
                                    <span class="titre">First air date</span>
                                    <span class="data">{{ show.first_air_date }}</span>
                                </li>
                            </ul>
                        </div>
                        <div v-if="show.user_rate !== 404" class="button-group">
                            <button @click="updateShow" type="button" class="btn btn-outline-primary" title="Update data"><i class="material-icons">refresh</i> Update</button>
                            <button @click="deleteShow" type="button" class="btn btn-outline-danger" title="Delete this show"><i class="material-icons">delete</i> Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-if="show.actors.length !== 0">
            <h2 class="title_center">Actors</h2>
            <div class="section_actors slider_item">
                <swiper :options="swiperOption">
                    <swiper-slide class="item_card" v-for="(value, key, index) in show.actors" :key="index">
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
                    </swiper-slide>
                </swiper>
                <div class="swiper-button-prev swiper-button-black" slot="button-prev"></div>
                <div class="swiper-button-next swiper-button-black" slot="button-next"></div>
            </div>
        </div>

        <div class="row" v-if="show.directors.length !== 0">
            <h2 class="title_center mt-30">Directors</h2>
            <div class="section_directors">
                <div class="item_card" v-for="(value, key, index) in show.directors">
                    <router-link :to="{ name: 'show/details', params: { id: value.id }}">
                        <div class="content">
                            <img v-if="value.image_api === 'no_picture.jpg'" src="https://res.cloudinary.com/dsxar8lse/image/upload/v1526302908/movie/a/no_picture.jpg" alt="">
                            <img v-else v-bind:src="'https://res.cloudinary.com/dsxar8lse/image/upload/c_scale,w_180/v1526292604/tv/d/'+value.image_api" alt="">
                            <article>
                                <h1>{{ value.name }}</h1>
                            </article>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>

        <div class="row">
            <h2 class="title_center mt-30">Seasons</h2>
            <div class="seasons_container">
                <div class="season_container" v-for="(value) in show.seasons">
                    <div class="season_item">
                        <div class="image">
                            <img v-bind:src="'https://res.cloudinary.com/dsxar8lse/image/upload/c_scale,w_130/v1526292604/tv/s/p/'+value.api_id" alt="">                    </div>
                        <div class="content">
                            <h2>{{ value.title }}</h2>
                            <p class="details">{{ moment(value.release_date).format('YYYY') }} | {{ value.episode_count }} Episodes</p>
                            <p class="description">{{ value.title }} of {{ show.title }} premiered on {{ moment(value.release_date).format('MMMM D, YYYY') }}.</p>
                        </div>
                    </div>
                    <div class="episodes_container">
                        <ul>
                            <li>Episode 1</li>
                            <li>Episode 2</li>
                            <li>Episode 3</li>
                            <li>Episode 4</li>
                            <li>Episode 5</li>
                            <li>Episode 6</li>
                            <li>Episode 7</li>
                        </ul>
                    </div>
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

<style>
    @import '/static/css/swiper.min.css';
</style>

<script>
import router from '@/router';
import swal from 'sweetalert';
import moment from 'moment';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
    components: {
        swiper, swiperSlide
    },
    beforeCreate () {
        document.body.className = 'body-details';
    },
    data () {
        return {
            moment: moment,
            show: [],
            language: "en",
            swiperOption: {
                slidesPerView: 7,
                spaceBetween: 30,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    1180: {
                        slidesPerView: 5,
                    },
                    768: {
                        slidesPerView: 3,
                        noSwiping: true,
                        allowTouchMove: false,
                    },
                    500: {
                        slidesPerView: 2,
                        noSwiping: true,
                        allowTouchMove: false,
                    },
                }
            }
        }
    },
    created: function() {
        this.$http.post(process.env.API_URL + '/tv/details', {
            id: this.$route.params.id,
        }).then((response) => {
            this.show = response.body;
        }, (error) => {
            router.push('/tv')
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
            if (mark !== this.show.user_rate) {
                this.$http.post(process.env.API_URL + '/user/mark', {
                    id: this.show.id,
                    type: "show",
                    mark: mark
                }).then((response) => {
                    if (response.body.error === false) {
                        this.show.user_rate = mark;
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
                id: this.show.id,
                type: "show",
            }).then((response) => {
                if (response.body.error === false) {
                    notyf.confirm(response.body.message);
                } else {
                    notyf.alert(response.body.message);
                }
            }, () => {

            })
        },
        deleteShow() {
            swal({
                title: "Are you sure?",
                text: "You will delete "+ this.show.title +" from your list",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    this.$http.post(process.env.API_URL + '/user/delete', {
                        id: this.show.id,
                        type: "show",
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
        updateShow() {
            swal({
                title: "Update",
                text: "You will update "+ this.show.title +" data",
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
