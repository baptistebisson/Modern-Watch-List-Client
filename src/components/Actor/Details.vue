<template>
    <div>
        <div class="row justify-content-md-center">
            <div class="col-md-10 card movie_details row">
                <div class="col-lg-4 no-padding">
                    <div class="movie_image">
                        <v-lazy-image v-bind:src="'http://api.baptiste-bisson.com/img/a/'+actor.details.image_original"
                        v-bind:src-placeholder="'http://api.baptiste-bisson.com/img/a/'+actor.details.image_small"/>
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
                        <div class="button-group">
                            <button @click="deleteActor" type="button" class="btn btn-warning btn-sm"><i class="material-icons">delete</i> Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="card card-m known_for">
                    <h2>Also known for</h2>
                    <div class="content">
                        <ul>
                            <li v-for="(value, key, index) in know_for">
                            <div class="cover">
                                <img v-if="value.backdrop_path !== null" :src="'https://image.tmdb.org/t/p/w185'+value.backdrop_path" alt="">
                                <div v-else class="img_null"></div>
                            </div>
                            <article>
                                <h1>{{ value.title }}</h1>
                                <span>{{ value.release_date }}</span>
                            </article>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

<!--         <div class="section_movies">
            <div class="cards_list">
                <div class="item-1" v-for="(value, key, index) in know_for">
                        <div class="movie_card">
                            <div class="cover">
                                <img :src="'https://image.tmdb.org/t/p/w185'+value.backdrop_path" alt="">
                            </div>
                            <article>
                                <h1>{{ value.title }}</h1>
                                <span>{{ value.release_date }}</span>
                            </article>
                        </div>
                </div>
            </div>
        </div> -->
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
            actor: [],
            language: "en",
            gross: 0,
            budget: 0,
            details: [],
            know_for: [],
        }
    },
    created: function() {
        this.$http.post('http://api.baptiste-bisson.com/actor/details', {
            id: this.$route.params.id,
        }).then((response) => {
            this.actor = response.body;
            this.gross = numeral(response.body.biggest_gross.gross).format('$0.00a');
            this.budget = numeral(response.body.biggest_budget.budget).format('$0.00a');
            this.getDetails(response.body.details.api_id);
        }, (error) => {
            router.push('/home')
        })
    },
    methods: {
        deleteActor() {

        },
        getDetails(api_id) {
            this.$http.get('https://api.themoviedb.org/3/person/' + api_id + '/movie_credits', {
                params: {
                    api_key: "51fa59f0dc58a632ea9415c9547aa49d",
                    language: "en-US",
                }
            }).then((response) => {
                var cast = response.body.cast;
                cast = cast.sort((a, b) => a.vote_count > b.vote_count ).reverse();
                //cast = cast.sort((a, b) => a.vote_count > b.vote_count ).reverse().slice(0, 12);
                this.know_for = cast;
            }, () => {

            })
        },
    }
}
</script>
