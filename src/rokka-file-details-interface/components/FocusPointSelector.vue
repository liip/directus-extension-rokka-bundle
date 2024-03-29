<template>
	<div class="focus-picker-container">
		<img class="focus-picker" :src="imageUrl" @load="(e) => setupFocusPicker(e.target as HTMLImageElement)" />
	</div>
	<div class="controls">
		<v-button full-width @click="setFocus">
			<Error v-if="setFocusError" />
			<v-progress-circular v-if="setFocusLoading" class="loader" indeterminate />
			{{ t('set_focuspoint') }}
		</v-button>
		<v-button full-width @click="removeFocus" :disabled="isFocusPointSet">
			<Error v-if="removeFocusError" />
			<v-progress-circular v-if="removeFocusLoading" class="loader" indeterminate />
			{{ t('remove_focuspoint') }}
		</v-button>
	</div>
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
import Error from '../../components/Error.vue';

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

const setFocusError = ref(false);
const setFocusLoading = ref(false);
const removeFocusError = ref(false);
const removeFocusLoading = ref(false);

const setFocus = async () => {
	if (focusPoint.value) {
		setFocusError.value = false;
		setFocusLoading.value = true;
		try {
			const response = await setFocusPoint(props.rokkaClient, props.imageMetadata.hash, focusPoint.value);
			emit('input', response.hash);
		} catch (e) {
			setFocusError.value = true;
		}
		setFocusLoading.value = false;
	}
};

const removeFocus = async () => {
	removeFocusError.value = false;
	removeFocusLoading.value = true;
	try {
		const response = await removeFocusPoint(props.rokkaClient, props.imageMetadata.hash);
		emit('input', response.hash);
	} catch (e) {
		removeFocusError.value = true;
	}
	removeFocusLoading.value = false;
};
</script>
<style scoped>
.focus-picker-container {
	width: fit-content;
	margin: auto;
	margin-bottom: 1rem;
}

.focus-picker {
	max-height: 500px;
}

.controls {
	display: grid;
	grid-template-columns: 1fr 1fr;
	column-gap: 1rem;
}

.loader {
	margin-right: 0.5rem;
}
</style>
