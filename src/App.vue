<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 font-sans">
    <header class="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 shadow-lg">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <span class="text-white font-bold text-lg">M</span>
          </div>
          <span class="text-xl font-bold tracking-tighter">METAL ARCHIVES</span>
        </router-link>

        <div v-if="!isMainPage" class="hidden md:block">
          <SearchBar />
        </div>

        <!-- Мобильное меню -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-gray-300 hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="mobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Мобильное меню (раскрывающееся) -->
      <div v-if="!isMainPage && mobileMenuOpen" class="md:hidden bg-gray-800 px-4 py-3 border-t border-gray-700">
        <div class="mb-4">
          <SearchBar />
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useStore } from './store/store'

import SearchBar from './components/SearchBar.vue'

const route = useRoute()

const store = useStore()

const mobileMenuOpen = ref(false)

const isMainPage = computed((): boolean => route.path === '/')

onMounted(() => {
  store.connectToEvents()
})
</script>

<style>
/* Существующие стили остаются без изменений */
</style>
