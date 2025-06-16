export interface Todo {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  completed: boolean;
  completedAt?: string;
  dueDate: string;
} 