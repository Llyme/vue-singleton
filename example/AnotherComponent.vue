<script lang="ts" setup>

</script>

<script lang="ts">
import { Singleton, WaitFor } from '..';
import Component from './SingletonComponent.vue';

(async () => {
	await WaitFor('Component');

	console.log(Component.Self(), Singleton('Component'));
});
</script>

<style scoped>
</style>

<template>
	<label>Hi World!</label>
</template>
