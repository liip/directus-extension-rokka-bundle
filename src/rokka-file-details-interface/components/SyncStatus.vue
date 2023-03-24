<template>
	<v-notice :type="type" :icon="icon" class="status">
		{{ text }}
	</v-notice>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
	synced: {
		type: Boolean,
		required: true,
	},
	loading: {
		type: Boolean,
		required: true,
	},
});

const { t } = useI18n({
	messages: {
		'de-DE': {
			file_not_synced: 'Das Bild ist nicht auf Rokka synchronisiert',
			file_synced: 'Das Bild ist auf Rokka synchronisiert',
			loading: 'Die Bilddaten werden geladen',
		},
		'en-US': {
			file_not_synced: 'The image is not synchronized to Rokka',
			file_synced: 'The image is synchronized to Rokka',
			loading: 'The image data is being loaded',
		},
	},
});

const icon = computed(() => (props.loading ? 'sync' : null));

const type = computed(() => {
	if (props.loading) {
		return 'info';
	}

	return props.synced ? 'success' : 'warning';
});

const text = computed(() => {
	if (props.loading) {
		return t('loading');
	}

	return props.synced ? t('file_synced') : t('file_not_synced');
});
</script>
<style scoped>
.status {
	margin-bottom: 1rem;
}
</style>
