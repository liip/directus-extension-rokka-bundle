import { AxiosInstance } from 'axios';
import { RokkaCredentialsResponse } from '../types/types';

const useCredentials = async (api: AxiosInstance): Promise<RokkaCredentialsResponse> => {
	const response = await api.get('/settings?fields[]=rokka_organization&fields[]=rokka_api_key');

	if (response.data && response.data.data) {
		return response.data.data;
	} else {
		throw new Error('Couldnt fetch rokka credentials from settings');
	}
};

export { useCredentials };
