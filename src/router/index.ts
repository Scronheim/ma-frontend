import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BandView from '../views/BandView.vue'
import AlbumView from '../views/AlbumView.vue'
import SearchResultsView from '../views/SearchResultsView.vue'
import StatsView from '../views/StatsView.vue'
import MemberView from '../views/MemberView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/band/view/id/:id',
      name: 'bands view',
      component: BandView
    },
    {
      path: '/bands/:bandName/:id',
      name: 'bands',
      component: BandView
    },
    {
      path: '/albums/:bandName/:albumName/:id',
      name: 'albums',
      component: AlbumView
    },
    {
      path: '/artists/:artistName/:id',
      name: 'artist',
      component: MemberView
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
