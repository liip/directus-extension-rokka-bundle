import { AxiosInstance } from 'axios';
import { RokkaCredentialsResponse } from '../types/types';

const getRokkaCredentials = async (api: AxiosInstance): Promise<RokkaCredentialsResponse> => {
	const response = await api.get('/settings?fields[]=rokka_organization&fields[]=rokka_api_key');

	if (response.status === 200) {
		return response.data.data;
	} else {
		return {};
	}
};

export { getRokkaCredentials };
