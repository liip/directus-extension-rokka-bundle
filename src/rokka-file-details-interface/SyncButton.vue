<template>
	<v-button full-width @click="sync">
		<v-progress-circular v-if="loading" class="loader" indeterminate />
		{{ t('synchronize') }}
	</v-button>
</template>
<script setup lang="ts">
import { PropType, ref, inject } from 'vue';
import { useApi } from '@directus/extensions-sdk';
import { RokkaClient } from '../types/types';
import { useDirectusImage } from '../composables/useDirectusImage';
import { uploadImage } from '../composables/useRokka';
import { useI18n } from 'vue-i18n';

const props = defineProps({
	rokkaClient: {
		type: Object as PropType<RokkaClient>,
		required: true
	}
});

const emit = defineEmits(['upload']);

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
const loading = ref(false);

const sync = async () => {
	loading.value = true;
	const imageData = await useDirectusImage(api, values.value.id);
	const uploadedImage = await uploadImage(props.rokkaClient, values.value.filename_download, imageData);

	emit('upload', uploadedImage?.hash)
	loading.value = false;
}
</script>
<style scoped>
.loader {
	margin-right: 0.5rem;
}
</style>
