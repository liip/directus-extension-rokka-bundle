import { AxiosInstance } from 'axios';
import { SettingsStorageAssetPreset } from '@directus/shared/types';

const getTransformationPresets = async (api: AxiosInstance): Promise<SettingsStorageAssetPreset[]> => {
	const response = await api.get('/settings?fields[]=storage_asset_presets');

	if (response.status === 200) {
		return response.data.data.storage_asset_presets || [];
	} else {
		throw new Error("Couldn't fetch transformation presets from Directus settings");
	}
};

export { getTransformationPresets };
