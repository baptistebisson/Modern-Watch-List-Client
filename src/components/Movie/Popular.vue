<template>
    <div v-if="movies" class="section_movies container">
        <h2 v-if="movies.length === 1">Popular movie: {{ movies.length }}</h2>
        <h2 v-else>Popular movies: {{ movies.length ? movies.length : 0 }}</h2>

        <div class="cards_list">
            <div class="item" v-for="(value, key, index) in movies">
                <div class="movie_card" :data-id="value.id">
                    <div class="cover">
                        <div class="round hide">
                            <input type="checkbox" :id="'checkbox'+value.id" id="checkbox" />
                            <label for="checkbox"></label>
                        </div>
                        <router-link :to="{ name: 'movie/details', params: { id: value.id }}">
                            <img v-bind:src="'https://res.cloudinary.com/dsxar8lse/image/upload/c_scale,h_278,w_185/v1526292604/movie/p/'+value.image_api" v-bind:alt="value.title">
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
