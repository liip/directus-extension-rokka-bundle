import { RokkaApi } from 'rokka/dist/apis';

export interface RokkaClient {
	apiKey: string;
	organization: string;
	api: RokkaApi;
}

export interface RokkaCredentialsResponse {
	rokka_organization?: string;
	rokka_api_key?: string;
}
