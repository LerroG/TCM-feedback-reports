<script setup lang="ts">
// import Sidebar from './default-layout/sidebar/Sidebar.vue'
// import Header from './default-layout/header/Header.vue'
</script>

<template>
	<div class="flex flex-col min-h-screen bg-gray-100">
		<!-- <Header />
		<Sidebar /> -->

		<main class="xl:ml-64 mt-3">
			<slot />
		</main>
	</div>
</template>
