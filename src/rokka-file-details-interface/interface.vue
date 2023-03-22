<template>
	<div>
		<v-notice v-if="client === null">
			{{ t('missing_credentials') }}
		</v-notice>
		<div v-else>
			<SyncStatus :synced="synced" />
			<div class="image-settings">
				<SyncedImageSettings
					v-if="synced"
					:rokkaClient="client"
					:image="imageMetadata"
					@input="(hash) => emit('input', hash)"
				/>
				<SyncButton v-else :rokkaClient="client" @input="(hash) => emit('input', hash)" />
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { RokkaClient } from '../types/types';
import { useRokkaClient } from '../composables/useRokkaClient';
import { getImage } from '../composables/useRokka';
import { Sourceimage } from 'rokka/dist/apis/sourceimages';
import SyncStatus from './SyncStatus.vue';
import SyncButton from './SyncButton.vue';
import SyncedImageSettings from './SyncedImageSettings.vue';
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
const client = ref<null | RokkaClient>(null);
const imageMetadata = ref<null | Sourceimage>(null);
const synced = computed(() => imageMetadata.value !== null);

const getImageMetadata = async () => {
	imageMetadata.value = props.value && client.value ? await getImage(client.value, props.value) : null;
};

onMounted(async () => {
	client.value = await useRokkaClient(api);
	getImageMetadata();
});
// Add watcher to update sync status if hash changed
watch(props, getImageMetadata);
</script>
<style scoped>
.image-settings {
	margin-top: var(--form-vertical-gap);
}
</style>
