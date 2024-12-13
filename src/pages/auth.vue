<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui'
import { NForm, NFormItem, NInput, NButton, NSpace, NH1 } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

interface ModelType {
	username: string
	password: string
}

const formRef = ref<FormInst | null>(null)
const message = useMessage()
const formValue = ref<ModelType>({
	username: '',
	password: ''
})

const rules: FormRules = {
	username: {
		required: true,
		message: 'Пожалуйста введите имя пользователя',
		trigger: 'blur'
	},
	password: [
		{
			required: true,
			message: 'Пожалуйста введите пароль',
			trigger: 'blur'
		},
		{
			min: 6,
			message: 'Пароль должен содержать не менее 3 символов',
			trigger: 'blur'
		}
	]
}

const handleSubmit = (e: MouseEvent) => {
	e.preventDefault()
	formRef.value?.validate(errors => {
		if (!errors) {
			message.success('Вход выполнен')
		} else {
			console.log(errors)
			message.error('Неверные данные')
		}
	})
}
</script>

<template>
	<div class="bg_image w-full h-full flex justify-end">
		<div class="w-full xl:w-1/2 flex justify-center items-center">
			<n-space class="w-4/5 md:w-2/5 2xl:w-1/3" vertical>
				<n-h1 class="font-bold text-5xl text-center">Вход</n-h1>
				<n-form
					:label-width="100"
					ref="formRef"
					:model="formValue"
					:rules="rules"
				>
					<n-form-item label="Имя пользователя" path="username">
						<n-input
							v-model:value="formValue.username"
							placeholder="Имя пользователя"
							round
						/>
					</n-form-item>
					<n-form-item label="Пароль" path="password">
						<n-input
							v-model:value="formValue.password"
							show-password-on="click"
							type="password"
							placeholder="Пароль"
							round
						/>
					</n-form-item>
					<n-space justify="center">
						<n-button round @click="handleSubmit" type="primary" size="large">
							Войти
						</n-button>
					</n-space>
				</n-form>
			</n-space>
		</div>
	</div>
</template>

<style scoped>
.bg_image {
	background-image: url('/auth-bg.png');
}

@media (max-width: 1024px) {
	.bg_image {
		background-image: none;
	}
}

@media (min-width: 1280px) {
	.bg_image {
		background-size: cover;
	}
}
</style>
