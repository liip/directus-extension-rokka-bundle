import { SettingsStorageAssetPreset } from '@directus/shared/types';
import { DiffStatus, RokkaStack, RokkaStackDiff } from '../../types/types';
import { transformationPresetToStack } from './directusTransformationPresetToStack';

const diffTransformationPresets = (
	stackPrefix: string,
	transformationPresets: SettingsStorageAssetPreset[],
	stacks: RokkaStack[]
) => {
	const syncedStacks = stacks.filter((stack) => stack.name.startsWith(`${stackPrefix}-`));

	const diff: RokkaStackDiff[] = transformationPresets.map((transformationPreset) => {
		const transformationPresetAsStack = transformationPresetToStack(stackPrefix, transformationPreset);
		const existingSyncedStack = syncedStacks.find((stack) => stack.name === transformationPresetAsStack.name);

		if (!existingSyncedStack) {
			return {
				transformationPreset: transformationPreset,
				stack: transformationPresetAsStack,
				status: DiffStatus.created,
			};
		} else {
			const presetOptions = transformationPresetAsStack.stack_options;
			const existingOptions = existingSyncedStack.stack_options;

			const presetOperation = transformationPresetAsStack.stack_operations[0]?.options;
			const existingOperation = existingSyncedStack.stack_operations[0]?.options;

			const isStackUnchanged =
				presetOptions['optim.quality'] === existingOptions['optim.quality'] &&
				presetOperation?.mode === existingOperation?.mode &&
				presetOperation?.width === existingOperation?.width &&
				presetOperation?.height === existingOperation?.height &&
				presetOperation?.upscale === existingOperation?.upscale;

			if (isStackUnchanged) {
				return {
					stack: transformationPresetAsStack,
					status: DiffStatus.unchanged,
				};
			} else {
				return {
					stack: transformationPresetAsStack,
					status: DiffStatus.updated,
				};
			}
		}
	});

	const deletedStacksAsDiff = syncedStacks
		.filter((stack) => !diff.some((presetStack) => stack.name === presetStack.stack.name))
		.map((stack) => ({
			stack: stack,
			status: DiffStatus.deleted,
		}));

	return diff.concat(deletedStacksAsDiff);
};

export { diffTransformationPresets };
