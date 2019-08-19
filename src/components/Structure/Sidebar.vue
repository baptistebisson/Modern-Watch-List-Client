<template lang="html">
    <div class="sidebar">
        <ul>
            <li><router-link to="/"><i class="material-icons">home</i> Home</router-link></li>
            <li class="hasChildren">
                <i class="material-icons">movie</i> Movies <i class="material-icons children-arrow">keyboard_arrow_down</i>
                <ul class="hide">
                    <li><router-link to="/movie/popular"><i class="material-icons">favorite</i> Popular</router-link></li>
                    <li><router-link to="/movie/reorder"><i class="material-icons">sort</i> Reorder</router-link></li>
                </ul>
            </li>
            <li><router-link to="/tv"><i class="material-icons">live_tv</i> Series</router-link></li>
        </ul>
        <footer>
            <span>Created by <a href="https://baptiste-bisson.com">Baptiste Bisson</a></span>
        </footer>
    </div>
</template>

<script>
import {TweenMax, Power4} from 'gsap'
import store from '@/store'

export default {
    name: 'sidebar',
    mounted () {
        TweenMax.set(this.$el, {
            x: - this.$el.offsetWidth
        });

        $('.sidebar a').on('click', function() {
            store.dispatch('toggleSidebar');
        });

        $('.hasChildren').on('click', function(e) {
            var children = $(e.target).find('ul');
            if (children.hasClass('hide')) {
                $('.hasChildren').addClass('active');
                children.removeClass('hide');
            } else {
                $('.hasChildren').removeClass('active');
                children.addClass('hide');
            }
        });
    },
    computed: {
        open () {
            return store.state.ui.sidebarOpen
        }
    },
    watch: {
        open: function (open) {
            const dX = open ? 0 : - this.$el.offsetWidth
            TweenMax.to(this.$el, 0.6, {
                x: dX,
                ease: Power4.easeOut
            })
        }
    }
}
</script>
