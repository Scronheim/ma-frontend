<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import { useRoute } from 'vue-router'
import { ElContainer, ElAside, ElMain } from 'element-plus'

import { usePlayerStore } from './store/player'
import { useStore } from './store/store'

import SearchBar from './components/SearchBar.vue'
import SideMenu from './components/SideMenu.vue'
import AudioPlayer from './components/AudioPlayer.vue'
import { Icon } from '@iconify/vue'

const route = useRoute()

const store = useStore()
const playerStore = usePlayerStore()
const audioPlayerRef = ref<InstanceType<typeof AudioPlayer>>()

// Состояние мобильного меню
const mobileMenuOpen = ref(false)
const searchMenuOpen = ref(false)

// Предоставляем плеер для дочерних компонентов
provide('audioPlayer', audioPlayerRef)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const handlePlayerClose = () => {
  playerStore.clearPlaylist()
}

const handleTrackChange = (track: any) => {
  playerStore.setCurrentTrack(track)
}

onMounted(() => {
  store.connectToEvents()
  store.checkToken()
  document.documentElement.classList.add('dark')

  // Закрываем меню при изменении размера окна на десктоп
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      mobileMenuOpen.value = false
    }
  })
})
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 font-sans">
    <!-- Хедер с кнопкой меню для мобильных -->
    <header class="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 shadow-lg">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <!-- Кнопка гамбургер для мобильных -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-lg">M</span>
            </div>
            <span class="text-xl font-bold tracking-tighter">METAL ARCHIVES</span>
          </router-link>
        </div>

        <!-- Поиск для десктопа -->
        <div v-if="route.fullPath !== '/'" class="hidden md:block w-96">
          <SearchBar />
        </div>
        <button
          v-if="route.fullPath !== '/'"
          @click="searchMenuOpen = !searchMenuOpen"
          class="md:hidden text-gray-300 hover:text-white"
        >
          <Icon :icon="searchMenuOpen ? 'mdi:close' : 'mdi:search'" width="24" height="24" />
        </button>
      </div>

      <!-- Поиск для мобильных (под хедером) -->

      <div
        v-if="route.fullPath !== '/' && searchMenuOpen"
        class="md:hidden bg-gray-800 px-4 py-3 border-t border-gray-700"
      >
        <SearchBar />
      </div>
    </header>

    <el-container class="min-h-[calc(100vh-64px)]">
      <!-- Десктопное меню (el-aside) -->
      <el-aside width="260px" class="hidden md:block bg-gray-800 border-r border-gray-700">
        <SideMenu @close-menu="mobileMenuOpen = false" />
      </el-aside>

      <!-- Мобильное меню (оверлей) -->
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-300 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 md:hidden">
          <!-- Меню -->
          <el-aside
            width="100%"
            class="relative h-full bg-gray-800 border-r border-gray-700 shadow-2xl overflow-y-auto"
          >
            <div class="p-4">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold text-lg">M</span>
                  </div>
                  <span class="text-xl font-bold">METAL ARCHIVES</span>
                </div>
                <button
                  @click="mobileMenuOpen = false"
                  class="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <SideMenu @item-click="mobileMenuOpen = false" />
            </div>
          </el-aside>
        </div>
      </Transition>

      <!-- Основной контент (el-main) -->
      <el-main class="p-0 bg-gray-900">
        <div class="container mx-auto px-1 py-3">
          <router-view />
        </div>
      </el-main>
    </el-container>

    <!-- Аудио плеер -->
    <AudioPlayer
      ref="audioPlayerRef"
      :playlist="playerStore.playlist"
      :current-track-index="playerStore.trackIndex"
      :autoplay="true"
      @close="handlePlayerClose"
      @track-change="handleTrackChange"
    />
  </div>
</template>

<style>
/* @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap'); */

body {
  font-family: 'Roboto Condensed', sans-serif;
  margin: 0;
  padding: 0;
}

/* Стили для скроллбара */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Переопределение стилей Element Plus для темной темы */
.el-aside {
  background-color: #1f2937;
  border-right: 1px solid #374151;
  transition: all 0.3s ease;
}

.el-main {
  background-color: #111827;
  padding: 0;
}

/* Адаптивность для мобильных */
@media (max-width: 768px) {
  .el-aside {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 50;
  }
}
</style>
