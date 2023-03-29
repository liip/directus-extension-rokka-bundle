import rokka from 'rokka';
import { AxiosInstance } from 'axios';
import { RokkaClient } from '../types/types';
import { getRokkaCredentials } from '../utils/rokkaCredentials';

const getRokkaClientWithCredentials = (organization: string, apiKey: string): RokkaClient => {
	const rokkaApi = rokka({
		apiKey: apiKey,
	});

	return {
		apiKey: apiKey,
		organization: organization,
		api: rokkaApi,
	};
};

const getRokkaClient = async (api: AxiosInstance): Promise<RokkaClient> => {
	const credentials = await getRokkaCredentials(api);
	const { rokka_organization, rokka_api_key } = credentials;

	return getRokkaClientWithCredentials(rokka_organization ?? '', rokka_api_key ?? '');
};

export { getRokkaClient, getRokkaClientWithCredentials };
