<template>
	<v-button full-width @click="sync" class="button">
		<Error v-if="error" />
		<v-progress-circular v-if="loading" class="loader" indeterminate />
		{{ t('synchronize') }}
	</v-button>
</template>
<script setup lang="ts">
import { PropType, ref, inject } from 'vue';
import { useApi } from '@directus/extensions-sdk';
import { RokkaClient } from '../../types/types';
import { getDirectusImage } from '../utils/directusImage';
import { uploadImage } from '../../utils/rokka';
import { useI18n } from 'vue-i18n';
import Error from '../../components/Error.vue';

const props = defineProps({
	rokkaClient: {
		type: Object as PropType<RokkaClient>,
		required: true,
	},
});

const emit = defineEmits(['input']);

const { t } = useI18n({
	messages: {
		'de-DE': {
			synchronize: 'Bild hochladen',
		},
		'en-US': {
			synchronize: 'Upload image',
		},
	},
});

const api = useApi();
const values = inject('values', ref<Record<string, any>>({}));
const error = ref(false);
const loading = ref(false);

const sync = async () => {
	error.value = false;
	loading.value = true;
	try {
		const imageData = await getDirectusImage(api, values.value.id);
		const uploadedImage = await uploadImage(props.rokkaClient, values.value.filename_download, imageData);
		emit('input', uploadedImage?.hash);
	} catch (e) {
		error.value = true;
	}
	loading.value = false;
};
</script>
<style scoped>
.button {
	margin-bottom: 1rem;
}

.loader {
	margin-right: 0.5rem;
}
</style>
