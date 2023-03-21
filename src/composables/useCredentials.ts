import { useApi } from '@directus/extensions-sdk';
import { RokkaCredentialsResponse } from '../types/types';

const getCredentials = async (): Promise<RokkaCredentialsResponse> => {
	const api = useApi();
	const response = await api.get('/settings?fields[]=rokka_organization&fields[]=rokka_api_key');

	if (response.data && response.data.data) {
		return response.data.data;
	} else {
		throw new Error('Couldnt fetch rokka credentials from settings');
	}
};

export { getCredentials };
