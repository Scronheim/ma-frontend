<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useStore } from '@/store/store'

import LoadingSpinner from '@/components/LoadingSpinner.vue'
import MemberBands from '@/components/MemberBands.vue'

const route = useRoute()
const store = useStore()

const showPreview = ref<boolean>(false)
const urlList = ref<string[]>([])
const activeTab = ref<string>('active_bands')

const member = computed(() => store.currentMember)

const openImagePreview = (imgList: string[]) => {
  urlList.value = imgList
  showPreview.value = true
}

onMounted(async () => {
  await store.getMemberById(route.params.id)
})
</script>

<template>
  <loading-spinner v-if="store.memberIsLoading" :visible="store.memberIsLoading" />
  <div class="space-y-6" v-else>
    <!-- Заголовок группы -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
      <div class="flex items-center space-x-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold">{{ member.fullname }}</h1>
        </div>
      </div>
    </div>

    <!-- Основная информация -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <!-- Детали группы -->
        <div class="flex flex-col gap-6">
          <div class="w-full bg-gray-800 rounded-lg border border-gray-700 py-3 px-3">
            <h2 class="text-2xl font-bold mb-4 text-red-400">Информация о музыканте</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 class="text-gray-400 text-sm uppercase tracking-wider">Полное имя</h3>
                <p>{{ member.fullname }}</p>
              </div>
              <div>
                <h3 class="text-gray-400 text-sm uppercase tracking-wider">Возраст</h3>
                <p>{{ member.age }}</p>
              </div>
              <div>
                <h3 class="text-gray-400 text-sm uppercase tracking-wider">Место рождения</h3>
                <p>{{ member.place_of_birth }}</p>
              </div>
              <div>
                <h3 class="text-gray-400 text-sm uppercase tracking-wider">Пол</h3>
                <p>{{ member.gender }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Альбомы -->
        <div class="bg-gray-800 rounded-lg border border-gray-700 py-2 px-4">
          <h2 class="text-2xl font-bold mb-4 text-red-400">Группы</h2>
          <div class="overflow-x-auto">
            <el-tabs v-model="activeTab">
              <el-tab-pane v-if="member.active_bands.length" label="Активные" name="active_bands">
                <member-bands :bands="member.active_bands" />
              </el-tab-pane>
              <el-tab-pane v-if="member.past_bands.length" label="Прошлые" name="past_bands">
                <member-bands :bands="member.past_bands" />
              </el-tab-pane>
              <el-tab-pane v-if="member.live.length" label="Live" name="live">
                <member-bands :bands="member.live" />
              </el-tab-pane>
              <el-tab-pane v-if="member.guest_session.length" label="Как гость" name="guest_session">
                <member-bands :bands="member.guest_session" />
              </el-tab-pane>
              <el-tab-pane v-if="member.misc_staff.length" label="Другое" name="misc_staff">
                <member-bands :bands="member.misc_staff" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>

      <!-- Боковая панель -->
      <div class="space-y-6">
        <!-- Фото группы -->
        <div class="bg-gray-800 rounded-lg border border-gray-700 py-3 px-3">
          <h2 class="text-xl font-bold mb-4 text-red-400">Фото</h2>
          <div class="bg-gray-750 rounded-lg overflow-hidden">
            <div
              class="bg-linear-to-br from-gray-700 to-gray-900 flex flex-col items-center justify-center cursor-pointer"
            >
              <template v-if="member.photo_url">
                <img
                  v-if="member.photo_url"
                  :src="member.photo_url"
                  :alt="member.fullname + '_photo'"
                  class="w-full h-full object-cover"
                  @click="openImagePreview([member.photo_url])"
                />
                <el-image-viewer
                  v-if="showPreview"
                  :url-list="urlList"
                  hide-on-click-modal
                  @close="showPreview = false"
                />
              </template>
              <span v-else class="text-5xl">📸</span>
            </div>
          </div>
        </div>
        <!-- Ссылки группы -->
        <div v-if="member.links.length" class="bg-gray-800 rounded-lg border border-gray-700 py-3 px-3">
          <h2 class="text-xl font-bold mb-4 text-red-400">Ссылки</h2>
          <div class="grid grid-cols-2 bg-gray-750 rounded-lg overflow-hidden">
            <el-link
              v-for="link in member.links"
              :key="link.url"
              type="primary"
              underline="never"
              target="_blank"
              :href="link.url"
            >
              {{ link.social }}
            </el-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
