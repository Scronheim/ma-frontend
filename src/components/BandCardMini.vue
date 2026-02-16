<template>
  <div
    class="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:bg-gray-750 transition-colors duration-150 cursor-pointer"
    @click="$emit('click', band)"
  >
    <div class="flex items-start space-x-3">
      <!-- Аватар/лого группы -->
      <div class="w-12 h-12 bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
        <img v-if="band.logo_url" :src="band.logo_url" :alt="band.name" class="w-full h-full object-cover" />
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

<script setup lang="ts">
import type { ShortBand } from '../types'

defineProps<{
  band: ShortBand
}>()

defineEmits<{
  (e: 'click', band: ShortBand): void
}>()
</script>
