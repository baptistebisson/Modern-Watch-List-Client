<template>
    <div class="container">
        <h1>Reorder movies</h1>
        <div class="row">
            <div class="card sort full_width">
                <draggable :list="list" class="sort_movies">
                    <div v-for="item in list" class="movie_item">
                        <img v-bind:src="'https://res.cloudinary.com/dsxar8lse/image/upload/c_scale,h_278,w_185/v1526292604/movie/p/'+item.image_api" v-bind:alt="item.title">
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
        name: 'reorder',
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
                const newList = [];
                var tmp = this.list.length;
                for (const key in this.list) {
                    if (this.list.hasOwnProperty(key)) {
                        newList.push({
                            'id': this.list[key].id,
                            'position': tmp
                        });
                        tmp--;
                    }
                }

                const notyf = new Notyf();
                this.$http.post('https://api.baptiste-bisson.com/movie/move', {
                    movies: newList,
                }).then((response) => {
                    if (response.body.error === false) {
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
