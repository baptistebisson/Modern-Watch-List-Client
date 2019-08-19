<template>
    <div class="container">
        <div class="row justify-content-md-center">
            <div class="col-md-10 card movie_details row">
                <div class="col-lg-4 no-padding">
                    <div class="movie_image">
                        <img v-bind:src="'https://res.cloudinary.com/dsxar8lse/image/upload/c_scale,h_583,w_389/v1526292604/movie/a/'+actor.details.image_original" v-bind:alt="actor.details.name">
                    </div>
                </div>
                <div class="col-lg-8 droite">
                    <div class="details">
                        <h1>{{ actor.details.name }}</h1>
                        <ul class="liste">
                            <li>
                                <span>{{ actor.details.birth_date }}</span>
                            </li>
                            <li>
                                <span>{{ age }}</span>
                            </li>
                            <li>
                                <span>{{ actor.details.place_of_birth }}</span>
                            </li>
                        </ul>
                        <ul class="resume">
                            <li>
                                <span class="data">"{{ actor.details.biography }}"</span>
                            </li>
                        </ul>
                        <div class="movie_data">
                            <ul>
                                <li>
                                    <span class="titre">Biggest movie gross</span>
                                    <span class="data">"{{ actor.biggest_gross.title }}" with <b>{{ gross }}</b></span>
                                </li>
                                <li>
                                    <span class="titre">Biggest movie budget</span>
                                    <span class="data">"{{ actor.biggest_budget.title }}" with <b>{{ budget }}</b></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mb-4">
            <h2 class="title_center">Also known for</h2>
            <div class="section_actors">
                <div class="people_card" v-for="(value, key, index) in famous_movies">
                    <div class="content">
                        <img v-if="value.backdrop_path !== null" :src="'https://image.tmdb.org/t/p/w185'+value.backdrop_path" alt="">
                        <div v-else class="img_null"></div>
                        <article>
                            <h1>{{ value.title }}</h1>
                            <span>#{{ value.release_date }}</span>
                        </article>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6 col-lg-5 col-sm-12 mb-4">
                <div class="card card-m">
                    <h2>Acting</h2>
                    <div class="content">
                        <table id="actor_credits">
                            <tbody>
                                <tr v-for="(movie) in movies">
                                    <td v-if="movie.release_date.length !== 0" class="year">
                                        {{ movie.release_date.slice(0, 4) }}
                                    </td>
                                    <td v-else class="year">—</td>
                                    <td class="separator"><i class="material-icons">fiber_manual_record</i></td>
                                    <td v-if="movie.character !== ''" class="role">
                                        <b>{{ movie.title }} as</b> {{ movie.character }}
                                    </td>
                                    <td v-else class="role">
                                        <b>{{ movie.title }}</b>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import numeral from 'numeral'

export default {
    beforeCreate () {
        document.body.className = 'body-details';
    },
    data () {
        return {
            actor: {
                details: {
                    image_original: "no_picture.jpg",
                    birth_date: "",
                    place_of_birth: "",
                    biography: "",
                    image_small: "no_picture.jpg",
                },
                biggest_gross: {
                    title: "",
                },
                biggest_budget: {
                    title: "",
                },
            },
            language: "en",
            gross: 0,
            budget: 0,
            details: [],
            movies: [],
            not_released: [],
            famous_movies: [],
            age: '',
        }
    },
    created: function() {
        this.$http.post(process.env.API_URL + '/actor/details', {
            id: this.$route.params.id,
        }).then((response) => {
            this.actor = response.body;
            this.gross = numeral(response.body.biggest_gross.gross).format('$0.00a');
            this.budget = numeral(response.body.biggest_budget.budget).format('$0.00a');
            this.getDetails(response.body.details.api_id);

            this.age = this.calculateAge(this.actor.details.birth_date);
        }, (error) => {
            router.push('/home')
        })
    },
    methods: {
        getDetails(api_id) {
            this.$http.get(process.env.API_URL + '/actor/credits', {
                params: {
                    id: api_id
                }
            }).then((response) => {
                var cast = response.body.cast;

                cast = cast.sort((a, b) => a.vote_count > b.vote_count ).reverse();
                this.famous_movies = cast.slice(0, 10);

                for (var i = 0; i < Object.keys(cast).length; i++) {
                    // We don't want movie without release date
                    if (!cast[i].hasOwnProperty('release_date')) {
                        cast.splice(i, 1);
                    } else {
                        if (cast[i].release_date === "") {
                            this.not_released.push(cast[i]);
                            // Remove this movie from array
                            cast.splice(i, 1);
                        }
                    }
                }

                var movies = cast.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

                // Sort array
                this.movies = Object.assign(movies, this.not_released);
            }, () => {

            })
        },
        calculateAge(birthday) {
            var birthdate = new Date(birthday);
            var cur = new Date();
            var diff = cur-birthdate; // This is the difference in milliseconds
            var age = Math.floor(diff/31557600000);
            return age + ' years old';
        }
    }
}
</script>
