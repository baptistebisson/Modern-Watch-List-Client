<template keep-alive>
    <div>
        <div class="row">
            <div class="col-md-6 col-lg-4 col-sm-12 mb-4">
                <div class="card">
                    <div class="user_picture">
                        <img src="static/img/user.svg" alt="User picture">
                    </div>
                    <div class="user_data">
                        <ul>
                            <li>
                                <span class="titre">Name</span>
                                <span class="data">{{ user.name }}</span>
                            </li>
                            <li>
                                <span class="titre">Email</span>
                                <span class="data">{{ user.email }}</span>
                            </li>
                            <li>
                                <span class="titre">Number of movies</span>
                                <span class="data">{{ ajax.total }}</span>
                            </li>
                            <li>
                                <span class="titre">Total hours</span>
                                <span class="data">{{ readable(ajax.hours) }}</span>
                            </li>
                            <li>
                                <span class="titre">Top actors</span>
                                <span class="data" v-for="(list, index) in ajax.top_actors">
                                    <span>{{ list.name }}, {{ list.total }} movies</span>
                                </span>
                            </li>
                        </ul>
                        <div class="form-group">
                            <button type="button" class="btn btn-danger btn-sm"><i class="material-icons">delete_forever</i> Delete account</button>
                            <button type="button" class="btn btn-danger btn-sm"><i class="material-icons">delete</i> Reset movie list</button>
                            <button type="button" class="btn btn-info btn-sm"><i class="material-icons">file_download</i> Export list</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-8 col-sm-12">
                <div class="row">
                    <div class="col-md-12 col-lg-6 col-sm-6 mb-4">
                        <div class="card card-m">
                            <h2>Top genres</h2>
                            <div class="content">
                                <canvas id="genre-chart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12 col-lg-6 col-sm-6 mb-4">
                        <div class="card card-m">
                            <h2>Biggest gross</h2>
                            <div class="content big-number">
                                <span class="number">{{ gross }}</span>
                                <span class="title">{{ gross_title }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12 col-lg-6 col-sm-6 mb-4">
                        <div class="card card-m">
                            <h2>Biggest budget</h2>
                            <div class="content big-number">
                                <span class="number">{{ budget }}</span>
                                <span class="title">{{ budget_title }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="card card-m">
                    <h2>Watch list usage</h2>
                    <div class="content">
                        <canvas id="days-chart" height="70"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Chart from 'chart.js'
import numeral from 'numeral'

export default {
    beforeCreate () {
        document.body.className = 'user';
    },
    data () {
        return {
            user: JSON.parse(localStorage.getItem('user')),
            ajax: [],
            config: [],
            genres: {
                labels: [],
                values: [],
            },
            days: {
                labels: [],
                values: [],
            },
            gross: 0,
            budget: 0,
            gross_title: "",
            budget_title: "",
        }
    },
    mounted() {
        this.$http.get('http://api.baptiste-bisson.com/user/stats', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            },
            id: 1,
        }).then((response) => {
            this.ajax = response.body;
            this.gross = numeral(this.ajax.gross.gross).format('$0.00a');
            this.budget = numeral(this.ajax.budget.budget).format('$0.00a');
            this.gross_title = this.ajax.gross.title;
            this.budget_title = this.ajax.budget.title;

            this.genres.labels = response.body.genres.labels;
            this.genres.values = response.body.genres.data;
            this.days.labels = response.body.days.labels;
            this.days.values = response.body.days.data;

            this.createChart("genres");
            this.createChart("days");
        }, () => {

        })
    },
    methods: {
        readable(duration) {
            var hours = Math.floor(duration/60);
            var minutes = duration % 60;
            return hours + 'h ' + minutes + 'm';
        },
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        createChart(type) {
            if (type === "genres") {
                var data = {
                    labels: this.genres.labels,
                    datasets: [
                        {
                            data: this.genres.values,
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(255, 159, 64)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(54, 162, 235)',
                                'rgb(153, 102, 255)',
                                'rgb(201, 203, 207)'
                            ],
                            label: 'My dataset'
                        }]
                };

                var ctx = document.getElementById('genre-chart').getContext('2d');
                new Chart(ctx, {
                    type: 'pie',
                    data: data,
                    options: {
                        responsive: true,
                        legend: {
                            position: 'right'
                        }
                    }
                });
            } else if (type === "days") {
                var data = {
                    labels: this.days.labels,
                    datasets: [
                        {
                            data: this.days.values,
                            backgroundColor: [
                                'rgba(195, 104, 104, 0.2)',
                            ],
                            borderColor: [
                                '#c36868',
                            ],
                            label: 'Movies'
                        }]
                };

                var ctx = document.getElementById('days-chart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: data,
                    options: {
                        responsive: true,
                        legend: {
                            display: false,
                        }
                    }
                });
            }
        }
    }
}
</script>
