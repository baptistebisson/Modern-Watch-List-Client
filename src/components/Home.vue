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
                <div class="item" v-for="(value, key, index) in filteredMovies">
                    <div class="movie_card" :data-id="value.id">
                        <div class="cover">
                            <span v-if="value.pivot.rating === 0 && !upcoming(value.release_date)" class="ribbon-wrapper">
                                <span class="ribbon new">New</span>
                            </span>
                            <span v-else-if="upcoming(value.release_date)" class="ribbon-wrapper">
                                <span class="ribbon upcoming">Upcoming</span>
                            </span>
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
                  release_date: false,
                  upcoming_movie: false,
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
          searchMovie: debounce(function () {
              const name = this.movieName;
              console.log(this.search_type)
              if (this.movieName.length >= 3 && this.search_type === true) {
                  this.loader = true
                  this.infoError = false
                  this.$http.post('https://api.baptiste-bisson.com/movie/search', {
                      title: name,
                  }).then((response) => {
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
                          this.$http.post('https://api.baptiste-bisson.com/movie/create', {
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
              this.$http.get('https://api.baptiste-bisson.com/movie/get').then((response) => {
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
          filteredMovies: function () {
              if (store.state.savedData !== null) {
                  let result;

                  // Order by input text
                  if (this.search_type === false) {
                      const name = this.movieName;
                      const regex = new RegExp(name, 'i');

                      result = store.state.savedData.filter((movie) => {
                          return movie.title.match(regex)
                      })
                  } else {
                      result = store.state.savedData;
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
