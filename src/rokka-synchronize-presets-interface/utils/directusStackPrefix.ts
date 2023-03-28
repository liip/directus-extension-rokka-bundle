import { AxiosInstance } from 'axios';

const getStackPrefix = async (api: AxiosInstance): Promise<string> => {
	const response = await api.get('/settings?fields[]=rokka_stack_prefix');

	if (response.status === 200) {
		return response.data.data.rokka_stack_prefix;
	} else {
		throw new Error("Couldn't fetch transformation presets from Directus settings");
	}
};

export { getStackPrefix };
