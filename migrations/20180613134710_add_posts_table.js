exports.up = function (knex, Promise) {
	return knex.schema.createTable('posts', (table) => {
		table.increments('id').primary();
		table.integer('user_id').references('users.id');
		table.string('site', 60)
		table.json('posts');
		table.timestamps();
	})
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTableIfExists('posts');
};