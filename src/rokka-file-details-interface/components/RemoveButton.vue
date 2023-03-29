<template>
	<v-button full-width @click="remove" class="button">
		<Error v-if="error" />
		<v-progress-circular v-if="loading" class="loader" indeterminate />
		{{ t('remove') }}
	</v-button>
</template>
<script setup lang="ts">
import { PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Error from '../../components/Error.vue';
import { RokkaClient } from '../../types/types';
import { removeImage } from '../../utils/rokka';

const props = defineProps({
	rokkaClient: {
		type: Object as PropType<RokkaClient>,
		required: true,
	},
	hash: {
		type: String,
		required: true,
	},
});

const emit = defineEmits(['input']);

const { t } = useI18n({
	messages: {
		'de-DE': {
			remove: 'Bild entfernen',
		},
		'en-US': {
			remove: 'Remove image',
		},
	},
});

const error = ref(false);
const loading = ref(false);

const remove = async () => {
	error.value = false;
	loading.value = true;
	try {
		await removeImage(props.rokkaClient, props.hash);
		emit('input', null);
	} catch (e) {
		error.value = true;
	}
	loading.value = false;
};
</script>
<style scoped>
.button {
	margin-bottom: 1rem;
}

.loader {
	margin-right: 0.5rem;
}
</style>
