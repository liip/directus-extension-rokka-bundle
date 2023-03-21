import rokka from 'rokka';
import { RokkaClient } from '../types/types';
import { getCredentials } from './useCredentials';

const useRokkaClientWithCredentials = (organization: string, apiKey: string): RokkaClient => {
	const rokkaApi = rokka({
		apiKey: apiKey,
	});

	return {
		apiKey: apiKey,
		organization: organization,
		api: rokkaApi,
	};
};

const useRokkaClient = async (): Promise<RokkaClient | null> => {
	const credentials = await getCredentials();
	const { rokka_organization, rokka_api_key } = credentials;

	if (rokka_organization && rokka_api_key) {
		return useRokkaClientWithCredentials(rokka_organization, rokka_api_key);
	} else {
		throw new Error('Couldnt retrieve Rokka credentials');
	}
};

export { useRokkaClient, useRokkaClientWithCredentials };
