import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TodoService, Todo } from '../../services/todo.service';
import { FilterComponent, FilterOptions } from '../filter/filter.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FilterComponent, TodoFormComponent],
  template: `
    <div class="todo-list-container">
      <h1 class="title">Görev Yöneticisi</h1>
      
      <app-todo-form></app-todo-form>
      
      <app-filter (filterChange)="onFilterChange($event)"></app-filter>
      
      <div class="todos-grid">
        <div *ngFor="let todo of filteredTodos" class="todo-card" [class.completed]="todo.completed">
          <div class="todo-header">
            <h3 [class.completed-text]="todo.completed">{{ todo.title }}</h3>
            <div class="todo-actions">
              <button class="btn-complete" (click)="toggleComplete(todo.id)">
                <i class="fas" [class.fa-check-circle]="todo.completed" [class.fa-circle]="!todo.completed"></i>
              </button>
              <a [routerLink]="['/edit', todo.id]" class="btn-edit">
                <i class="fas fa-edit"></i>
              </a>
              <button class="btn-delete" (click)="deleteTodo(todo.id)">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          <p class="description" *ngIf="todo.description">{{ todo.description }}</p>
          
          <div class="todo-details">
            <span class="category">{{ todo.category }}</span>
            <span class="priority" [class]="'priority-' + todo.priority.toLowerCase()">
              {{ todo.priority }}
            </span>
            <span class="due-date">
              {{ todo.dueDate | date:'dd/MM/yyyy' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .todo-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .title {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
      font-size: 2.5rem;
      animation: fadeIn 0.5s ease-in;
    }

    .todos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .todo-card {
      background: white;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .todo-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .todo-card.completed {
      opacity: 0.7;
    }

    .todo-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .todo-header h3 {
      margin: 0;
      font-size: 1.2rem;
      color: #333;
    }

    .completed-text {
      text-decoration: line-through;
      color: #888;
    }

    .todo-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-complete, .btn-edit, .btn-delete {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      transition: transform 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
    }

    .btn-complete:hover, .btn-edit:hover, .btn-delete:hover {
      transform: scale(1.1);
    }

    .btn-delete:hover {
      color: #ff4444;
    }

    .btn-edit {
      color: #4a90e2;
      text-decoration: none;
    }

    .btn-edit:hover {
      color: #357abd;
    }

    .fa-check-circle {
      color: #4CAF50;
    }

    .description {
      color: #666;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .todo-details {
      display: flex;
      gap: 1rem;
      font-size: 0.8rem;
    }

    .category, .priority, .due-date {
      padding: 0.3rem 0.6rem;
      border-radius: 15px;
      background: #f0f0f0;
    }

    .priority-yüksek {
      background: #ffebee;
      color: #c62828;
    }

    .priority-orta {
      background: #fff3e0;
      color: #ef6c00;
    }

    .priority-düşük {
      background: #e8f5e9;
      color: #2e7d32;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .todo-list-container {
        padding: 1rem;
      }

      .todos-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  currentFilters: FilterOptions = {
    category: '',
    priority: '',
    status: '',
    dueDate: ''
  };

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
      this.applyFilters();
    });
  }

  toggleComplete(id: number): void {
    this.todoService.toggleComplete(id);
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id);
  }

  onFilterChange(filters: FilterOptions): void {
    this.currentFilters = filters;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredTodos = this.todos.filter(todo => {
      // Kategori filtresi
      if (this.currentFilters.category && todo.category !== this.currentFilters.category) {
        return false;
      }

      // Öncelik filtresi
      if (this.currentFilters.priority && todo.priority !== this.currentFilters.priority) {
        return false;
      }

      // Durum filtresi
      if (this.currentFilters.status) {
        if (this.currentFilters.status === 'Tamamlanan' && !todo.completed) {
          return false;
        }
        if (this.currentFilters.status === 'Tamamlanmayan' && todo.completed) {
          return false;
        }
      }

      // Tarih filtresi
      if (this.currentFilters.dueDate) {
        const todoDate = new Date(todo.dueDate).toISOString().split('T')[0];
        if (todoDate !== this.currentFilters.dueDate) {
          return false;
        }
      }

      return true;
    });
  }
} 