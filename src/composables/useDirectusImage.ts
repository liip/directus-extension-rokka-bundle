import { AxiosInstance } from 'axios';

const useDirectusImage = async (api: AxiosInstance, id: string): Promise<any> => {
	const response = await api.get(`/assets/${id}`, { responseType: 'blob' });

	if (response.status === 200) {
		return response.data;
	} else {
		throw new Error(`Couldnt fetch Directus image with id ${id}`);
	}
};

export { useDirectusImage };
