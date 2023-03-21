<template>
	<div>
		<img ref="focusPicker" :src="imageUrl" @load="(e) => setupFocusPicker(e.target)"/>
	</div>
	<v-button full-width @click="setFocalPoint">Set</v-button>
</template>
<script setup lang="ts">
import { PropType, ref, inject, onMounted } from 'vue';
import { RokkaClient } from '../types/types';
import { FocusPicker } from 'image-focus';
import { Sourceimage } from 'rokka/dist/apis/sourceimages';
import { useApi } from '@directus/extensions-sdk';

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

const fromImageCoordinates = (coordinate: number | undefined, range: number) => {
	// Set focal point to center if none defined
	if (coordinate === undefined) {
		return 0;
	}

	const valueAsUnitVector = coordinate/range;
	const valueInCorrectRange = (valueAsUnitVector*2)-1;
	return valueInCorrectRange;
}

const toImageCoordinates = (value: number, range: number) => {
	// Convert to range 0-1
	const valueAsUnitVector = (value+1)/2;
	// Clamp value, since library sometimes returns less than -1
	// do it after unit vector conversion, because
	// js floating point isnt accurate
	const valueClamped = Math.min(Math.max(valueAsUnitVector, 0), 1);

	return valueClamped*range;
}
const imageHeight = props.image.height;
const imageWidth = props.image.width;

const initialSubjectArea = props.image.dynamic_metadata?.subject_area;
const initialFocusPoint = {
	y: fromImageCoordinates(initialSubjectArea?.y, imageHeight),
	x: fromImageCoordinates(initialSubjectArea?.x, imageWidth),
}

const setupFocusPicker = (element: HTMLImageElement) => {
	new FocusPicker(element, {
		onChange: focus => {
			const subjectArea = {
				y: toImageCoordinates(focus.y, imageHeight),
				x: toImageCoordinates(focus.x, imageWidth),
			};

			console.log(subjectArea);
		},
		focus: initialFocusPoint,
	})
}

const setFocalPoint = async () => {

}
</script>
