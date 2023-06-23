<script lang="ts" setup>
defineExpose({
	Hello() {
		console.log('Hi!');
	}
});
</script>

<script lang="ts">
import { Singleton } from '..';

export default Singleton({
	name: 'SingletonComponent'
});
</script>

<style scoped>
</style>

<template>
	<label>Hello World!</label>
</template>
