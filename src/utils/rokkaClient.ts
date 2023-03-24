import rokka from 'rokka';
import { AxiosInstance } from 'axios';
import { RokkaClient } from '../types/types';
<<<<<<<< HEAD:src/utils/rokkaClient.ts
import { getRokkaCredentials } from '../utils/rokkaCredentials';
========
import { useCredentials } from './useCredentials';
>>>>>>>> main:src/utils/useRokkaClient.ts

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

<<<<<<<< HEAD:src/utils/rokkaClient.ts
const getRokkaClient = async (api: AxiosInstance): Promise<RokkaClient | null> => {
	const credentials = await getRokkaCredentials(api);
========
const useRokkaClient = async (api: AxiosInstance): Promise<RokkaClient | null> => {
	const credentials = await useCredentials(api);
>>>>>>>> main:src/utils/useRokkaClient.ts
	const { rokka_organization, rokka_api_key } = credentials;

	if (rokka_organization && rokka_api_key) {
		return getRokkaClientWithCredentials(rokka_organization, rokka_api_key);
	} else {
		throw new Error('Couldnt retrieve Rokka credentials');
	}
};

export { getRokkaClient, getRokkaClientWithCredentials };
