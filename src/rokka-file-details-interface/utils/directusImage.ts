import { AxiosInstance } from 'axios';

const getDirectusImage = async (api: AxiosInstance, id: string): Promise<Blob> => {
	const response = await api.get(`/assets/${id}`, { responseType: 'blob' });

	if (response.status === 200) {
		return response.data;
	} else {
		throw new Error(`Couldnt fetch Directus image with id ${id}`);
	}
};

export { getDirectusImage };
