import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'rokka-file-details-interface',
	name: 'Rokka File Details',
	icon: 'box',
	description: 'Display detailed Rokka information about a file.',
	component: InterfaceComponent,
	options: null,
	types: ['string'],
});
