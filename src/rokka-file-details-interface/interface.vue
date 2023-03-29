<template>
	<div>
		<Error v-if="error" />
		<v-notice v-if="!hasAllowedMIMEType">
			{{ t('wrong_filetype') }}
		</v-notice>
		<div v-else-if="rokkaClient">
			<SyncStatus :synced="synced" :loading="loading" />
			<SyncedImageSettings
				v-if="imageMetadata && synced"
				:rokkaClient="rokkaClient"
				:imageMetadata="imageMetadata"
				@input="save"
			/>
			<SyncButton v-else :rokkaClient="rokkaClient" @input="save" />
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, watch, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { RokkaClient } from '../types/types';
import { getRokkaClient } from '../utils/rokkaClient';
import { getImageMetadata as rokkaGetImageMetadata } from '../utils/rokka';
import { Sourceimage } from 'rokka/dist/apis/sourceimages';
import SyncStatus from './components/SyncStatus.vue';
import SyncButton from './components/SyncButton.vue';
import SyncedImageSettings from './components/SyncedImageSettings.vue';
import { useApi } from '@directus/extensions-sdk';
import { setRokkaHash } from './utils/rokkaHash';
import Error from '../components/Error.vue';

const props = defineProps({
	value: {
		type: String,
		default: null,
	},
});

const { t } = useI18n({
	messages: {
		'de-DE': {
			wrong_filetype: 'Die Rokka erweiterung ist für diesen Dateityp nicht verfügbar',
		},
		'en-US': {
			wrong_filetype: 'The Rokka extension is not available for this file type',
		},
	},
});

const allowedMIMETypes = ['image/gif', 'image/jpg', 'image/jpeg', 'image/png'];

const api = useApi();
const values = inject('values', ref<Record<string, any>>({}));
const hasAllowedMIMEType = computed(() => allowedMIMETypes.includes(values.value.type));

const error = ref(false);

const loading = ref(true);
const hash = ref(props.value);
const save = async (newHash: string) => {
	error.value = false;
	loading.value = true;
	try {
		const updatedHash = await setRokkaHash(api, values.value.id, newHash);
		hash.value = updatedHash;
	} catch (e) {
		error.value = true;
	}
	loading.value = false;
};

const rokkaClient = ref<RokkaClient>();
const imageMetadata = ref<null | Sourceimage>(null);
const synced = computed(() => imageMetadata.value !== null);

const getImageMetadata = async () => {
	error.value = false;
	loading.value = true;
	try {
		imageMetadata.value =
			hash.value && rokkaClient.value ? await rokkaGetImageMetadata(rokkaClient.value, hash.value) : null;
	} catch (e) {
		error.value = true;
	}
	loading.value = false;
};

onMounted(async () => {
	rokkaClient.value = await getRokkaClient(api);
	getImageMetadata();
});
// Add watcher to update sync status if hash changed
watch(hash, getImageMetadata);
</script>
