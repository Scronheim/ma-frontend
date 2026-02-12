<template>
  <div class="flex items-center flex-col gap-2">
    <el-input
      v-model="searchQuery"
      placeholder="Поиск..."
      :prefix-icon="Search"
      class="w-full bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
      @keypress.enter="performSearch"
    >
      <template #append>
        <el-select v-model="selectedSearchField" style="width: 100px">
          <el-option label="Группа" value="band" />
          <el-option label="Альбом" value="album" />
        </el-select>
      </template>
    </el-input>
    <div>
      <el-button @click="performSearch" :loading="store.bandIsLoading" type="primary">
        Искать в Metal Archives
      </el-button>
      <el-button @click="store.getRandomBand" :loading="store.bandIsLoading" type="info">Мне повезёт</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

import { useStore } from '@/store/store'

const router = useRouter()
const store = useStore()
const searchQuery = ref('')
const selectedSearchField = ref('band')

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { type: selectedSearchField.value, q: searchQuery.value } })
  }
}

// watch(
//   () => route.path,
//   () => {
//     searchQuery.value = ''
//   }
// )
</script>
