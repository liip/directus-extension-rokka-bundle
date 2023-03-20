const FILES_TABLE = 'directus_files';
const FIELDS_TABLE = 'directus_fields';

const addColumn = async (knex, name, type) => {
	const columnExists = await knex.schema.hasColumn(FILES_TABLE, name);
	if (!columnExists) {
		await knex.schema.alterTable(FILES_TABLE, (table) => {
			table[type](name);
		});
	}
};

const addFieldConfig = (knex, name, config) =>
	knex(FIELDS_TABLE).insert({
		collection: FILES_TABLE,
		field: name,
		...config,
	});

const removeColumn = async (knex, name) => {
	const columnExists = await knex.schema.hasColumn(FILES_TABLE, name);
	if (columnExists) {
		await knex.schema.alterTable(FILES_TABLE, (table) => {
			table.dropColumn(name);
		});
	}
};

const removeFieldConfig = (knex, name) =>
	knex(FIELDS_TABLE).where('collection', FILES_TABLE).where('field', name).delete();

const HASH = 'rokka_hash';

module.exports = {
	async up(knex) {
		await addColumn(knex, HASH, 'string');
		await addFieldConfig(knex, HASH, {
			sort: 1,
			interface: 'rokka-file-details-interface',
			translations:
				'[{"language": "en-US", "translation": "Rokka File Details"}, {"language": "de-DE", "translation": "Rokka Dateidetails"}]',
		});
	},

	async down(knex) {
		await removeFieldConfig(knex, HASH);
		await removeColumn(knex, HASH);
	},
};
