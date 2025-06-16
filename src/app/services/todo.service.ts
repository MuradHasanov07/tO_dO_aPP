import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from '../models/todo.model';

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
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.todos = JSON.parse(savedTodos);
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

  getTodoById(id: number): Observable<Todo | undefined> {
    const todo = this.todos.find(t => t.id === id);
    return new Observable(observer => {
      observer.next(todo);
      observer.complete();
    });
  }

  addTodo(todo: Omit<Todo, 'id'>): Observable<Todo> {
    const newTodo: Todo = {
      ...todo,
      id: Date.now(),
      completed: false
    };
    this.todos.push(newTodo);
    this.saveTodos();
    return new Observable(observer => {
      observer.next(newTodo);
      observer.complete();
    });
  }

  updateTodo(todo: Todo): Observable<Todo> {
    const index = this.todos.findIndex(t => t.id === todo.id);
    if (index !== -1) {
      this.todos[index] = todo;
      this.saveTodos();
    }
    return new Observable(observer => {
      observer.next(todo);
      observer.complete();
    });
  }

  deleteTodo(id: number): Observable<void> {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveTodos();
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  toggleComplete(id: number): Observable<Todo> {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      todo.completedAt = todo.completed ? new Date().toISOString() : undefined;
      this.saveTodos();
    }
    return new Observable(observer => {
      observer.next(todo!);
      observer.complete();
    });
  }
} 