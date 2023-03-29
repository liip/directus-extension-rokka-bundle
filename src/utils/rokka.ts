import { Sourceimage } from 'rokka/dist/apis/sourceimages';
import { FocusPoint, RokkaClient, RokkaStack } from '../types/types';

const checkCredentials = async (rokkaClient: RokkaClient): Promise<boolean> => {
	try {
		await rokkaClient.api.stacks.list(rokkaClient.organization, 1);
		return true;
	} catch (e) {
		return false;
	}
};

const getImageMetadata = async (rokkaClient: RokkaClient, hash: string): Promise<Sourceimage | null> => {
	try {
		const response = await rokkaClient.api.sourceimages.get(rokkaClient.organization, hash);
		return response.body;
	} catch (e) {
		const message = (e as Error).message;
		if (message.includes('No source image found')) {
			return null;
		} else {
			throw e;
		}
	}
};

const uploadImage = async (rokkaClient: RokkaClient, filename: string, data: Blob): Promise<Sourceimage | null> => {
	const response = await rokkaClient.api.sourceimages.create(rokkaClient.organization, filename, data);
	return response.body.items[0] ?? null;
};

const removeImage = async (rokkaClient: RokkaClient, hash: string): Promise<void> => {
	await rokkaClient.api.sourceimages.delete(rokkaClient.organization, hash);
};

const setFocusPoint = async (rokkaClient: RokkaClient, hash: string, focusPoint: FocusPoint): Promise<Sourceimage> => {
	const response = await rokkaClient.api.sourceimages.setSubjectArea(
		rokkaClient.organization,
		hash,
		{
			width: 1,
			height: 1,
			...focusPoint,
		},
		{ deletePrevious: true }
	);
	return response.body;
};

const removeFocusPoint = async (rokkaClient: RokkaClient, hash: string): Promise<Sourceimage> => {
	const response = await rokkaClient.api.sourceimages.removeSubjectArea(rokkaClient.organization, hash, {
		deletePrevious: true,
	});
	return response.body;
};

const getStacks = async (rokkaClient: RokkaClient): Promise<RokkaStack[]> => {
	const response = await rokkaClient.api.stacks.list(rokkaClient.organization);
	return response.body.items;
};

const createStack = async (rokkaClient: RokkaClient, rokkaStack: RokkaStack): Promise<void> => {
	await rokkaClient.api.stacks.create(rokkaClient.organization, rokkaStack.name, {
		operations: rokkaStack.stack_operations,
		options: rokkaStack.stack_options,
	});
};

const deleteStack = async (rokkaClient: RokkaClient, stackName: string): Promise<void> => {
	await rokkaClient.api.stacks.delete(rokkaClient.organization, stackName);
};

const updateStack = async (rokkaClient: RokkaClient, rokkaStack: RokkaStack): Promise<void> => {
	await deleteStack(rokkaClient, rokkaStack.name);
	await createStack(rokkaClient, rokkaStack);
};

export {
	checkCredentials,
	getImageMetadata,
	uploadImage,
	removeImage,
	setFocusPoint,
	removeFocusPoint,
	getStacks,
	createStack,
	deleteStack,
	updateStack,
};
