<template>
    <div>
        <div class="row heading-slider justify-content-center">
            <div class="form find-movie">
                <input id="search-movie" type="text" pattern=".{3,}" name="movie" v-on:keyup="searchMovie" v-model="movieName" placeholder="Search a movie ...">
                <div class="selector">
                    <span class="text" v-bind:class="{ active: !search_type }">Local</span>
                    <label class="switch" alt="Find online or local movie">
                        <input id="search_type" type="checkbox" v-model="search_type">
                        <span class="slider round"></span>
                    </label>
                    <span class="text" v-bind:class="{ active: search_type }">IMDB</span>
                </div>
            </div>
        </div>
        <div class="section_result">
            <div id="close_section_result"><i class="material-icons" @click="hideSearch">close</i></div>
            <div class="cards_list result_search">
                <div class="item-1" v-for="(value, key, index) in moviesFound.slice(0,4)" :data-key="'movie_'+key" v-on:click="addMovie(value)">
                    <div class="movie_card">
                        <img v-if="value.poster_path !== null" :src="'https://image.tmdb.org/t/p/w185'+ value.poster_path" alt="">
                        <div v-else class="img_null"></div>
                        <article>
                            <h1>{{ value.original_title }}</h1>
                            <span>{{ value.release_date.slice(0,4) }}</span>
                        </article>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="filteredMovies" class="section_movies">
            <h2 v-if="filteredMovies.length == 1">{{ filteredMovies.length }} movie</h2>
            <h2 v-else>{{ filteredMovies.length ? filteredMovies.length : 0 }} movies</h2>

            <div v-if="filteredMovies.length > 1" class="filters">
                <label class="check">Date added
                    <input type="checkbox" v-model="filter.date_added">
                    <span class="checkmark"></span>
                </label>
                <label class="check">Rate
                    <input type="checkbox" v-model="filter.rate">
                    <span class="checkmark"></span>
                </label>
                <label class="check">Movie date
                    <input type="checkbox" v-model="filter.movie_date">
                    <span class="checkmark"></span>
                </label>
                <span @click="refresh()" class="refresh"><i class="material-icons">refresh</i></span>
            </div>

            <div class="cards_list">
                <div class="item" v-for="(value, key, index) in filteredMovies">
                    <div class="movie_card" :data-id="value.id">
                        <div class="cover">
                            <span v-on:click='showSettings(value)' class="show_settings"><i class="material-icons">settings</i></span>
                            <router-link :to="{ name: 'movie/details', params: { id: value.id }}">
                                <v-lazy-image v-bind:src="'http://api.baptiste-bisson.com/img/'+value.image_small"
                                              v-bind:src-placeholder="'http://api.baptiste-bisson.com/img/'+value.image_small"/>
                            </router-link>
                        </div>
                        <article>
                            <h1>{{ value.title }}</h1>
                            <span>{{ value.release_date.slice(0,4) }}
                                <span title="Movie not seen" class="not-seen" v-if="value.pivot.rating === 0"><i class="material-icons">visibility_off</i></span>
                            </span>
                        </article>
                    </div>
                </div>
            </div>
        </div>
        <div class="settings_movie hide">
            <div class="header">
                <span class="title">{{ clicked_movie.title }}</span>
            </div>
            <div class="content">
                <ul>
                    <li @click="deleteMovie(clicked_movie)" ><i class="material-icons">delete</i> Delete</li>
                    <li @click="moveMovie(clicked_movie)"><i class="material-icons">reorder</i> Move</li>
                </ul>
                <span @click="hideSettings()" class="close_settings"><i class="material-icons">close</i></span>
            </div>
        </div>
    </div>
</template>

