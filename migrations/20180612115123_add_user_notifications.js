exports.up = function (knex, Promise) {
	return knex.schema.createTable('userNotifications', (table) => {
		table.increments('id').primary();
		table.integer('user_id').references('users.id');
		table.json('notifications');
		table.timestamps();
	})
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTableIfExists('userNotifications');
};