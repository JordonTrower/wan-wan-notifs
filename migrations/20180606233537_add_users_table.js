exports.up = function (knex, Promise) {
	return knex.schema.createTable('users', table => {
		table.increments('id').primary();
		table.string('name');
		table.string('auth_id');
		table.string('email');
	})
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTableIfExists('users');
};