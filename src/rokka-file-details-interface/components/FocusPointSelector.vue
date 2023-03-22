<template>
	<div class="focus-picker-container">
		<img class="focus-picker" :src="imageUrl" @load="(e) => setupFocusPicker(e.target as HTMLImageElement)" />
	</div>
	<v-button full-width @click="setFocus">
		<v-progress-circular v-if="loadingSetFocus" class="loader" indeterminate />
		{{ t('set_focuspoint') }}
	</v-button>
	<v-button full-width @click="removeFocus" :disabled="isFocusPointSet">
		<v-progress-circular v-if="loadingRemoveFocus" class="loader" indeterminate />
		{{ t('remove_focuspoint') }}
	</v-button>
</template>
<script setup lang="ts">
import { PropType, ref, inject, computed } from 'vue';
import { FocusPoint, RokkaClient } from '../../types/types';
import { FocusPicker } from 'image-focus';
import { Sourceimage } from 'rokka/dist/apis/sourceimages';
import { useApi } from '@directus/extensions-sdk';
import { setFocusPoint, removeFocusPoint } from '../../utils/rokka';
import { fromImageCoordinates, toImageCoordinates } from '../utils/focalPoint';
import { getDirectusAccessToken } from '../utils/directusAccessToken';
import { useI18n } from 'vue-i18n';

const props = defineProps({
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

const { t } = useI18n({
	messages: {
		'de-DE': {
			set_focuspoint: 'Fokuspunkt setzen',
			remove_focuspoint: 'Fokuspunkt entfernen',
		},
		'en-US': {
			set_focuspoint: 'Set focus point',
			remove_focuspoint: 'Remove focus point',
		},
	},
});

const values = inject('values', ref<Record<string, any>>({}));
const api = useApi();
const imageUrl = `/assets/${values.value.id}?access_token=${getDirectusAccessToken(api)}`;

const isFocusPointSet = computed(() => !props.imageMetadata.dynamic_metadata?.subject_area);
const focusPoint = ref<FocusPoint>();
const initialFocusPoint = {
	y: fromImageCoordinates(props.imageMetadata.dynamic_metadata?.subject_area?.y, props.imageMetadata.height),
	x: fromImageCoordinates(props.imageMetadata.dynamic_metadata?.subject_area?.x, props.imageMetadata.width),
};

const setupFocusPicker = (element: HTMLImageElement) => {
	new FocusPicker(element, {
		onChange: (focus) => {
			focusPoint.value = {
				y: toImageCoordinates(focus.y, props.imageMetadata.height),
				x: toImageCoordinates(focus.x, props.imageMetadata.width),
			};
		},
		focus: initialFocusPoint,
	});
};

const loadingSetFocus = ref(false);
const loadingRemoveFocus = ref(false);

const setFocus = async () => {
	if (focusPoint.value) {
		loadingSetFocus.value = true;
		const response = await setFocusPoint(props.rokkaClient, props.imageMetadata.hash, focusPoint.value);
		emit('input', response.hash);
		loadingSetFocus.value = false;
	}
};

const removeFocus = async () => {
	loadingRemoveFocus.value = true;
	const response = await removeFocusPoint(props.rokkaClient, props.imageMetadata.hash);
	emit('input', response.hash);
	loadingRemoveFocus.value = false;
};
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
