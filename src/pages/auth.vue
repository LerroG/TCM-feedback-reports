<script setup lang="ts">
import { authService } from '@/services/auth.service'
import { IAuthForm } from '@/types/auth.interface'
import type { FormInst, FormRules } from 'naive-ui'
import {
	NForm,
	NFormItem,
	NInput,
	NButton,
	NSpace,
	NH1,
	useMessage,
	useNotification
} from 'naive-ui'
import { ref } from 'vue'

const { error } = useNotification()
const message = useMessage()

const isLoading = ref(false)
const formRef = ref<FormInst | null>(null)
const formValue = ref<IAuthForm>({
	Username: '',
	Password: ''
})

const rules: FormRules = {
	Username: {
		required: true,
		message: 'Пожалуйста, введите имя пользователя',
		trigger: 'blur'
	},
	Password: {
		required: true,
		message: 'Пожалуйста, введите пароль',
		trigger: 'blur'
	}
}

const handleSubmit = async (e: MouseEvent) => {
	e.preventDefault()

	formRef.value?.validate(async errors => {
		if (errors) {
			message.error('Неверные данные')
			return
		}

		isLoading.value = true

		try {
			const response = await authService.login(formValue.value)

			// Обработка ошибок от сервера
			if (response && response.data.Code < 0) {
				error({
					title: 'Произошла ошибка',
					content: response.data.Msg,
					duration: 3000,
					keepAliveOnHover: true
				})
			}
		} catch (error) {
			message.error('Ошибка при входе. Попробуйте снова!')
		} finally {
			isLoading.value = false
		}
	})
}
</script>

<template>
	<div class="bg_image w-full h-full flex justify-end">
		<div class="w-full xl:w-1/2 flex justify-center items-center">
			<n-space class="w-4/5 md:w-2/5 2xl:w-1/3" vertical>
				<n-h1 class="font-bold text-5xl text-center">Вход</n-h1>
				<n-form ref="formRef" :model="formValue" :rules="rules">
					<n-form-item label="Имя пользователя" path="Username">
						<n-input
							v-model:value="formValue.Username"
							placeholder="Имя пользователя"
							round
						/>
					</n-form-item>
					<n-form-item label="Пароль" path="Password">
						<n-input
							v-model:value="formValue.Password"
							show-password-on="click"
							type="password"
							placeholder="Пароль"
							round
						/>
					</n-form-item>
					<n-space justify="center">
						<n-button
							round
							@click="handleSubmit"
							type="primary"
							size="large"
							:loading="isLoading"
						>
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

@media (max-width: 1280px) {
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
