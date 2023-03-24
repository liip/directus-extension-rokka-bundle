import { SettingsStorageAssetPreset } from '@directus/shared/types';
import { StackOperation, StackOptions } from 'rokka/dist/apis/stacks';
import { RokkaStack } from '../../types/types';

const transformationPresetToStack = (
	stackPrefix: string,
	transformationPreset: SettingsStorageAssetPreset
): RokkaStack => {
	const stackName = `${stackPrefix}-${transformationPreset.key}`;

	const options: StackOptions = {};
	if (transformationPreset.quality) {
		options['optim.quality'] = Math.ceil(transformationPreset.quality / 10);
	}

	const operation: StackOperation = {
		name: 'resize',
		options: {},
	};
	if (operation.options) {
		if (transformationPreset.fit) {
			switch (transformationPreset.fit) {
				case 'inside' || 'contain':
					operation.options.mode = 'box';
					break;
				case 'cover':
					operation.options.mode = 'absolute';
					break;
				case 'outside':
					operation.options.mode = 'fill';
					break;
			}
		}

		if (transformationPreset.width) {
			operation.options.width = transformationPreset.width;
		}

		if (transformationPreset.height) {
			operation.options.height = transformationPreset.height;
		}

		const upscale = transformationPreset.withoutEnlargement ? false : true;
		operation.options.upscale = upscale;
	}

	return {
		name: stackName,
		stack_options: options,
		stack_operations: [operation],
	};
};

export { transformationPresetToStack };
