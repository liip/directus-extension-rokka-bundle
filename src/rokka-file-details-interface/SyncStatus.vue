<template>
	<v-notice :type="synchronized ? 'success' : 'warning'">
		{{ synchronized ? t('file_synced') : t('file_not_synced') }}
	</v-notice>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const props = defineProps({
	hash: {
		type: String,
		required: true,
	},
});

const { t } = useI18n({
	messages: {
		'de-DE': {
			file_not_synced: 'Das Bild ist nicht auf Rokka synchronisiert',
			file_synced: 'Das Bild ist auf Rokka synchronisiert',
		},
		'en-US': {
			file_not_synced: 'The image is not synchronized to Rokka',
			file_synced: 'The image is synchronized to Rokka',
		},
	},
});

const synchronized = props.hash !== null;
</script>
