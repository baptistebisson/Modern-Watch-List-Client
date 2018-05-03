<template>
    <div>
        <h1>Reorder movies</h1>
        <div class="row">
            <div class="card sort full_width">
                <draggable :list="list" class="sort_movies">
                    <div v-for="item in list" class="movie_item">
                        <img :src="'http://api.baptiste-bisson.com/img/'+item.image_small" alt="">
                        {{item.title}}
                    </div>
                </draggable>
                <div class="btn_group">
                    <button @click="save" type="button" class="btn btn-sm btn-primary"><i class="material-icons">save</i> Save</button>
                    <button type="button" class="btn btn-sm btn-reset"><i class="material-icons">clear_all</i> Reset</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import router from '@/router'
    import store from '@/store'
    import draggable from 'vuedraggable'

    export default {
        name: 'presentation',
        components: {
            draggable,
        },
        data () {
            return {
                list:[],
            }
        },
        mounted() {
            this.list = JSON.parse(localStorage.getItem("movies"));
        },
        methods: {
            save() {
                var list = new Array();
                for (var key in this.list) {
                    if (this.list.hasOwnProperty(key)) {
                        list.push({
                            'id': this.list[key].id,
                            'position': parseInt(key) + 1
                        });
                    }
                }

                var notyf = new Notyf()
                this.$http.post('http://api.baptiste-bisson.com/movie/move', {
                    movies: list,
                }, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    },
                }).then((response) => {
                    if (response.body.error == false) {
                        //Update data
                        store.dispatch('fetchData', {refresh: true})
                        notyf.confirm(response.body.message);
                    } else {
                        notyf.alert(response.body.message);
                    }
                }, () => {

                })
            },
        }
    }
</script>
