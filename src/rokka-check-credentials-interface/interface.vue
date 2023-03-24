<template>
	<v-button full-width @click="checkCurrentCredentials">
		<div class="status-indicator">
			<v-progress-circular v-if="loading" indeterminate />
			<v-icon v-if="!loading && valid === true" name="check" />
			<v-icon v-if="!loading && valid === false" name="close" />
		</div>
		{{ t('check_credentials') }}
	</v-button>
</template>
<script setup lang="ts">
import { ref, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRokkaClientWithCredentials } from '../composables/useRokkaClient';
import { checkCredentials } from '../composables/useRokka';

// Add local translations to existing vueI18n instance
const { t } = useI18n({
	messages: {
		'de-DE': {
			check_credentials: 'Zugansdaten überprüfen',
		},
		'en-US': {
			check_credentials: 'Check credentials',
		},
	},
});

// Get current values of form (in this case project settings)
const values = inject('values', ref<Record<string, any>>({}));

const loading = ref<boolean>(false);
const valid = ref<null | boolean>(null);
const checkCurrentCredentials = async () => {
	loading.value = true;

	// Get organization and apiKey from current form values
	const { rokka_organization, rokka_api_key } = values.value;

	if (rokka_organization && rokka_api_key) {
		const rokkaClient = useRokkaClientWithCredentials(rokka_organization, rokka_api_key);
		const areCredentialsValid = await checkCredentials(rokkaClient);

		if (areCredentialsValid) {
			valid.value = true;
			loading.value = false;
			return;
		}
	}

	valid.value = false;
	loading.value = false;
};
</script>
<style scoped>
.status-indicator {
	margin-right: 0.5rem;
}
</style>
