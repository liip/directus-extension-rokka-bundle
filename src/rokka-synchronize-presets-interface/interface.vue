<template>
	<v-button full-width @click="openDrawer">{{ t('synchronize_presets') }}</v-button>
	<v-drawer :title="t('synchronize_presets')" icon="list" v-model="isDrawerOpen" @cancel="closeDrawer">
		<template #actions>
			<v-button icon rounded @click="sync">
				<v-progress-circular v-if="synchronizing" class="loader" indeterminate />
				<v-icon v-else name="sync" />
			</v-button>
		</template>
		<v-notice v-if="!rokkaClient">
			{{ t('rokka_unavailable') }}
		</v-notice>
		<div v-else>
			<v-progress-circular v-if="loading" class="loader" indeterminate />
			<StackList v-else :rokkaStackDiffs="rokkaStackDiffs" />
		</div>
	</v-drawer>
</template>

<script setup lang="ts">
import { useApi } from '@directus/extensions-sdk';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getRokkaClient } from '../utils/rokkaClient';
import StackList from './components/StackList.vue';
import { getTransformationPresets } from './utils/directusTransformationPresets';
import { getStackPrefix } from './utils/directusStackPrefix';
import { getStacks, createStack, deleteStack, updateStack } from '../utils/rokka';
import { DiffStatus, RokkaClient, RokkaStackDiff } from '../types/types';
import { diffTransformationPresets } from './utils/diffTransformationPresets';
import { SettingsStorageAssetPreset } from '@directus/shared/types';

const { t } = useI18n({
	messages: {
		'de-DE': {
			synchronize_presets: 'Transformationsvorgaben synchronisieren',
			rokka_unavailable: 'Rokka konnte nicht geladen werden',
		},
		'en-US': {
			synchronize_presets: 'Synchronize transformation presets',
			rokka_unavailable: "Rokka couldn't be loaded",
		},
	},
});

const api = useApi();
const stackPrefix = ref<string>();
const transformationPresets = ref<SettingsStorageAssetPreset[]>();

const loading = ref(true);
const rokkaClient = ref<RokkaClient | null>();
const rokkaStackDiffs = ref<RokkaStackDiff[]>([]);

const getStackDiffs = async () => {
	loading.value = true;
	if (rokkaClient.value && stackPrefix.value && transformationPresets.value) {
		const rokkaStacks = await getStacks(rokkaClient.value);
		rokkaStackDiffs.value = diffTransformationPresets(stackPrefix.value, transformationPresets.value, rokkaStacks);
	}
	loading.value = false;
};

const isDrawerOpen = ref(false);
const openDrawer = async () => {
	isDrawerOpen.value = true;

	stackPrefix.value = await getStackPrefix(api);
	transformationPresets.value = await getTransformationPresets(api);
	rokkaClient.value = await getRokkaClient(api);
	getStackDiffs();
};

const closeDrawer = () => {
	isDrawerOpen.value = false;
	// Set loading to prevent "flickering"
	// on next drawer open
	loading.value = true;
};

const synchronizing = ref(false);
const sync = async () => {
	if (rokkaClient.value) {
		synchronizing.value = true;
		for (const rokkaStackDiff of rokkaStackDiffs.value) {
			switch (rokkaStackDiff.status) {
				case DiffStatus.unchanged:
					continue;
				case DiffStatus.created:
					await createStack(rokkaClient.value, rokkaStackDiff.stack);
					break;
				case DiffStatus.deleted:
					await deleteStack(rokkaClient.value, rokkaStackDiff.stack.name);
					break;
				case DiffStatus.updated:
					await updateStack(rokkaClient.value, rokkaStackDiff.stack);
					break;
			}
		}
		synchronizing.value = false;
		getStackDiffs();
	}
};
</script>
<style scoped>
.loader {
	margin: auto;
}
</style>
