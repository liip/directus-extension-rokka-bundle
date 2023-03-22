<template>
	<RemoveButton :rokkaClient="rokkaClient" :hash="image.hash" @input="(hash) => emit('input', hash)" />
</template>
<script setup lang="ts">
import { Sourceimage } from 'rokka/dist/apis/sourceimages';
import { PropType } from 'vue';
import { RokkaClient } from '../types/types';
import RemoveButton from './removeButton.vue';

defineProps({
	rokkaClient: {
		type: Object as PropType<RokkaClient>,
		required: true,
	},
	image: {
		type: Object as PropType<Sourceimage>,
		required: true,
	},
});

const emit = defineEmits(['input']);
</script>
