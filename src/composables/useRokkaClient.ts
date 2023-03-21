import rokka from 'rokka';
import { AxiosInstance } from 'axios';
import { RokkaClient } from '../types/types';
import { useCredentials } from './useCredentials';

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

const useRokkaClient = async (api: AxiosInstance): Promise<RokkaClient | null> => {
	const credentials = await useCredentials(api);
	const { rokka_organization, rokka_api_key } = credentials;

	if (rokka_organization && rokka_api_key) {
		return useRokkaClientWithCredentials(rokka_organization, rokka_api_key);
	} else {
		throw new Error('Couldnt retrieve Rokka credentials');
	}
};

export { useRokkaClient, useRokkaClientWithCredentials };
