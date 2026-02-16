<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Close } from '@element-plus/icons-vue'

import type { ShortBand } from '../types'

defineProps<{
  band: ShortBand
}>()

defineEmits<{
  (e: 'click', band: ShortBand): void
  (e: 'remove', band: ShortBand): void
}>()

const route = useRoute()
</script>

<template>
  <div
    class="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:bg-gray-750 transition-colors duration-150 cursor-pointer relative"
    @click="$emit('click', band)"
  >
    <button
      v-if="!route.params.username"
      @click.stop="$emit('remove', band)"
      class="absolute top-2 right-2 w-8 h-8 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center cursor-pointer"
    >
      <el-icon>
        <Close />
      </el-icon>
    </button>
    <div class="flex items-start space-x-3">
      <div class="w-14 h-14 bg-gray-700 rounded shrink-0 flex items-center justify-center overflow-hidden">
        <img v-if="band.logo_url" :src="band.logo_url" :alt="band.name" class="w-full h-full object-cover" />
        <img
          v-else-if="!band.logo_url && band.photo_url"
          :src="band.photo_url"
          :alt="band.name"
          class="w-full h-full object-cover"
        />
        <span v-else class="text-xl">🎸</span>
      </div>

      <div class="flex-1 min-w-0">
        <h3 class="font-bold text-white truncate">{{ band.name }}</h3>
        <p class="text-sm text-gray-400 truncate">{{ band.genres }}</p>
        <div class="flex items-center mt-1 text-xs text-gray-500">
          <span>{{ band.country }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
