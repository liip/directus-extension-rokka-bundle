<template>
	<div>
		<v-notice v-if="rokkaClient === null">
			{{ t('missing_credentials') }}
		</v-notice>
		<div v-else>
			<SyncStatus :synced="synced" />
			<SyncedImageSettings
				v-if="imageMetadata && synced"
				:rokkaClient="rokkaClient"
				:imageMetadata="imageMetadata"
				@input="(hash) => emit('input', hash)"
			/>
			<SyncButton v-else :rokkaClient="rokkaClient" @input="(hash) => emit('input', hash)" />
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { RokkaClient } from '../types/types';
import { getRokkaClient } from '../utils/rokkaClient';
import { getImageMetadata as rokkaGetImageMetadata } from '../utils/rokka';
import { Sourceimage } from 'rokka/dist/apis/sourceimages';
import SyncStatus from './components/SyncStatus.vue';
import SyncButton from './components/SyncButton.vue';
import SyncedImageSettings from './components/SyncedImageSettings.vue';
import { useApi } from '@directus/extensions-sdk';

const props = defineProps({
	value: {
		type: String,
		default: null,
	},
});

const emit = defineEmits(['input']);

const { t } = useI18n({
	messages: {
		'de-DE': {
			missing_credentials: 'Die Zugangsdaten für Rokka konnten nicht geladen werden',
		},
		'en-US': {
			missing_credentials: 'The Rokka Credentials could not be retrieved',
		},
	},
});

const api = useApi();
const rokkaClient = ref<null | RokkaClient>(null);
const imageMetadata = ref<null | Sourceimage>(null);
const synced = computed(() => imageMetadata.value !== null);

const getImageMetadata = async () => {
	imageMetadata.value =
		props.value && rokkaClient.value ? await rokkaGetImageMetadata(rokkaClient.value, props.value) : null;
};

onMounted(async () => {
	rokkaClient.value = await getRokkaClient(api);
	getImageMetadata();
});
// Add watcher to update sync status if hash changed
watch(props, getImageMetadata);
</script>
