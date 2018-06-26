exports.up = function (knex, Promise) {
	return knex.schema.createTable('userAccounts', (table) => {
		table.increments('id').primary();
		table.integer('user_id').references('users.id');
		table.string('site', 60);
		table.string('bearer_token');
		table.string('refresh_token');
		table.timestamps();
	})
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTableIfExists('userAccounts');
};