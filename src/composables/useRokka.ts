import { Sourceimage } from 'rokka/dist/apis/sourceimages';
import { RokkaClient } from '../types/types';

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

export { checkCredentials, getImage, uploadImage, removeImage };
