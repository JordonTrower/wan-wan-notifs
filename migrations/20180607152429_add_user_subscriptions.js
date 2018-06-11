exports.up = function (knex, Promise) {
  return knex.schema.createTable('userSubscriptions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').references('users.id');
    table.json('subscriptions');
    table.timestamps();
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('userSubscriptions');
};