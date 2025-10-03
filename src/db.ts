// src/db.ts
import { openDB } from 'idb';

const DB_NAME = 'todo-db';
const STORE_NAME = 'todos';
const DB_VERSION = 1;

// Initialize DB
export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        // Add indexes for filtering/search if needed
        store.createIndex('completed', 'completed');
        store.createIndex('dueDate', 'dueDate');
      }
    }
  });
};

// Add a todo
export const addTodo = async (todo: { title: string; completed: boolean; dueDate?: string }) => {
  const db = await initDB();
  return db.add(STORE_NAME, todo);
};

// Get all todos
export const getTodos = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

// Update a todo
export const updateTodo = async (todo: { id: number; title: string; completed: boolean; dueDate?: string }) => {
  const db = await initDB();
  return db.put(STORE_NAME, todo);
};

// Delete a todo
export const deleteTodo = async (id: number) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};
