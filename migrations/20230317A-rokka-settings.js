const SETTINGS_TABLE = 'directus_settings';
const FIELDS_TABLE = 'directus_fields';

const addColumn = async (knex, name, type, nullable = true, defaultvalue = null) => {
	const columnExists = await knex.schema.hasColumn(SETTINGS_TABLE, name);
	if (!columnExists) {
		await knex.schema.alterTable(SETTINGS_TABLE, (table) => {
			const column = table[type](name);

			if (!nullable) {
				column.notNullable();
			}

			if (defaultvalue) {
				column.defaultTo(defaultvalue);
			}
		});
	}
};

const addFieldConfig = (knex, name, config) =>
	knex(FIELDS_TABLE).insert({
		collection: SETTINGS_TABLE,
		field: name,
		...config,
	});

const removeColumn = async (knex, name) => {
	const columnExists = await knex.schema.hasColumn(SETTINGS_TABLE, name);
	if (columnExists) {
		await knex.schema.alterTable(SETTINGS_TABLE, (table) => {
			table.dropColumn(name);
		});
	}
};

const removeFieldConfig = (knex, name) =>
	knex(FIELDS_TABLE).where('collection', SETTINGS_TABLE).where('field', name).delete();

const TITLE = 'rokka_title';
const ORGANIZATION = 'rokka_organization';
const API_KEY = 'rokka_api_key';
const STACK_PREFIX = 'rokka_stack_prefix';
const CHECK_CREDENTIALS = 'rokka_check_credentials';
const SYNCHRONIZE_PRESETS = 'rokka_synchronize_presets';

module.exports = {
	async up(knex) {
		// Rokka Settings Title
		await addFieldConfig(knex, TITLE, {
			sort: 1,
			special: 'alias,no-data',
			interface: 'presentation-divider',
			options: '{"icon": "image", "title": "Rokka"}',
		});

		await addColumn(knex, ORGANIZATION, 'string');
		await addFieldConfig(knex, ORGANIZATION, {
			sort: 2,
			interface: 'input',
			options: '{"iconLeft": "business"}',
			translations:
				'[{"language": "en-US", "translation": "Organization"}, {"language": "de-DE", "translation": "Organisation"}]',
		});

		await addColumn(knex, API_KEY, 'string');
		await addFieldConfig(knex, API_KEY, {
			sort: 3,
			interface: 'input',
			options: '{"iconLeft": "key", "placeholder": "431Lj0Sv7jrPioK8..."}',
			translations:
				'[{"language": "en-US", "translation": "API Key"}, {"language": "de-DE", "translation": "API-Schlüssel"}]',
		});

		await addColumn(knex, STACK_PREFIX, 'string', false, 'directus');
		await addFieldConfig(knex, STACK_PREFIX, {
			sort: 4,
			interface: 'input',
			options: '{"iconLeft": "abc"}',
			translations:
				'[{"language": "en-US", "translation": "Stack Prefix"}, {"language": "de-DE", "translation": "Stack-Präfix"}]',
			note: 'The Stack Prefix is prepended to the key of the transformation presets when synchronising them to Rokka',
		});

		await addFieldConfig(knex, CHECK_CREDENTIALS, {
			sort: 5,
			special: 'alias,no-data',
			interface: 'rokka-check-credentials-interface',
		});

		await addFieldConfig(knex, SYNCHRONIZE_PRESETS, {
			sort: 6,
			special: 'alias,no-data',
			interface: 'rokka-synchronize-presets-interface',
		});
	},

	async down(knex) {
		await removeFieldConfig(knex, SYNCHRONIZE_PRESETS);

		await removeFieldConfig(knex, CHECK_CREDENTIALS);

		await removeFieldConfig(knex, STACK_PREFIX);
		await removeColumn(knex, STACK_PREFIX);

		await removeFieldConfig(knex, API_KEY);
		await removeColumn(knex, API_KEY);

		await removeFieldConfig(knex, ORGANIZATION);
		await removeColumn(knex, ORGANIZATION);

		await removeFieldConfig(knex, TITLE);
	},
};
