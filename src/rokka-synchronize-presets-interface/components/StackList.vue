<template>
	<v-list class="list">
		<StackListItem
			v-for="rokkaStackDiff in rokkaStackDiffs"
			:key="rokkaStackDiff.stack.name"
			:name="rokkaStackDiff.stack.name"
			:status="rokkaStackDiff.status"
		/>
	</v-list>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { RokkaStackDiff } from '../../types/types';
import StackListItem from './StackListItem.vue';

defineProps({
	rokkaStackDiffs: {
		type: Array as PropType<RokkaStackDiff[]>,
		required: true,
	},
});
</script>
<style>
.list {
	margin: 0 var(--form-horizontal-gap);
}
</style>
