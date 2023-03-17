import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'rokka-check-credentials-interface',
	name: 'Check Rokka Credentials',
	icon: 'box',
	description: 'Check the Rokka credentials entered in the project settings.',
	component: InterfaceComponent,
	options: null,
	hideLabel: true,
	types: ['alias'],
});
