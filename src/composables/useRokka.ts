import { RokkaClient } from '../types/types';

const checkCredentials = async (rokkaClient: RokkaClient): Promise<boolean> => {
	try {
		await rokkaClient.api.stacks.list(rokkaClient.organization, 1);
		return true;
	} catch (e) {
		return false;
	}
};

export { checkCredentials };
