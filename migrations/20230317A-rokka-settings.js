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

const ROKKA_TITLE = 'rokka_title';
const ORGANIZATION = 'organization';
const API_KEY = 'api_key';
const STACK_PREFIX = 'stack_prefix';

module.exports = {
	async up(knex) {
		// Rokka Settings Title
		await addFieldConfig(knex, ROKKA_TITLE, {
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
		});
	},

	async down(knex) {
		await removeFieldConfig(knex, STACK_PREFIX);
		await removeColumn(knex, STACK_PREFIX);

		await removeFieldConfig(knex, API_KEY);
		await removeColumn(knex, API_KEY);

		await removeFieldConfig(knex, ORGANIZATION);
		await removeColumn(knex, ORGANIZATION);

		await removeFieldConfig(knex, ROKKA_TITLE);
	},
};
