import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { FilterComponent, FilterOptions } from '../filter/filter.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FilterComponent],
  template: `
    <div class="todo-list">
      <div class="completed-tasks">
        <h3>Tamamlanan Görevler {{ completedToday }}/5</h3>
        <app-filter (filterChange)="onFilterChange($event)"></app-filter>
      </div>
      <div class="todos">
        @for (todo of filteredTodos; track todo.id) {
          <div class="todo-card" [class.completed]="todo.completed">
            <div class="todo-header">
              <button class="btn-complete" (click)="toggleComplete(todo)">
                <i class="fas" [class.fa-check]="!todo.completed" [class.fa-check-circle]="todo.completed"></i>
              </button>
              <h3 [class.completed]="todo.completed">{{ todo.title }}</h3>
              <div class="todo-actions">
                <button class="btn-edit" [routerLink]="['/edit', todo.id]">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" (click)="deleteTodo(todo.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <p class="description">{{ todo.description }}</p>
            <div class="todo-details">
              <span class="category">{{ getCategoryEmoji(todo.category) }} {{ todo.category }}</span>
              <span class="priority" [class]="todo.priority.toLowerCase()">{{ todo.priority }}</span>
              <span class="due-date">Son Tarih: {{ todo.dueDate | date:'dd/MM/yyyy' }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .todo-list {
      margin-top: 2rem;
    }

    .completed-tasks {
      margin-bottom: 1.5rem;
    }

    .completed-tasks h3 {
      color: var(--text-color);
      margin-bottom: 1rem;
    }

    .todos {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .todo-card {
      background: var(--dark-card);
      border: 1px solid transparent;
      border-radius: 10px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .todo-card:hover {
      border-color: var(--neon-blue);
      box-shadow: var(--neon-shadow);
      transform: translateY(-2px);
    }

    .todo-card.completed {
      opacity: 0.7;
      border-color: var(--neon-green);
    }

    .todo-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .todo-header h3 {
      margin: 0;
      color: var(--text-light);
      font-size: 1.2rem;
      flex: 1;
    }

    .todo-header h3.completed {
      text-decoration: line-through;
      color: var(--text-secondary);
    }

    .todo-actions {
      display: flex;
      gap: 0.5rem;
    }

    .todo-actions button {
      background: none;
      border: none;
      color: var(--text-light);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 5px;
      transition: all 0.3s ease;
    }

    .btn-edit {
      color: var(--neon-blue);
    }

    .btn-delete {
      color: var(--neon-red);
    }

    .btn-complete {
      color: var(--text-secondary);
      transition: all 0.3s ease;
    }

    .btn-complete i.fa-check-circle {
      color: var(--neon-green);
    }

    .todo-actions button:hover {
      background: var(--dark-bg);
    }

    .btn-edit:hover {
      color: var(--neon-blue);
    }

    .btn-delete:hover {
      color: var(--neon-red);
    }

    .description {
      color: var(--text-light);
      margin-bottom: 1rem;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .todo-details {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-size: 0.8rem;
    }

    .category, .priority, .due-date {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
    }

    .priority {
      font-weight: bold;
      border-radius: 5px;
      padding: 4px 10px;
      
      &.yüksek {
        background-color: #ff1744;
        color: #ffffff;
      }
      &.orta {
        background-color: #ff9100;
        color: #ffffff;
      }
      &.düşük {
        background-color: #00c853;
        color: #ffffff;
      }
    }

    @media (max-width: 768px) {
      .todos {
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
    dueDate: null
  };
  completedToday: number = 0;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
      this.applyFilters();
      this.calculateCompletedToday();
    });
  }

  onFilterChange(filters: FilterOptions) {
    this.currentFilters = filters;
    this.applyFilters();
  }

  private applyFilters() {
    this.filteredTodos = this.todos.filter(todo => {
      if (this.currentFilters.category && todo.category !== this.currentFilters.category) {
        return false;
      }
      if (this.currentFilters.priority && todo.priority !== this.currentFilters.priority) {
        return false;
      }
      if (this.currentFilters.status) {
        if (this.currentFilters.status === 'completed' && !todo.completed) {
          return false;
        }
        if (this.currentFilters.status === 'active' && todo.completed) {
          return false;
        }
      }
      if (this.currentFilters.dueDate) {
        const todoDate = new Date(todo.dueDate).toDateString();
        const filterDate = new Date(this.currentFilters.dueDate).toDateString();
        if (todoDate !== filterDate) {
          return false;
        }
      }
      return true;
    });
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.loadTodos();
    });
  }

  toggleComplete(todo: Todo) {
    const updatedTodo = { ...todo, completed: !todo.completed };
    this.todoService.updateTodo(updatedTodo).subscribe(() => {
      this.loadTodos();
    });
  }

  calculateCompletedToday() {
    const today = new Date().toDateString();
    this.completedToday = this.todos.filter(todo => 
      todo.completed && todo.completedAt && new Date(todo.completedAt).toDateString() === today
    ).length;
  }

  getCategoryEmoji(category: string): string {
    const emojiMap: { [key: string]: string } = {
      'İş': '💼',
      'Kişisel': '🧍',
      'Alışveriş': '🛒',
      'Sağlık': '🏥',
      'Eğitim': '🎓'
    };
    return emojiMap[category] || '';
  }
} 