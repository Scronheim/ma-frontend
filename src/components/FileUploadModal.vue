<template>
  <Modal
    v-model="visible"
    :title="title"
    :size="size"
    :show-footer="true"
    :confirm-text="confirmText"
    :cancel-text="cancelText"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClose"
  >
    <div v-if="props.progress !== 0" class="progress-container" id="progressContainer">
      <div class="progress-bar" id="progressBar" :style="{ width: `${props.progress}%` }">{{ Math.round(props.progress) }}%</div>
    </div>
    <div
      v-else
      ref="dropZoneRef"
      class="drop-zone relative border-2 border-dashed rounded-lg p-8 cursor-pointer"
      :class="[hasFiles ? 'bg-gray-750' : '']"
      @click="triggerFileSelect"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover="handleDragOver"
      @drop="handleDrop"
    >
      <input ref="fileInputRef" type="file" :multiple="multiple" :accept="accept" class="hidden" @change="handleFileSelect" />

      <div v-if="!hasFiles" class="text-center">
        <Icon class="w-16 h-16 mx-auto mb-4 text-gray-500" icon="mdi:cloud-arrow-up" />
        <p class="text-lg font-medium text-gray-300 mb-2">
          {{ isDragging ? 'А теперь брось их сюда' : 'Перетяни файлы сюда' }}
        </p>
        <p class="text-sm text-gray-500 mb-4">или</p>
        <button type="button" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium" @click.stop="triggerFileSelect">Выбери файлы</button>
        <p v-if="accept" class="text-xs text-gray-500">Разрешённые форматы: {{ accept.split(',').join(', ') }}</p>
      </div>

      <!-- Список выбранных файлов -->
      <div v-else>
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-300">Выбранные файлы ({{ files.length }})</h3>
          <button @click.stop="clearFiles" class="text-xs text-gray-400 hover:text-white">Очистить всё</button>
        </div>

        <div class="max-h-60 overflow-y-auto">
          <div
            v-for="(file, index) in files"
            :key="file.name"
            class="flex items-center p-1 bg-gray-750 rounded-lg group"
            :class="{
              'border border-red-500': file.error,
              'border border-green-500': file.status === 'uploaded'
            }"
          >
            <!-- Иконка файла -->
            <div class="flex-shrink-0 mr-3">
              <Icon class="w-8 h-8" icon="mdi:file-music" />
            </div>

            <!-- Информация о файле -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-sm font-medium text-white wrap-break-word" :title="file.name">
                    {{ file.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ formatFileSize(file.size) }}
                  </p>
                </div>

                <!-- Статус -->
                <div class="flex items-center space-x-2">
                  <span v-if="file.status === 'uploading'" class="text-xs text-blue-400">{{ file.progress }}%</span>
                  <span v-else-if="file.status === 'uploaded'" class="text-xs text-green-400">Загружен</span>
                  <span v-else-if="file.error" class="text-xs text-red-400">Ошибка</span>
                </div>
              </div>

              <!-- Прогресс бар -->
              <div v-if="file.status === 'uploading'" class="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-blue-500 transition-all duration-300" :style="{ width: file.progress + '%' }"></div>
              </div>

              <!-- Сообщение об ошибке -->
              <p v-if="file.error" class="text-xs text-red-400 mt-1">
                {{ file.error }}
              </p>
            </div>

            <!-- Кнопка удаления -->
            <button @click.stop="removeFile(index)" class="ml-2 p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100">
              <Icon class="w-4 h-4" icon="mdi:close" />
            </button>
          </div>
        </div>

        <!-- Кнопка добавления ещё файлов -->
        <button
          @click.stop="triggerFileSelect"
          class="w-full mt-2 py-2 border border-gray-700 border-dashed rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-600"
        >
          + Добавить ещё файлов
        </button>
      </div>
    </div>

    <!-- Предпросмотр для изображений -->
    <div v-if="previewImage && props.progress === 0" class="border-t border-gray-700 pt-4">
      <h4 class="text-sm font-medium text-gray-300 mb-3">Предпросмотр картинок</h4>
      <div class="bg-gray-750 rounded-lg p-2 flex items-center justify-center">
        <img :src="previewImage" alt="Preview" class="max-h-48 max-w-full object-contain rounded" />
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import Modal from './Modal.vue'
import { Icon } from '@iconify/vue'

