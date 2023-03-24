<template>
	<RemoveButton :rokkaClient="rokkaClient" :hash="imageMetadata.hash" @input="reemit" />
	<FocusPointSelector :rokkaClient="rokkaClient" :imageMetadata="imageMetadata" @input="reemit" />
</template>
<script setup lang="ts">
import { Sourceimage } from 'rokka/dist/apis/sourceimages';
import { PropType } from 'vue';
import { RokkaClient } from '../../types/types';
import RemoveButton from './RemoveButton.vue';
import FocusPointSelector from './FocusPointSelector.vue';

defineProps({
	rokkaClient: {
		type: Object as PropType<RokkaClient>,
		required: true,
	},
	imageMetadata: {
		type: Object as PropType<Sourceimage>,
		required: true,
	},
});

const emit = defineEmits(['input']);

const reemit = (hash) => emit('input', hash);
</script>
