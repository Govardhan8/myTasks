import { useEffect, useState } from 'react';
import { addTodo, getTodos, updateTodo, deleteTodo } from './db';
import { subscribeToPush, scheduleNotification } from "./utils/notifications";

interface Todo {
    id: number;
    title: string;
    completed: boolean;
    dueDate?: string; // ISO string for scheduled time
}

export default function TodoApp() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState('');

    useEffect(() => {
        fetchTodos();
        subscribeToPush(); // request push permission & subscribe user
    }, []);

    const fetchTodos = async () => {
        const allTodos = await getTodos();
        setTodos(allTodos);

        // Schedule notifications for all todos with dueDate
        allTodos.forEach(todo => {
            if (todo.dueDate) {
                scheduleNotification(todo);
            }
        });
    };

    const handleAdd = async () => {
        if (!newTodo.trim()) return;

        const todoObj: Omit<Todo, 'id'> = { title: newTodo, completed: false, dueDate: dueDate || undefined };
        await addTodo(todoObj);
        setNewTodo('');
        setDueDate('');
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
        const todo = todos.find(t => t.id === id)!;
        await updateTodo({ id, title: editingText, completed: todo.completed, dueDate: todo.dueDate });
        setEditingId(null);
        setEditingText('');
        fetchTodos();
    };

    return (
        <div className="todo-container">
            <h1>My tasks</h1>
            <div className="todo-input">
                <input
                    type="text"
                    value={newTodo}
                    onChange={e => setNewTodo(e.target.value)}
                    placeholder="Enter new todo"
                />
            </div>
            <div>
                <input
                    className='calender'
                    type="datetime-local"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    placeholder="Set reminder"
                />
            </div>
            <button className='submitBtn' onClick={handleAdd}>Add</button>
            <ul className="todo-list">
                {todos.map(todo => (
                    <li key={todo.id}>
                        <div className='todo-item'>
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
                                    className={`content ${todo.completed ? 'completed' : ''} `}
                                    onDoubleClick={() => handleEdit(todo)}
                                >
                                    {todo.title}
                                    {todo.dueDate && (
                                        <small style={{ marginLeft: 8 }}>
                                            ⏰ {new Date(todo.dueDate).toLocaleString()}
                                        </small>
                                    )}
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
