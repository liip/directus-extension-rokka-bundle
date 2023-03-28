<template>
	<div>
		<v-notice v-if="rokkaClient === null || !hasAllowedMIMEType">
			{{ t('rokka_unavailable') }}
		</v-notice>
		<div v-else>
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

const props = defineProps({
	value: {
		type: String,
		default: null,
	},
});

const { t } = useI18n({
	messages: {
		'de-DE': {
			rokka_unavailable: 'Die Rokka erweiterung ist nicht verfügbar',
		},
		'en-US': {
			rokka_unavailable: 'The Rokka extension is not available',
		},
	},
});

const allowedMIMETypes = ['image/gif', 'image/jpg', 'image/jpeg', 'image/png'];

const api = useApi();
const values = inject('values', ref<Record<string, any>>({}));
const hasAllowedMIMEType = computed(() => allowedMIMETypes.includes(values.value.type));

const hash = ref(props.value);
const loading = ref(true);
const save = async (newHash: string) => {
	loading.value = true;
	const updatedHash = await setRokkaHash(api, values.value.id, newHash);
	hash.value = updatedHash;
	loading.value = false;
};

const rokkaClient = ref<null | RokkaClient>(null);
const imageMetadata = ref<null | Sourceimage>(null);
const synced = computed(() => imageMetadata.value !== null);

const getImageMetadata = async () => {
	loading.value = true;
	imageMetadata.value =
		hash.value && rokkaClient.value ? await rokkaGetImageMetadata(rokkaClient.value, hash.value) : null;
	loading.value = false;
};

onMounted(async () => {
	rokkaClient.value = await getRokkaClient(api);
	getImageMetadata();
});
// Add watcher to update sync status if hash changed
watch(hash, getImageMetadata);
</script>
