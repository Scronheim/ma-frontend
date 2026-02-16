<script setup lang="ts">
import { ref } from 'vue'

import { useStore } from '@/store/store'

import type { FormInstance, FormRules } from 'element-plus'
import type { AuthData } from '@/types'

const store = useStore()

const formRef = ref<FormInstance>()
const form = ref({
  username: '',
  password: ''
})
const rules = ref<FormRules<AuthData>>({
  username: [{ required: true, message: 'Поле обязательное для заполнения', trigger: 'blur' }],
  password: [{ required: true, message: 'Поле обязательное для заполнения', trigger: 'blur' }]
})

const login = () => {
  formRef.value?.validate(valid => {
    if (valid) store.login(form.value.username, form.value.password)
  })
}

const register = () => {
  formRef.value?.validate(valid => {
    if (valid) store.register(form.value.username, form.value.password)
  })
}
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center">
    <div class="w-72">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="auto"
        label-position="top"
        @keypress.enter="login"
      >
        <el-form-item label="Имя пользователя" prop="username">
          <el-input v-model="form.username" placeholder="Введите имя пользователя" />
        </el-form-item>
        <el-form-item label="Пароль" prop="password">
          <el-input v-model="form.password" type="password" placeholder="Введите пароль" />
        </el-form-item>
      </el-form>
      <div class="flex justify-between">
        <el-button type="primary" @click="register">Регистрация</el-button>
        <el-button type="success" @click="login">Войти</el-button>
      </div>
    </div>
  </div>
</template>
