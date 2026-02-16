<template>
  <div
    class="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:bg-gray-750 transition-colors duration-150 cursor-pointer"
    @click="$emit('click', album)"
  >
    <div class="flex items-start space-x-3">
      <!-- Обложка альбома -->
      <div class="w-12 h-12 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
        <img v-if="album.cover_url" :src="album.cover_url" :alt="album.title" class="w-full h-full object-cover" />
        <span v-else class="text-xl">💿</span>
      </div>

      <div class="flex-1 min-w-0">
        <h3 class="font-bold text-white truncate">{{ album.title }}</h3>
        <p class="text-sm text-gray-400 truncate">{{ album.band_names.join(', ') }}</p>
        <div class="flex items-center mt-1 text-xs text-gray-500">
          <span>{{ album.type }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShortAlbum } from '../types'

const props = defineProps<{
  album: ShortAlbum
}>()

defineEmits<{
  (e: 'click', album: ShortAlbum): void
}>()
</script>