<script>
  import store from '@/store'
  import debounce from 'debounce'
  import swal from 'sweetalert';

  export default {
      name: 'home',
      data () {
          return {
              movieName: '',
              moviesFound: [],
              moviesUser: [],
              modalMovie: [],
              search_type: false,
              clicked_movie: [],
              filter: {
                  date_added: false,
                  rate: false,
                  movie_date: false,
              },
          }
      },
      mounted () {
          store.dispatch('fetchData', {refresh: false});
          store.dispatch('getPopularMovies', {refresh: false});
      },
      beforeCreate () {
          document.body.className = ''
      },
      methods: {
          searchMovie: debounce(function (e) {
              const name = this.movieName;

              if (this.movieName.length >= 3) {
                  this.loader = true
                  this.infoError = false
                  this.$http.get('https://api.themoviedb.org/3/search/movie', {
                      params: {
                          api_key: 'MOVIE KEY',
                          language: 'en-US',
                          query: name,
                          page: 1,
                          include_adult: false
                      }
                  }).then((response) => {
                      this.moviesFound = [];
                      this.moviesFound = response.body.results;
                      $('.section_result').addClass('show')
                  }, () => {

                  })
              }
          }, 400),
          addMovie (e) {
              const notyf = new Notyf();
              swal({
                  title: 'Add "' + e.original_title + '" ?',
                  text: 'Do you want to add this movie to your watch list ?',
                  buttons: true
              })
                  .then((willAdd) => {
                      if (willAdd) {
                          this.$http.post('http://api.baptiste-bisson.com/movie/create', {
                              id: e.id,
                              user_id: JSON.parse(localStorage.getItem('user')).id
                          }).then((response) => {
                              if (response.body.error === false) {
                                  // swal(response.body.message, {
                                  //     icon: 'success'
                                  // })
                                  store.dispatch('fetchData', {refresh: true})
                              } else {
                                  notyf.alert(response.body.message);
                                  // swal(response.body.message, {
                                  //     icon: 'error'
                                  // })
                              }
                          }, () => {

                          })
                      }
                  })
          },
          hideSearch () {
              $('.section_result').removeClass('show');
              $('#search-movie').val('');
          },
          getMovies () {
              this.$http.get('http://api.baptiste-bisson.com/movie/get').then((response) => {
                  this.moviesUser = response.body
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
          deleteMovie (movie) {
              swal({
                  title: 'Are you sure?',
                  text: 'You will delete ' + movie.title + ' from your list',
                  icon: 'warning',
                  buttons: true,
                  dangerMode: true
              })
                  .then((willDelete) => {
                      if (willDelete) {
                          this.$http.post('http://api.baptiste-bisson.com/user/delete', {
                              id: movie.id,
                              type: 'movie'
                          }).then((response) => {
                              if (response.body.error === false) {
                                  swal('Movie deleted', {
                                      icon: 'success'
                                  });
                                  store.dispatch('fetchData', {refresh: true})
                              } else {
                                  swal('An error has occured', {
                                      icon: 'error'
                                  })
                              }
                          }, () => {

                          })
                      }
                  })
          },
          hideSettings () {
              const settings = $('.settings_movie');
              if (!settings.hasClass('hide')) {
                  settings.addClass('hide')
              }
          },
          refresh () {
              store.dispatch('fetchData', {refresh: true});
              const notyf = new Notyf();
              notyf.confirm('Refreshing list')
          }

      },
      computed: {
          filteredMovies: function () {
              if (store.state.savedData !== null) {
                  let result;
                  if (this.search_type === false) {
                      const name = this.movieName;
                      const regex = new RegExp(name, 'i');

                      result = store.state.savedData.filter((movie) => {
                          return movie.title.match(regex)
                      })
                  } else {
                      result = store.state.savedData;
                  }

                  if (this.filter.date_added === true) {
                      result = result.sort((a,b) => {
                          return new Date(b.pivot.position) - new Date(a.pivot.position)
                      })
                  }

                  if (this.filter.rate === true) {
                      result = result.sort((a,b) => {
                          return a.pivot.rating - b.pivot.rating
                      })
                  }

                  return result;
              }
          }
      }
  }
</script>
