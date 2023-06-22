<script lang="ts" setup>

</script>

<script lang="ts">
import { Singleton, WaitFor, singletons as s } from '..';
import Component from './SingletonComponent.vue';

(async () => {
	await WaitFor('Component');

	let component = Component.Self();
	let this_is_the_same = Component.This();
	let this_is_also_the_same = Singleton('Component');
	let this_is_the_same_as_well = s.Component;

	component.Hello();
})();
</script>

<style scoped>
</style>

<template>
	<label>Hi World!</label>
</template>
