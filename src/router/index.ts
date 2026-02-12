import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BandView from '../views/BandView.vue'
import AlbumView from '../views/AlbumView.vue'
import SearchResultsView from '../views/SearchResultsView.vue'
import StatsView from '../views/StatsView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/bands/:bandName/:id',
      name: 'bands',
      component: BandView,
      props: true
    },
    {
      path: '/albums/:bandName/:albumName/:id',
      name: 'albums',
      component: AlbumView,
      props: true
    },
    {
      path: '/search',
      name: 'search',
      component: SearchResultsView,
      props: route => ({ query: route.query.q })
    },
    {
      path: '/stats',
      name: 'stats',
      component: StatsView
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
