<template>
    <div v-if="movies" class="section_movies">
        <h2 v-if="movies.length == 1">Popular movie: {{ movies.length }}</h2>
        <h2 v-else>Popular movies: {{ movies.length ? movies.length : 0 }}</h2>

        <div class="cards_list">
            <div class="item" v-for="(value, key, index) in movies">
                <div class="movie_card" :data-id="value.id">
                    <div class="cover">
                        <div class="round hide">
                            <input type="checkbox" :id="'checkbox'+value.id" id="checkbox" />
                            <label for="checkbox"></label>
                        </div>
                        <span v-on:click='showSettings(value)' class="show_settings"><i class="material-icons">settings</i></span>
                        <router-link :to="{ name: 'movie/details', params: { id: value.id }}">
                            <v-lazy-image v-bind:src="'http://api.baptiste-bisson.com/img/'+value.image_small"
                                          v-bind:src-placeholder="'http://api.baptiste-bisson.com/img/'+value.image_small"/>
                        </router-link>
                    </div>
                    <article>
                        <h1>{{ value.title }}</h1>
                        <span>{{ value.release_date.slice(0,4) }}</span>
                    </article>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import store from '@/store'

	export default {
		name: "Popular",
        data () {
            return {
                movies: [],
            }
        },
        mounted () {
            store.dispatch('getPopularMovies', {refresh: false});
		    this.movies = store.state.popularMovies;
        }
	}
</script>
