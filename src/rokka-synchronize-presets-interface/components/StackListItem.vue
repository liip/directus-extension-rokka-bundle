<template>
	<v-list-item block :class="status">
		<v-list-item-content>
			<div class="name">{{ name }}</div>
		</v-list-item-content>
	</v-list-item>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { DiffStatus } from '../../types/types';

defineProps({
	name: {
		type: String,
		required: true,
	},
	status: {
		type: Object as PropType<DiffStatus>,
		required: true,
	},
});
</script>
<style scoped>
.name {
	font-family: var(--family-monospace);
}
.created {
	--v-list-item-border-color: var(--success) !important;
}

.updated {
	--v-list-item-border-color: var(--warning) !important;
}

.deleted {
	--v-list-item-border-color: var(--danger) !important;
}
</style>
