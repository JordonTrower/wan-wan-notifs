exports.up = function (knex, Promise) {
	return knex.schema.createTable('sessions', (table) => {
		table.string('sid').primary().notNullable();
		table.json('sess').notNullable();
		table.timestamp('expired').notNullable();

	})
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTableIfExists('sessions');
};