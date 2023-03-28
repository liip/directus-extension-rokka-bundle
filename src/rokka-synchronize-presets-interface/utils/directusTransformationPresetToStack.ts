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

	const resize: StackOperation = {
		name: 'resize',
		options: {},
	};
	if (resize.options) {
		if (transformationPreset.fit === 'contain' || transformationPreset.fit === 'inside') {
			resize.options.mode = 'box';
		} else {
			// for default, cover and outside
			resize.options.mode = 'fill';
		}

		if (transformationPreset.width) {
			resize.options.width = transformationPreset.width;
		}

		if (transformationPreset.height) {
			resize.options.height = transformationPreset.height;
		}

		const upscale = transformationPreset.withoutEnlargement ? false : true;
		resize.options.upscale = upscale;
	}

	const crop: StackOperation = {
		name: 'crop',
		options: {
			mode: 'ratio',
			width: transformationPreset.width,
			height: transformationPreset.height,
		},
	};

	const letterboxing: StackOperation = {
		name: 'composition',
		options: {
			mode: 'foreground',
			secondary_color: '000000',
			width: transformationPreset.width,
			height: transformationPreset.height,
		},
	};

	const operations: StackOperation[] = [];
	if (transformationPreset.width || transformationPreset.height) {
		operations.push(resize);
	}
	if (transformationPreset.width && transformationPreset.height) {
		if (!transformationPreset.fit || transformationPreset.fit === 'cover') {
			operations.push(crop);
		}

		if (transformationPreset.fit === 'contain') {
			operations.push(letterboxing);
		}
	}

	return {
		name: stackName,
		stack_options: options,
		stack_operations: operations,
	};
};

export { transformationPresetToStack };
