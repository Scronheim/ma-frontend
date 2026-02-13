<script setup lang="ts">
import { type PropType } from 'vue'

import type { MemberBand } from '@/types'

defineProps({
  bands: {
    type: Object as PropType<MemberBand[]>,
    required: true
  }
})
</script>

<template>
  <div v-for="band in bands" :key="band.name">
    <router-link v-if="band.id" :to="`/bands/${band.name_slug}/${band.id}`" class="text-blue-400 font-bold">
      {{ band.name }}
    </router-link>
    <p v-else class="font-bold">{{ band.name }}</p>
    <p class="text-sm">{{ band.role }}</p>
    <table v-if="band.albums.length" class="w-full">
      <thead>
        <tr>
          <th class="text-left py-3">Дата релиза</th>
          <th class="text-left py-3 px-3">Название</th>
          <th class="text-left py-3 px-3">Роль</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="album in band.albums"
          :key="album.title"
          class="cursor-pointer"
          @click="$router.push(`/albums/${band.name_slug}/${album.title_slug}/${album.id}`)"
        >
          <td class="py-3">{{ album.release_date }}</td>
          <td class="py-3 px-3 font-medium">
            <div class="flex items-center space-x-3">
              <span>{{ album.title }}</span>
            </div>
          </td>
          <td class="py-3 px-3">
            <span class="px-2 py-1 bg-gray-700 rounded text-xs">{{ album.role }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <el-divider />
  </div>
</template>
