import { AxiosInstance } from 'axios';

const setRokkaHash = async (api: AxiosInstance, id: string, hash: string): Promise<string> => {
	const response = await api.patch(`/files/${id}`, { rokka_hash: hash });

	if (response.status === 200) {
		return response.data.data.rokka_hash;
	} else {
		throw new Error(`Couldn't update Rokka hash for ${id}`);
	}
};

export { setRokkaHash };
