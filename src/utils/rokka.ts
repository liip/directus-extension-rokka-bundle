import { Sourceimage } from 'rokka/dist/apis/sourceimages';
import { StackConfig, StackOperation } from 'rokka/dist/apis/stacks';
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
		return null;
	}
};

const uploadImage = async (rokkaClient: RokkaClient, filename: string, data: Blob): Promise<Sourceimage | null> => {
	try {
		const response = await rokkaClient.api.sourceimages.create(rokkaClient.organization, filename, data);
		return response.body.items[0] ?? null;
	} catch (e) {
		return null;
	}
};

const removeImage = async (rokkaClient: RokkaClient, hash: string): Promise<boolean> => {
	try {
		await rokkaClient.api.sourceimages.delete(rokkaClient.organization, hash);
		return true;
	} catch (e) {
		return false;
	}
};

const setFocusPoint = async (
	rokkaClient: RokkaClient,
	hash: string,
	focusPoint: FocusPoint
): Promise<Sourceimage | null> => {
	try {
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
	} catch (e) {
		return null;
	}
};

const removeFocusPoint = async (rokkaClient: RokkaClient, hash: string): Promise<Sourceimage | null> => {
	try {
		const response = await rokkaClient.api.sourceimages.removeSubjectArea(rokkaClient.organization, hash, {
			deletePrevious: true,
		});
		return response.body;
	} catch (e) {
		return null;
	}
};

const getStacks = async (rokkaClient: RokkaClient): Promise<RokkaStack[]> => {
	try {
		const response = await rokkaClient.api.stacks.list(rokkaClient.organization);
		return response.body.items;
	} catch (e) {
		return [];
	}
};

const createStack = async (rokkaClient: RokkaClient, rokkaStack: RokkaStack): Promise<boolean> => {
	try {
		await rokkaClient.api.stacks.create(rokkaClient.organization, rokkaStack.name, {
			operations: rokkaStack.stack_operations,
			options: rokkaStack.stack_options,
		});
		return true;
	} catch (e) {
		return false;
	}
};

const deleteStack = async (rokkaClient: RokkaClient, stackName: string): Promise<boolean> => {
	try {
		await rokkaClient.api.stacks.delete(rokkaClient.organization, stackName);
		return true;
	} catch (e) {
		return false;
	}
};

const updateStack = async (rokkaClient: RokkaClient, rokkaStack: RokkaStack): Promise<boolean> => {
	try {
		await deleteStack(rokkaClient, rokkaStack.name);
		await createStack(rokkaClient, rokkaStack);
		return true;
	} catch (e) {
		return false;
	}
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
