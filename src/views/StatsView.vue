<script setup lang="ts">
import { onMounted } from 'vue'

import { useStore } from '@/store/store'
const store = useStore()

onMounted(async () => {
  await store.getStats()
})
</script>

<template>
  <div v-if="store.statsIsLoading" class="flex items-center justify-center min-h-[60vh]">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p>Идёт загрузка информации...</p>
    </div>
  </div>
  <div
    v-else-if="!store.statsIsLoading && store.stats?.ma"
    class="bg-gray-800 rounded-lg border border-gray-700 py-3 px-6"
  >
    <h2 class="text-2xl font-bold mb-4 text-red-400">Статистика</h2>
    <el-text size="large">
      В базе Metal Archives
      <b>{{ store.stats.ma.bands.total }}</b>
      групп. Активных -
      <span class="active">{{ store.stats.ma.bands.active }}</span>
      , на паузе -
      <span class="on_hold">{{ store.stats.ma.bands.on_hold }}</span>
      , распались -
      <span class="split_up">{{ store.stats.ma.bands.split_up }}</span>
      , сменили название -
      <span class="changed_name">{{ store.stats.ma.bands.changed_name }}</span>
      , неизвестно -
      <span class="unknown">{{ store.stats.ma.bands.unknown }}</span>
      , альбмов -
      <b>{{ store.stats.ma.albums }}</b>
      , треков -
      <b>{{ store.stats.ma.songs }}</b>
    </el-text>
    <br />
    <el-text size="large">
      В нашей локальной базе
      <b>{{ store.stats.local.bands.total }}</b>
      групп. Активных -
      <span class="active">{{ store.stats.local.bands.active }}</span>
      , на паузе -
      <span class="on_hold">{{ store.stats.local.bands.on_hold }}</span>
      , распались -
      <span class="split_up">{{ store.stats.local.bands.split_up }}</span>
      , сменили название -
      <span class="changed_name">{{ store.stats.local.bands.changed_name }}</span>
      , неизвестно -
      <span class="unknown">{{ store.stats.local.bands.unknown }}</span>
      , альбмов -
      <b>{{ store.stats.local.albums }}</b>
      , треков -
      <b>{{ store.stats.local.songs }}</b>
    </el-text>
  </div>
</template>

<style lang="css" scoped>
.active {
  color: #690;
}
.on_hold {
  color: #ded24e;
}
.split_up {
  color: #ac0000;
}
.changed_name {
  color: #4c75e6;
}
.unknown {
  color: #bd632c;
}
</style>
