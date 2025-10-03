export function subscribeToPush(): Promise<void>;
export function scheduleNotification(todo: { id: number; title: string; dueDate?: string }): void;
