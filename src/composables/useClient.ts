import rokka from 'rokka';
import { RokkaClient } from '../types/types';

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

export { useRokkaClientWithCredentials };
