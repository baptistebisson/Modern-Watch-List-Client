<template>
    <div>
        <div class="heading-slider justify-content-center">
            <div class="find-movie">
                <div class="search_section">
                    <div class="search_btn"><img src="/static/img/search.svg" alt="Add a show"></div>
                    <input id="search-movie" @blur="hideDropdown" @focus="showDropdown" type="text" pattern=".{3,}" name="movie" v-on:keyup="searchMovie" v-model="movieName" placeholder="Search a tv show ...">
                </div>
                <div class="dropdown_search">
                    <div class="settings_search">
                        <ul>
                            <li v-bind:class="{ active: !search_type }" @click='search_type = !search_type'>Local</li>
                            <li v-bind:class="{ active: search_type }" @click='search_type = !search_type'>Online</li>
                        </ul>
                    </div>
                    <div class="search_result">
                        <div class="loading_content"><img src="/static/img/spinner-circle.svg"></div>
                        <div class="movie_item" v-for="(value, key, index) in tvFound.slice(0,4)" :data-key="'movie_'+key" v-on:click="addShow(value)">
                            <div class="movie_card">
                                <img v-if="value.poster_path !== null" :src="'https://image.tmdb.org/t/p/w185'+ value.poster_path" alt="">
                                <div v-else class="img_null"></div>
                                <article>
                                    <h1>{{ value.original_name }}</h1>
                                    <span>{{ value.first_air_date }}</span>
                                </article>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div v-if="filteredTv" class="section_movies">
                <h2 v-if="filteredTv.length === 1">{{ filteredTv.length }} TV Show</h2>
                <h2 v-else>{{ filteredTv.length ? filteredTv.length : 0 }} TV Shows</h2>

                <div v-if="filteredTv.length > 1" class="filters">
                    <label id="date_added" class="check">Date added
                        <input type="checkbox" v-model="filter.date_added">
                        <i class="material-icons">keyboard_arrow_down</i>
                    </label>
                    <label id="rate" class="check">Rate
                        <input type="checkbox" v-model="filter.rate">
                        <i class="material-icons">keyboard_arrow_down</i>
                    </label>
                    <label id="release_date" class="check">Release date
                        <input type="checkbox" v-model="filter.release_date">
                        <i class="material-icons">keyboard_arrow_down</i>
                    </label>
                    <label class="check input-filter">Upcoming
                        <input type="checkbox" v-model="filter.upcoming_movie">
                        <span class="checkmark"></span>
                    </label>
                    <span @click="refresh()" class="refresh"><i class="material-icons">refresh</i></span>
                </div>

                <div class="cards_list">
                    <div class="item_card" v-for="(value, key, index) in filteredTv" :data-id="value.id">
                        <div class="cover">
                            <router-link :to="{ name: 'tv/details', params: { id: value.id }}">
                                <img v-bind:src="'https://res.cloudinary.com/dsxar8lse/image/upload/c_scale,h_278,w_185/v1526292604/tv/p/'+value.api_id" v-bind:alt="value.title">
                            </router-link>
                        </div>
                        <article>
                            <h1>{{ value.title }}</h1>
                            <span>{{ value.first_air_date }}</span>
                            <span v-if="value.pivot.rating === 0 && !upcoming(value.first_air_date)" class="new-item" title="New movie"></span>
                            <span v-else-if="upcoming(value.first_air_date)" class="upcoming-item" title="Upcoming movie"></span>
                        </article>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import store from '@/store'
    import debounce from 'debounce'
    import swal from 'sweetalert';

    export default {
        name: 'tv',
        data () {
            return {
                movieName: '',
                tvFound: [],
                showsUser: [],
                modalMovie: [],
                search_type: false,
                clicked_movie: [],
                filter: {
                    date_added: false,
                    rate: false,
                    release_date: false,
                    upcoming_movie: false,
                },
            }
        },
        mounted () {
            store.dispatch('fetchData', {refresh: false});
            store.dispatch('getPopularMovies', {refresh: false});
            $('.search_result').hide();
        },
        beforeCreate () {
            document.body.className = 'tv'
        },
        methods: {
            searchMovie: debounce(function () {
                const name = this.movieName;

                if (this.movieName.length >= 3 && this.search_type === true) {
                    // Hide button list
                    $('.settings_search').hide();
                    // Show loader
                    $('.loading_content').show();

                    this.loader = true;
                    this.infoError = false;
                    this.$http.post(process.env.API_URL + '/tv/search', {
                        title: name,
                    }).then((response) => {
                        // Content is loaded
                        // Hide loader
                        $('.loading_content').hide();
                        // Show movies
                        $('.search_result').show();
                        // Add response data to local variable
                        this.tvFound = response.body.results;
                        console.log(response.body.results);
                    }, () => {

                    });
                } else {
                    // Input too short
                    // Hide buttons
                    $('.settings_search').show();
                    $('.search_result').hide();
                }
            }, 400),
            addShow (e) {
                const notyf = new Notyf();
                swal({
                    title: 'Add "' + e.original_name + '" ?',
                    text: 'Do you want to add this tv show to your watch list ?',
                    buttons: true
                })
                    .then((willAdd) => {
                        if (willAdd) {
                            this.$http.post(process.env.API_URL + '/tv/create', {
                                id: e.id,
                                user_id: JSON.parse(localStorage.getItem('user')).id
                            }).then((response) => {
                                if (response.body.error === false) {
                                    store.dispatch('fetchData', {refresh: true})
                                } else {
                                    notyf.alert(response.body.message);
                                }
                            }, () => {

                            })
                        }
                    })
            },
            hideSearch () {
                $('#search-movie').val('');
            },
            getMovies () {
                this.$http.get(process.env.API_URL + '/tv/get').then((response) => {
                    this.showsUser = response.body
                    // localStorage.setItem('movies', JSON.stringify(response.body))
                }, () => {

                })
            },
            showSettings (e) {
                this.clicked_movie = e;
                const settings = $('.settings_movie');
                if (settings.hasClass('hide')) {
                    settings.removeClass('hide');
                }
            },
            showDropdown () {
                $('.find-movie').addClass('active');
            },
            hideDropdown (event) {
                console.log(event);
                if (event.target.id !== 'search-movie') {
                    $('.find-movie').removeClass('active');
                }
            },
            refresh () {
                store.dispatch('fetchData', {refresh: true});
                const notyf = new Notyf();
                notyf.confirm('Refreshing list')
            },
            upcoming (date) {
                // Check if movie is released or not based on release date and today
                // date
                return new Date(date) > new Date();
            }

        },
        computed: {
            filteredTv: function () {
                if (store.state.tvData !== null) {
                    let result;

                    // Order by input text
                    if (this.search_type === false) {
                        const name = this.movieName;
                        const regex = new RegExp(name, 'i');

                        result = store.state.tvData.filter((movie) => {
                            return movie.title.match(regex)
                        })
                    } else {
                        result = store.state.tvData;
                    }

                    // Order by date added/position
                    if (this.filter.date_added === true) {
                        $('#date_added i').addClass('rotate');
                        result = result.sort((a,b) => {
                            return new Date(a.pivot.position) - new Date(b.pivot.position)
                        })
                    } else {
                        $('#date_added i').removeClass('rotate');
                    }

                    // Order by rate
                    if (this.filter.rate === true) {
                        $('#rate i').addClass('rotate');
                        result = result.sort((a,b) => {
                            return a.pivot.rating - b.pivot.rating
                        })
                    } else {
                        $('#rate i').removeClass('rotate');
                    }

                    // Order by release date
                    if (this.filter.release_date === true) {
                        $('#release_date i').addClass('rotate');
                        result = result.sort((a,b) => {
                            return new Date(a.release_date) - new Date(b.release_date)
                        })
                    } else {
                        $('#release_date i').removeClass('rotate');
                    }

                    // Order by upcoming
                    if (this.filter.upcoming_movie === true) {
                        result = result.filter((movie) => {
                            return this.upcoming(movie.release_date)
                        })
                    }

                    return result;
                }
            }
        }
    }
</script>
