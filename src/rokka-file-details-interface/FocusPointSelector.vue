<template>
	<div class="focus-picker-container">
		<img class="focus-picker" :src="imageUrl" @load="e => setupFocusPicker(e.target)"/>
	</div>
	<v-button full-width @click="setFocus">
		<v-progress-circular v-if="loadingSetFocus" class="loader" indeterminate />
		Set
	</v-button>
	<v-button
		:disabled="!props.image.dynamic_metadata?.subject_area"
		full-width
		@click="removeFocus"
	>
		<v-progress-circular v-if="loadingRemoveFocus" class="loader" indeterminate />
		Remove
	</v-button>
</template>
<script setup lang="ts">
import { PropType, ref, inject } from 'vue';
import { FocusPoint, RokkaClient } from '../types/types';
import { FocusPicker } from 'image-focus';
import { Sourceimage } from 'rokka/dist/apis/sourceimages';
import { useApi } from '@directus/extensions-sdk';
import { useFromImageCoordinates, useToImageCoordinates } from '../composables/useFocalPoint';
import { setFocusPoint, removeFocusPoint } from '../composables/useRokka';

const props = defineProps({
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

const api = useApi();
const accessToken = api.defaults.headers.common['Authorization']?.split(' ')[1] || null;
const values = inject('values', ref<Record<string, any>>({}));
const imageUrl = `/assets/${values.value.id}?access_token=${accessToken}`

const focusPicker = ref<HTMLImageElement | null>(null);
const focusPoint = ref<FocusPoint>();

const initialFocusPoint = {
	y: useFromImageCoordinates(props.image.dynamic_metadata?.subject_area?.y, props.image.height),
	x: useFromImageCoordinates(props.image.dynamic_metadata?.subject_area?.x, props.image.width),
}

const setupFocusPicker = (element: HTMLImageElement) => {
	new FocusPicker(element, {
		onChange: focus => {
			focusPoint.value = {
				y: useToImageCoordinates(focus.y, props.image.height),
				x: useToImageCoordinates(focus.x, props.image.width),
			};
		},
		focus: initialFocusPoint,
	})
}

const loadingSetFocus = ref(false);
const setFocus = async () => {
	if (focusPoint.value) {
		loadingSetFocus.value = true;
		const response = await setFocusPoint(props.rokkaClient, props.image.hash, focusPoint.value);
		emit('input', response.hash);
		loadingSetFocus.value = false;
	}
}

const loadingRemoveFocus = ref(false);
const removeFocus = async () => {
	loadingRemoveFocus.value = true;
	const response = await removeFocusPoint(props.rokkaClient, props.image.hash);
	emit('input', response.hash);
	loadingRemoveFocus.value = false;
}
</script>
<style scoped>
.loader {
	margin-right: 0.5rem;
}

.focus-picker-container {
	width: fit-content;
	margin: auto;
}

.focus-picker {
	max-height: 500px;
}
</style>
