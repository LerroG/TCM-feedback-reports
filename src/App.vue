<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import {
	NMessageProvider,
	NConfigProvider,
	NNotificationProvider
} from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import { ref } from 'vue'

const themeOverrides = ref<GlobalThemeOverrides>({
	common: {
		primaryColor: '#bb7e69',
		primaryColorHover: '#a5634c',
		primaryColorPressed: '#8f4f3c',
		primaryColorSuppl: '#d0a18c'
	}
})
</script>

<template>
	<AppLayout>
		<RouterView v-slot="{ Component }">
			<n-message-provider>
				<n-notification-provider>
					<n-config-provider :theme-overrides="themeOverrides" abstract>
						<Transition mode="out-in">
							<component :is="Component" />
						</Transition>
					</n-config-provider>
				</n-notification-provider>
			</n-message-provider>
		</RouterView>
	</AppLayout>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	@apply transition-all duration-300 ease-out;
}

.v-enter-from {
	@apply opacity-0 translate-x-10;
}

.v-leave-to {
	@apply opacity-0 -translate-x-10;
}
</style>
