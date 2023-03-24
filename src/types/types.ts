import { RokkaApi } from 'rokka/dist/apis';
import { StackOperation, StackOptions } from 'rokka/dist/apis/stacks';

export interface RokkaClient {
	apiKey: string;
	organization: string;
	api: RokkaApi;
}

export interface RokkaCredentialsResponse {
	rokka_organization?: string;
	rokka_api_key?: string;
}

export interface FocusPoint {
	x: number;
	y: number;
}

export interface RokkaStack {
	name: string;
	stack_operations: StackOperation[];
	stack_options: StackOptions;
}

export enum DiffStatus {
	unchanged = 'unchanged',
	created = 'created',
	updated = 'updated',
	deleted = 'deleted',
}

export interface RokkaStackDiff {
	stack: RokkaStack;
	status: DiffStatus;
}
