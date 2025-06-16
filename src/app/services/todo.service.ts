import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Todo {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: 'Yüksek' | 'Orta' | 'Düşük';
  dueDate: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos: Todo[] = [];
  private todosSubject = new BehaviorSubject<Todo[]>([]);

  constructor() {
    this.loadTodos();
  }

  private loadTodos(): void {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      this.todos = JSON.parse(storedTodos);
      this.todosSubject.next(this.todos);
    }
  }

  private saveTodos(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
    this.todosSubject.next(this.todos);
  }

  getTodos(): Observable<Todo[]> {
    return this.todosSubject.asObservable();
  }

  getTodoById(id: number): Todo | undefined {
    return this.todos.find(todo => todo.id === id);
  }

  addTodo(todo: Omit<Todo, 'id'>): void {
    const newTodo: Todo = {
      ...todo,
      id: Date.now(),
      completed: false
    };
    this.todos.push(newTodo);
    this.saveTodos();
  }

  updateTodo(todo: Todo): void {
    const index = this.todos.findIndex(t => t.id === todo.id);
    if (index !== -1) {
      this.todos[index] = todo;
      this.saveTodos();
    }
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveTodos();
  }

  toggleComplete(id: number): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
    }
  }
} 