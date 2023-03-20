import { RokkaApi } from 'rokka/dist/apis';

export interface RokkaClient {
	apiKey: string;
	organization: string;
	api: RokkaApi;
}
