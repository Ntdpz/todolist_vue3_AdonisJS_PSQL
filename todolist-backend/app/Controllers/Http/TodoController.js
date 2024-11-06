const Todo = use('App/Models/Todo');

class TodoController {
    async index({ response }) {
        try {
            const todos = await Todo.all();
            return response.json(todos);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Failed to fetch todos' });
        }
    }


    async store({ request, response }) {
        const data = request.only(['title', 'description', 'status', 'due_date']);
        const todo = await Todo.create(data);
        return response.status(201).json(todo);
    }

    async show({ params, response }) {
        const todo = await Todo.find(params.id);
        return response.json(todo);
    }

    async update({ params, request, response }) {
        const todo = await Todo.find(params.id);
        todo.merge(request.only(['title', 'description', 'status', 'due_date']));
        await todo.save();
        return response.json(todo);
    }

    async destroy({ params, response }) {
        const todo = await Todo.find(params.id);
        await todo.delete();
        return response.status(204).send();
    }
}

module.exports = TodoController;