export interface UploadFile {
  file: File
  name: string
  size: number
  type: string
  status: 'pending' | 'uploading' | 'uploaded' | 'error'
  progress: number
  error?: string
  preview?: string
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    multiple?: boolean
    progress?: number
    accept?: string
    showOptions?: boolean
    albumMode?: boolean
    folders?: { name: string; path: string }[]
    confirmText?: string
    cancelText?: string
    autoUpload?: boolean
  }>(),
  {
    modelValue: false,
    title: 'Загрузка файлов',
    size: 'lg',
    multiple: true,
    progress: 0,
    accept: '.jpg,.jpeg,.png,.mp3,.flac,.wav,.ogg,.m4a,.zip,.7z,.rar,audio/*',
    showOptions: true,
    albumMode: false,
    folders: () => [],
    confirmText: 'Загрузить',
    cancelText: 'Закрыть',
    autoUpload: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'upload', files: File[]): void
  (e: 'cancel'): void
  (e: 'close'): void
  (e: 'file-add', file: UploadFile): void
  (e: 'file-remove', file: UploadFile): void
}>()

// Состояние
const visible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})
const fileInputRef = ref<HTMLInputElement | null>(null)
const dropZoneRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const files = ref<UploadFile[]>([])

// Вычисляемые свойства
const hasFiles = computed(() => files.value.length > 0)

const totalSize = computed(() => {
  return files.value.reduce((sum, file) => sum + file.size, 0)
})

const previewImage = computed(() => {
  const imageFile = files.value.find(f => f.type.startsWith('image/') && f.preview)
  return imageFile?.preview
})

// Методы
const triggerFileSelect = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    addFiles(Array.from(input.files))
  }
  // Очищаем input для возможности повторного выбора того же файла
  input.value = ''
}

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()

  if (dropZoneRef.value && !dropZoneRef.value.contains(event.relatedTarget as Node)) {
    isDragging.value = false
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = true
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  isDragging.value = false

  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

const addFiles = (newFiles: File[]) => {
  newFiles.forEach(file => {
    // Проверка типа (если указан accept)
    if (props.accept !== '*/*') {
      const acceptedTypes = props.accept.split(',').map(t => t.trim())
      const fileType = file.type || getExtension(file.name)
      const isAccepted = acceptedTypes.some(type => fileType.includes(type.replace('*', '')) || file.name.toLowerCase().endsWith(type.replace('.', '')))

      if (!isAccepted) {
        addFileWithError(file, `File type not allowed. Accepted: ${props.accept}`)
        return
      }
    }

    // Создание предпросмотра для изображений
    let preview: string | undefined
    if (file.type.startsWith('image/')) {
      preview = URL.createObjectURL(file)
    }

    const uploadFile: UploadFile = {
      file,
      name: file.name,
      size: file.size,
      type: file.type || getExtension(file.name),
      status: 'pending',
      progress: 0,
      preview
    }

    files.value.push(uploadFile)
    emit('file-add', uploadFile)
  })
}

const addFileWithError = (file: File, error: string) => {
  const uploadFile: UploadFile = {
    file,
    name: file.name,
    size: file.size,
    type: file.type || getExtension(file.name),
    status: 'error',
    progress: 0,
    error
  }
  files.value.push(uploadFile)
}

const removeFile = (index: number) => {
  const file = files.value[index]

  // Очищаем предпросмотр
  if (file.preview) {
    URL.revokeObjectURL(file.preview)
  }

  files.value.splice(index, 1)
  emit('file-remove', file)
}

const clearFiles = () => {
  // Очищаем все предпросмотры
  files.value.forEach(file => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview)
    }
  })
  files.value = []
}

const getExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || ''
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleConfirm = async () => {
  emit(
    'upload',
    files.value.flatMap(f => f.file)
  )
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}

const handleClose = () => {
  // Очищаем все предпросмотры при закрытии
  clearFiles()
  emit('close')
}

// Очистка предпросмотров при размонтировании
watch(visible, newVal => {
  if (!newVal) {
    clearFiles()
  }
})

defineExpose({
  clearFiles
})
</script>

<style scoped>
.drop-zone {
  min-height: 200px;
}

.drop-zone.dragging {
  transform: scale(1.02);
}

/* Анимация для появления файлов */
.file-item-enter-active,
.file-item-leave-active {
  transition: all 0.3s ease;
}

.file-item-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.file-item-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.progress-container {
  height: 17px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  display: block;
}

.progress-bar {
  height: 100%;
  width: 0%;
  background-color: #4caf50;
  font-size: small;
  text-align: center;
  transition: width 0.3s;
}
</style>
