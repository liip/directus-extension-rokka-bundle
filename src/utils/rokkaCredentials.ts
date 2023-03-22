import { AxiosInstance } from 'axios';
import { RokkaCredentialsResponse } from '../types/types';

const getRokkaCredentials = async (api: AxiosInstance): Promise<RokkaCredentialsResponse> => {
	const response = await api.get('/settings?fields[]=rokka_organization&fields[]=rokka_api_key');

	if (response.data && response.data.data) {
		return response.data.data;
	} else {
		throw new Error("Couldn't fetch Rokka credentials from Directus settings");
	}
};

export { getRokkaCredentials };
