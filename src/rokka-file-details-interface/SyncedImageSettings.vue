<template>
	<v-button full-width @click="remove">
		<v-progress-circular v-if="loading" class="loader" indeterminate />
		{{ t('remove') }}
	</v-button>
</template>
<script setup lang="ts">
import { PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RokkaClient } from '../types/types';
import { removeImage } from '../composables/useRokka';

const props = defineProps({
	rokkaClient: {
		type: Object as PropType<RokkaClient>,
		required: true
	},
	hash: {
		type: String,
		required: true,
	}
});

const emit = defineEmits(['update']);

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

const loading = ref(false);

const remove = async () => {
	loading.value = true;
	const removed = await removeImage(props.rokkaClient, props.hash);
	if (removed) {
		emit('update', null);
	}
	loading.value = false;
}
</script>
<style scoped>
.loader {
	margin-right: 0.5rem;
}
</style>
