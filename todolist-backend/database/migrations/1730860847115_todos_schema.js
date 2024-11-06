const Schema = use('Schema');

class TodosSchema extends Schema {
  up() {
    this.create('todos', (table) => {
      table.increments();
      table.string('title', 255).notNullable();
      table.text('description');
      table.enu('status', ['pending', 'in_progress', 'completed']).defaultTo('pending');
      table.timestamp('due_date');
      table.timestamps();
    });
  }

  down() {
    this.drop('todos');
  }
}

module.exports = TodosSchema;
