import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'rokka-synchronize-presets-interface',
	name: 'Rokka Synchronize Stacks',
	icon: 'box',
	description: 'Synchronize the Directus transformation presets to Rokka stacks',
	component: InterfaceComponent,
	options: null,
	hideLabel: true,
	types: ['alias'],
});
