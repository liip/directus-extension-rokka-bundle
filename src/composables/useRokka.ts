import { Sourceimage } from 'rokka/dist/apis/sourceimages';
import { FocusPoint, RokkaClient } from '../types/types';

const checkCredentials = async (rokkaClient: RokkaClient): Promise<boolean> => {
	try {
		await rokkaClient.api.stacks.list(rokkaClient.organization, 1);
		return true;
	} catch (e) {
		return false;
	}
};

const getImage = async (rokkaClient: RokkaClient, hash: string): Promise<Sourceimage | null> => {
	try {
		const response = await rokkaClient.api.sourceimages.get(rokkaClient.organization, hash);
		return response.body;
	} catch (e) {
		return null;
	}
};

const uploadImage = async (rokkaClient: RokkaClient, filename: string, data: string): Promise<Sourceimage | null> => {
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

const setFocusPoint = async (rokkaClient: RokkaClient, hash: string, focusPoint: FocusPoint) => {
	try {
		const response = await rokkaClient.api.sourceimages.setSubjectArea(
			rokkaClient.organization,
			hash,
			{
				width: 1,
				height: 1,
				...focusPoint
			},
			{ deletePrevious: false },
		);
		return response.body;
	} catch (e) {
		return null;
	}
}

const removeFocusPoint = async (rokkaClient: RokkaClient, hash: string) => {
	try {
		const response = await rokkaClient.api.sourceimages.removeSubjectArea(rokkaClient.organization, hash);
		return response.body;
	} catch (e) {
		return null;
	}
}

export { checkCredentials, getImage, uploadImage, removeImage, setFocusPoint, removeFocusPoint };
