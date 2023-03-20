<template>
	<SyncStatus :hash="value" />
</template>
<script setup lang="ts">
import { useRokkaClient } from '../composables/useClient';
import SyncStatus from './SyncStatus.vue';

const props = defineProps({
	value: {
		type: String,
		default: null,
	},
});

const emit = defineEmits(['input']);
</script>
