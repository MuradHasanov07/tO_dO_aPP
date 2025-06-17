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
    <div class="todo-list-container">
      <div class="list-header">
        <div class="stats">
          <h2>Görevlerim</h2>
          <p class="completed-count">
            Tamamlanan:
            <span class="count">{{ completedCount }}/{{ totalCount }}</span>
          </p>
        </div>

        <div class="quick-actions">
          <button class="btn-add" routerLink="/add">
            <i class="fas fa-plus"></i> Yeni Görev Ekle
          </button>
        </div>
      </div>

      <app-filter (filterChange)="onFilterChange($event)"></app-filter>

      <div class="todos-grid" *ngIf="filteredTodos.length > 0; else noTodos">
        @for (todo of filteredTodos; track todo.id) {
        <div class="todo-card" [class.completed]="todo.completed">
          <div class="todo-header">
            <button class="btn-complete" (click)="toggleComplete(todo)">
              <i
                class="fas"
                [class.fa-check]="!todo.completed"
                [class.fa-check-circle]="todo.completed"
              ></i>
            </button>
            <h3 [class.completed]="todo.completed" class="todo-title">
              {{ todo.title }}
            </h3>
            <div class="todo-actions">
              <button
                class="btn-edit"
                [routerLink]="['/edit', todo.id]"
                title="Düzenle"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="btn-delete"
                (click)="confirmDelete(todo)"
                title="Sil"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>

          <p class="description" *ngIf="todo.description">
            {{ todo.description }}
          </p>

          <div class="todo-details">
            <span class="category"
              >{{ getCategoryEmoji(todo.category) }} {{ todo.category }}</span
            >
            <span class="priority" [class]="todo.priority.toLowerCase()">{{
              todo.priority
            }}</span>
            <span class="due-date">{{
              todo.dueDate | date : 'dd/MM/yyyy'
            }}</span>
          </div>
        </div>
        }
      </div>

      <ng-template #noTodos>
        <div class="no-todos">
          <i class="fas fa-clipboard-list"></i>
          <h3>Henüz görev bulunmuyor</h3>
          <p>Yeni bir görev ekleyerek başlayın!</p>
          <button class="btn-add-large" routerLink="/add">
            <i class="fas fa-plus"></i> İlk Görevimi Ekle
          </button>
        </div>
      </ng-template>

      <!-- Delete Confirmation Modal -->
      <div
        class="modal-overlay"
        *ngIf="showDeleteModal"
        (click)="cancelDelete()"
      >
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>
              <i class="fas fa-exclamation-triangle"></i>
              Görevi Sil
            </h3>
          </div>

          <div class="modal-body">
            <p>
              <strong>"{{ todoToDelete?.title }}"</strong> görevini silmek
              istediğinizden emin misiniz?
            </p>
            <p class="warning-text">Bu işlem geri alınamaz.</p>
          </div>

          <div class="modal-actions">
            <button class="btn-cancel" (click)="cancelDelete()">
              <i class="fas fa-times"></i> Hayır
            </button>
            <button class="btn-confirm" (click)="confirmDeleteAction()">
              <i class="fas fa-trash"></i> Evet, Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .todo-list-container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: var(--dark-card);
        border-radius: 10px;
        border: 1px solid #444;
      }

      .stats h2 {
        color: var(--text-light);
        margin: 0 0 0.5rem 0;
        font-size: 1.8rem;
      }

      .completed-count {
        color: var(--text-secondary);
        margin: 0;
        font-size: 1rem;
      }

      .count {
        color: var(--neon-blue);
        font-weight: bold;
      }

      .quick-actions .btn-add {
        background: var(--neon-blue);
        color: var(--dark-bg);
        border: none;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
      }

      .btn-add:hover {
        transform: translateY(-2px);
        box-shadow: var(--neon-shadow);
      }

      .todos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
      }

      .todo-card {
        background: var(--dark-card);
        border: 1px solid transparent;
        border-radius: 10px;
        padding: 1.5rem;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        min-height: 200px;
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
        align-items: flex-start;
        margin-bottom: 1rem;
        gap: 1rem;
      }

      .todo-title {
        margin: 0;
        color: var(--text-light);
        font-size: 1.2rem;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 200px;
      }

      .todo-title.completed {
        text-decoration: line-through;
        color: var(--text-secondary);
      }

      .todo-actions {
        display: flex;
        gap: 0.5rem;
        flex-shrink: 0;
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
        color: #ff4444;
      }

      .btn-complete {
        color: var(--text-secondary);
        transition: all 0.3s ease;
        flex-shrink: 0;
      }

      .btn-complete i.fa-check-circle {
        color: var(--neon-green);
      }

      .todo-actions button:hover {
        background: var(--dark-bg);
      }

      .description {
        color: var(--text-light);
        margin-bottom: 1rem;
        font-size: 0.9rem;
        line-height: 1.5;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        max-height: 4.5em;
      }

      .todo-details {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        font-size: 0.8rem;
        margin-top: auto;
      }

      .category,
      .priority,
      .due-date {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.1);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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

      .no-todos {
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-secondary);
      }

      .no-todos i {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
      }

      .no-todos h3 {
        color: var(--text-light);
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }

      .no-todos p {
        margin-bottom: 2rem;
        font-size: 1rem;
      }

      .btn-add-large {
        background: var(--neon-blue);
        color: var(--dark-bg);
        border: none;
        padding: 1.2rem 2rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        font-size: 1.1rem;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
      }

      .btn-add-large:hover {
        transform: translateY(-2px);
        box-shadow: var(--neon-shadow);
      }

      /* Delete Modal Styles */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
      }

      .modal-content {
        background: var(--dark-card);
        border: 2px solid var(--neon-blue);
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 123, 255, 0.3);
        animation: modalSlideIn 0.3s ease-out;
      }

      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-50px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #444;
        background: linear-gradient(135deg, var(--dark-bg), var(--dark-card));
      }

      .modal-header h3 {
        margin: 0;
        color: var(--text-light);
        font-size: 1.3rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .modal-header i {
        color: #ff4444;
        font-size: 1.2rem;
      }

      .modal-body {
        padding: 2rem 1.5rem;
      }

      .modal-body p {
        margin: 0 0 1rem 0;
        color: var(--text-light);
        font-size: 1rem;
        line-height: 1.5;
      }

      .modal-body strong {
        color: var(--neon-blue);
      }

      .warning-text {
        color: #ff9100;
        font-size: 0.9rem;
        font-style: italic;
      }

      .modal-actions {
        padding: 1rem 1.5rem 1.5rem;
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        border-top: 1px solid #444;
      }

      .btn-cancel,
      .btn-confirm {
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        font-size: 1rem;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .btn-cancel {
        background: var(--dark-bg);
        color: var(--text-light);
        border: 1px solid #444;
      }

      .btn-cancel:hover {
        border-color: var(--neon-blue);
        box-shadow: 0 0 10px rgba(0, 123, 255, 0.3);
      }

      .btn-confirm {
        background: #ff4444;
        color: white;
        border: 1px solid #ff4444;
      }

      .btn-confirm:hover {
        background: #ff3333;
        box-shadow: 0 0 15px rgba(255, 68, 68, 0.4);
        transform: translateY(-1px);
      }

      @media (max-width: 768px) {
        .todos-grid {
          grid-template-columns: 1fr;
        }

        .list-header {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }

        .todo-title {
          max-width: 150px;
        }
      }
    `,
  ],
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  currentFilters: FilterOptions = {
    category: '',
    priority: '',
    status: '',
    dueDate: null,
  };
  completedCount: number = 0;
  totalCount: number = 0;

  // Delete modal properties
  showDeleteModal: boolean = false;
  todoToDelete: Todo | null = null;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe((todos) => {
      this.todos = todos;
      this.applyFilters();
      this.calculateCounts();
    });
  }

  onFilterChange(filters: FilterOptions) {
    this.currentFilters = filters;
    this.applyFilters();
  }

  private applyFilters() {
    this.filteredTodos = this.todos.filter((todo) => {
      if (
        this.currentFilters.category &&
        todo.category !== this.currentFilters.category
      ) {
        return false;
      }
      if (
        this.currentFilters.priority &&
        todo.priority !== this.currentFilters.priority
      ) {
        return false;
      }
      if (this.currentFilters.status) {
        if (this.currentFilters.status === 'Tamamlanan' && !todo.completed) {
          return false;
        }
        if (this.currentFilters.status === 'Tamamlanmayan' && todo.completed) {
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

  private calculateCounts() {
    this.totalCount = this.todos.length;
    this.completedCount = this.todos.filter((todo) => todo.completed).length;
  }

  toggleComplete(todo: Todo) {
    todo.completed = !todo.completed;
    this.todoService.updateTodo(todo).subscribe(() => {
      this.calculateCounts();
    });
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.loadTodos();
    });
  }

  confirmDelete(todo: Todo) {
    this.todoToDelete = todo;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.todoToDelete = null;
  }

  confirmDeleteAction() {
    if (this.todoToDelete) {
      this.deleteTodo(this.todoToDelete.id);
      this.cancelDelete();
    }
  }

  getCategoryEmoji(category: string): string {
    const emojis: { [key: string]: string } = {
      İş: '💼',
      Kişisel: '👤',
      Alışveriş: '🛒',
      Sağlık: '🏥',
      Eğitim: '📚',
    };
    return emojis[category] || '📝';
  }
}
