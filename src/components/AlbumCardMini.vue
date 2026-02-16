<template>
  <div
    class="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:bg-gray-750 transition-colors duration-150 cursor-pointer relative group"
    @click="$emit('click', album)"
  >
    <button
      @click.stop="$emit('remove', album)"
      class="absolute top-2 right-2 w-8 h-8 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
      :aria-label="`Remove ${album.title} from favorites`"
    >
      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <div class="flex items-start space-x-3">
      <!-- Обложка альбома -->
      <div class="w-14 h-14 bg-gray-700 rounded shrink-0 flex items-center justify-center overflow-hidden">
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
  (e: 'remove', album: ShortAlbum): void
}>()
</script>
