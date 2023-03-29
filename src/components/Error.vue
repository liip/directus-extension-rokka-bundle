<template>
	<v-notice type="danger">{{ t('error') }}</v-notice>
</template>
<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n({
	messages: {
		'de-DE': {
			error:
				'Ein unerwarteter Fehler ist aufgetreten. Überprüfen sie ihre Zugangsdaten und stellen sie sicher dass Rokka läuft.',
		},
		'en-US': {
			error: 'An unexpected error occured. Please check your credentials and ensure that Rokka is running.',
		},
	},
});
</script>
