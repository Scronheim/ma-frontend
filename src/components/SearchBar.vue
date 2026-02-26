<template>
  <div class="flex gap-2">
    <input
      placeholder="Поиск..."
      class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
      @keypress.enter="performSearch"
      v-model.number="searchQuery"
    />
    <select
      v-model="selectedSearchField"
      class="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
    >
      <option value="band">Группа</option>
      <option value="album">Альбом</option>
    </select>
    <button
      @click="performSearch"
      :disabled="store.bandIsLoading"
      class="px-4 py-2 bg-gray-600 hover:bg-red-700 text-white rounded-lg cursor-pointer"
    >
      Искать
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useStore } from '@/store/store'

const emits = defineEmits(['closeMenu'])

const router = useRouter()
const store = useStore()

const searchQuery = ref('')
const selectedSearchField = ref('band')

const performSearch = () => {
  if (searchQuery.value.trim()) {
    emits('closeMenu')
    router.push({ path: '/search', query: { type: selectedSearchField.value, q: searchQuery.value } })
  }
}
</script>
