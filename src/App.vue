<template>
  <el-config-provider :locale="ru">
    <div class="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header class="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 shadow-lg">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-lg">MA</span>
            </div>
            <span class="text-xl font-bold tracking-tighter">METAL ARCHIVES</span>
          </router-link>
          <div class="flex items-center gap-2">
            <div v-if="!isMainPage" class="hidden md:block">
              <SearchBar />
            </div>

            <!-- Мобильное меню -->

            <el-dropdown v-if="store.user.username" placement="bottom" class="cursor-pointer">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :style="{ backgroundColor: store.user.avatar_color }"
              >
                <span class="text-white font-bold text-lg">{{ store.user.username.slice(0, 2).toUpperCase() }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :icon="User" @click="router.push('/profile')">Профиль</el-dropdown-item>
                  <el-divider style="margin-top: 0; margin-bottom: 0" />
                  <el-dropdown-item :icon="SwitchButton" @click="store.logout">Выйти</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <div v-else-if="!store.user.username && !isAuthPage">
              <el-button type="success" @click="router.push('/auth')">Войти</el-button>
            </div>
            <button
              v-if="!isMainPage"
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden text-gray-300 hover:text-white"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  v-if="mobileMenuOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
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
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { User, SwitchButton } from '@element-plus/icons-vue'
import ru from 'element-plus/es/locale/lang/ru'

import { useStore } from './store/store'

import SearchBar from './components/SearchBar.vue'

const route = useRoute()
const router = useRouter()

const store = useStore()

const mobileMenuOpen = ref(false)

const isMainPage = computed((): boolean => route.path === '/')
const isAuthPage = computed((): boolean => route.path === '/auth')

onMounted(() => {
  store.connectToEvents()
  store.checkToken()
})
</script>
