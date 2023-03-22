import { AxiosInstance } from 'axios';

const getDirectusAccessToken = (api: AxiosInstance): string | null => {
	const authorizationHeaders = api.defaults.headers.common['Authorization'];
	const accessToken = authorizationHeaders?.toString().split(' ')[1]
	return accessToken ?? null;
}

export { getDirectusAccessToken };
