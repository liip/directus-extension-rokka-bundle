import { RokkaClient } from '../types/types';

const checkCredentials = async (rokkaClient: RokkaClient): Promise<boolean> => {
	try {
		await rokkaClient.api.stacks.list(rokkaClient.organization, 1);
		return true;
	} catch (e) {
		return false;
	}
};

const getImage = async (rokkaClient: RokkaClient, hash: string) => {
	try {
		return await rokkaClient.api.sourceimages.get(rokkaClient.organization, hash);
	} catch (e) {
		return null;
	}
};

export { checkCredentials, getImage };
