<template>
	<div>
		<v-notice v-if="client === null">
			{{ t('missing_credentials') }}
		</v-notice>
		<div v-else>
			<SyncStatus :synced="image !== null" />
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import SyncStatus from './SyncStatus.vue';
import { RokkaClient } from '../types/types';
import { useRokkaClient } from '../composables/useClient';
import { getImage } from '../composables/useRokka';
import { RokkaResponse } from 'rokka/dist/response';

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

const client = ref<null | RokkaClient>(null);
const image = ref<null | RokkaResponse>(null);

onMounted(async () => {
	client.value = await useRokkaClient();
	image.value = props.value && client.value ? await getImage(client.value, props.value) : null;
});
</script>
