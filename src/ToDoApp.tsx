import { useEffect, useState } from 'react';
import { addTodo, getTodos, updateTodo, deleteTodo } from './db';

interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

export default function TodoApp() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const allTodos = await getTodos();
        setTodos(allTodos);
    };

    const handleAdd = async () => {
        if (!newTodo.trim()) return;
        await addTodo({ title: newTodo, completed: false });
        setNewTodo('');
        fetchTodos();
    };

    const handleToggle = async (todo: Todo) => {
        await updateTodo({ ...todo, completed: !todo.completed });
        fetchTodos();
    };

    const handleDelete = async (id: number) => {
        await deleteTodo(id);
        fetchTodos();
    };

    const handleEdit = (todo: Todo) => {
        setEditingId(todo.id);
        setEditingText(todo.title);
    };

    const handleUpdate = async (id: number) => {
        if (!editingText.trim()) return;
        await updateTodo({ id, title: editingText, completed: todos.find(t => t.id === id)!.completed });
        setEditingId(null);
        setEditingText('');
        fetchTodos();
    };

    return (
        <div className="todo-container">
            <h1>ToDo App</h1>
            <div className="todo-input">
                <input
                    type="text"
                    value={newTodo}
                    onChange={e => setNewTodo(e.target.value)}
                    placeholder="Enter new todo"
                />
                <button onClick={handleAdd}>Add</button>
            </div>

            <ul className="todo-list">
                {todos.map(todo => (
                    <li key={todo.id}>
                        <div>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => handleToggle(todo)}
                            />

                            {editingId === todo.id ? (
                                <input
                                    type="text"
                                    value={editingText}
                                    onChange={e => setEditingText(e.target.value)}
                                    onBlur={() => handleUpdate(todo.id)}
                                    onKeyDown={e => e.key === 'Enter' && handleUpdate(todo.id)}
                                    autoFocus
                                />
                            ) : (
                                <span
                                    className={todo.completed ? 'completed' : ''}
                                    onDoubleClick={() => handleEdit(todo)}
                                >
                                    {todo.title}
                                </span>
                            )}
                        </div>

                        <button className="delete-btn" onClick={() => handleDelete(todo.id)}>X</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
