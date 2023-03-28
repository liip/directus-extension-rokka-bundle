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

			const presetResizeOperation = transformationPresetAsStack.stack_operations.find(
				(operation) => operation.name === 'resize'
			)?.options;
			const existingResizeOperation = existingSyncedStack.stack_operations.find(
				(operation) => operation.name === 'resize'
			)?.options;

			const presetCropOperation = transformationPresetAsStack.stack_operations.find(
				(operation) => operation.name === 'crop'
			);
			const existingCropOperation = existingSyncedStack.stack_operations.find((operation) => operation.name === 'crop');
			// Either both values are undefined, or both are defined
			const isCropUnchanged =
				(presetCropOperation == null && existingCropOperation == null) ||
				(presetCropOperation != null && existingCropOperation != null);

			const presetCompositionOperation = transformationPresetAsStack.stack_operations.find(
				(operation) => operation.name === 'composition'
			);
			const existingCompositionOperation = existingSyncedStack.stack_operations.find(
				(operation) => operation.name === 'composition'
			);
			// Either both values are undefined, or both are defined
			const isCompositionUnchanged =
				(presetCompositionOperation == null && existingCompositionOperation == null) ||
				(presetCompositionOperation != null && existingCompositionOperation != null);

			const isStackUnchanged =
				presetOptions['optim.quality'] === existingOptions['optim.quality'] &&
				presetResizeOperation?.mode === existingResizeOperation?.mode &&
				presetResizeOperation?.width === existingResizeOperation?.width &&
				presetResizeOperation?.height === existingResizeOperation?.height &&
				presetResizeOperation?.upscale === existingResizeOperation?.upscale &&
				isCropUnchanged &&
				isCompositionUnchanged;

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
