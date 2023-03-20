<template>
	<v-notice :type="synced ? 'success' : 'warning'">
		{{ synced ? t('file_synced') : t('file_not_synced') }}
	</v-notice>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps({
	synced: {
		type: Boolean,
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
</script>
