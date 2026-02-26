<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

import { useStore } from '@/store/store'

import type { FormInstance, FormRules } from 'element-plus'
import type { AuthData } from '@/types'

const emit = defineEmits<{
  (e: 'closeMenu'): void
}>()

const store = useStore()

const formRef = ref<FormInstance>()
const form = ref({
  username: '',
  password: ''
})
const rules = ref<FormRules<AuthData>>({
  username: [{ required: true, message: 'Поле обязательное для заполнения', trigger: 'blur' }],
  password: [{ required: true, message: 'Поле обязательное для заполнения', trigger: 'blur' }]
})

const login = () => {
  formRef.value?.validate(valid => {
    if (valid) store.login(form.value.username, form.value.password)
  })
}

const register = () => {
  formRef.value?.validate(valid => {
    if (valid) store.register(form.value.username, form.value.password)
  })
}
</script>

<template>
  <div class="py-6">
    <!-- Мои аккаунт -->
    <div class="px-4 mb-3">
      <template v-if="store.userIsAuth">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Мой аккаунт</h3>
        <nav>
          <router-link to="/profile" v-slot="{ isActive }">
            <div
              class="flex items-center space-x-2 py-3 rounded-lg transition-colors duration-200"
              :class="isActive ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'"
            >
              <Icon icon="mdi:account" width="24" height="24" />
              <span>Профиль</span>
            </div>
          </router-link>

          <router-link :to="{ path: '/profile', hash: '#bands' }">
            <div
              class="flex items-center space-x-2 py-3 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-gray-700"
            >
              <Icon icon="mdi:heart-multiple" width="24" height="24" />
              <span>Избранные группы</span>
              <span class="ml-auto bg-gray-700 text-xs px-2 py-1 rounded-full">
                {{ store.user.favorite_bands.length }}
              </span>
            </div>
          </router-link>

          <router-link :to="{ path: '/profile', hash: '#albums' }">
            <div
              class="flex items-center space-x-2 py-3 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-gray-700"
            >
              <Icon icon="mdi:heart-multiple" width="24" height="24" />
              <span>Избранные альбомы</span>
              <span class="ml-auto bg-gray-700 text-xs px-2 py-1 rounded-full">
                {{ store.user.favorite_albums.length }}
              </span>
            </div>
          </router-link>
        </nav>
        <div
          class="flex items-center space-x-2 py-3 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-gray-700 cursor-pointer"
          @click="store.logout"
        >
          <Icon icon="mdi:exit-run" width="24" height="24" />
          <span>Выйти</span>
        </div>
      </template>
      <template v-else>
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Вход/Регистрация</h3>
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="auto"
          label-position="top"
          @keypress.enter="login"
        >
          <el-form-item label="Имя пользователя" prop="username">
            <input
              placeholder="Введите имя пользователя"
              class="w-full px-4 py-1 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
              v-model="form.username"
            />
          </el-form-item>
          <el-form-item label="Пароль" prop="password">
            <input
              type="password"
              placeholder="Введите пароль"
              class="w-full px-4 py-1 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
              v-model="form.password"
            />
          </el-form-item>
        </el-form>
        <div class="flex justify-between">
          <button
            @click="register"
            class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
          >
            Регистрация
          </button>
          <button @click="login" class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer">
            Войти
          </button>
        </div>
      </template>
    </div>
    <!-- Навигация -->
    <div class="px-4">
      <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Навигация</h3>
      <nav class="mb-3">
        <router-link to="/" v-slot="{ isActive }">
          <div
            class="flex items-center space-x-2 py-3 rounded-lg transition-colors duration-200"
            :class="isActive ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'"
            @click="emit('closeMenu')"
          >
            <Icon icon="mdi:home" width="24" height="24" />
            <span>Главная</span>
          </div>
        </router-link>
      </nav>
      <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Группы</h3>
      <nav class="mb-3">
        <router-link to="/browse/letter" v-slot="{ isActive }" @click="emit('closeMenu')">
          <div
            class="flex items-center space-x-2 py-3 rounded-lg transition-colors duration-200"
            :class="isActive ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'"
          >
            <Icon icon="mdi:alphabetical" width="24" height="24" />
            <span>По алфавиту</span>
          </div>
        </router-link>

        <router-link to="/browse/country" v-slot="{ isActive }" @click="emit('closeMenu')">
          <div
            class="flex items-center space-x-2 py-3 rounded-lg transition-colors duration-200"
            :class="isActive ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'"
          >
            <Icon icon="mdi:flag" width="24" height="24" />
            <span>По стране</span>
          </div>
        </router-link>

        <!-- <router-link to="/browse/genre" v-slot="{ isActive }" @click="emit('closeMenu')">
          <div
            class="flex items-center space-x-2 py-3 rounded-lg transition-colors duration-200"
            :class="isActive ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'"
          >
            <Icon icon="mdi:guitar-electric" width="24" height="24" />
            <span>По жанру</span>
          </div>
        </router-link> -->
      </nav>
      <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Разное</h3>
      <nav>
        <router-link to="/artist/rip" v-slot="{ isActive }" @click="emit('closeMenu')">
          <div
            class="flex items-center space-x-2 py-3 rounded-lg transition-colors duration-200"
            :class="isActive ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700'"
          >
            <Icon icon="mdi:grave-stone" width="24" height="24" />
            <span>R.I.P.</span>
          </div>
        </router-link>
        <div
          class="flex items-center space-x-2 py-3 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-gray-700 cursor-pointer"
          @click="store.getRandomBand"
        >
          <Icon v-if="store.randomBandIsLoading" icon="mdi:loading" width="24" height="24" class="animate-spin" />
          <Icon v-else icon="mdi:help-circle" width="24" height="24" />
          <span>Случайная группа</span>
        </div>
      </nav>
    </div>

    <!-- Нижняя часть с доп. ссылками -->
    <div class="px-4 mt-6 border-t border-gray-700">
      <div class="mt-4 text-xs text-gray-500">
        © 2025-2026 Encyclopaedia Metallum
        <br />
        Вся информация взята с сайта
        <el-link href="https://www.metal-archives.com" target="_blank">www.metal-archives.com</el-link>
      </div>
    </div>
  </div>
</template>
