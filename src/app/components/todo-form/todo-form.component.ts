import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-container neon-border">
      <h2 class="form-title">Yeni Görev Ekle</h2>
      <form (ngSubmit)="onSubmit()" #todoForm="ngForm">
        <div class="form-group">
          <label for="title">Görev Başlığı</label>
          <input
            type="text"
            id="title"
            name="title"
            [(ngModel)]="todo.title"
            required
            class="form-control"
          >
        </div>

        <div class="form-group">
          <label for="description">Açıklama</label>
          <textarea
            id="description"
            name="description"
            [(ngModel)]="todo.description"
            class="form-control"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="category">Kategori</label>
          <select
            id="category"
            name="category"
            [(ngModel)]="todo.category"
            required
            class="form-control"
          >
            <option value="">Seçiniz</option>
            <option value="İş">İş</option>
            <option value="Kişisel">Kişisel</option>
            <option value="Alışveriş">Alışveriş</option>
            <option value="Sağlık">Sağlık</option>
            <option value="Eğitim">Eğitim</option>
          </select>
        </div>

        <div class="form-group">
          <label for="priority">Öncelik</label>
          <select
            id="priority"
            name="priority"
            [(ngModel)]="todo.priority"
            required
            class="form-control"
          >
            <option value="">Seçiniz</option>
            <option value="Yüksek">Yüksek</option>
            <option value="Orta">Orta</option>
            <option value="Düşük">Düşük</option>
          </select>
        </div>

        <div class="form-group">
          <label for="dueDate">Bitiş Tarihi</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            [(ngModel)]="todo.dueDate"
            required
            class="form-control"
          >
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit" [disabled]="!todoForm.form.valid">
            Ekle
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      background-color: var(--dark-card);
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    .form-title {
      color: var(--text-light);
      margin-bottom: 2rem;
      text-align: center;
      font-size: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.8rem;
      color: var(--text-light);
      font-size: 1.1rem;
    }

    .form-control {
      width: 100%;
      padding: 1rem;
      border: 1px solid #444;
      border-radius: 6px;
      background-color: var(--dark-bg);
      color: var(--text-light);
      transition: border-color 0.3s ease;
      font-size: 1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--neon-blue);
      box-shadow: var(--neon-shadow);
    }

    textarea.form-control {
      min-height: 120px;
      resize: vertical;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn-submit {
      flex: 1;
      padding: 1.2rem;
      border: none;
      border-radius: 6px;
      font-size: 1.1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      background-color: var(--neon-blue);
      color: var(--dark-bg);
    }

    .btn-submit:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-2px);
    }

    .btn-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .form-container {
        padding: 1.5rem;
        margin: 0 1rem;
      }
    }
  `]
})
export class TodoFormComponent {
  todo: Omit<Todo, 'id'> = {
    title: '',
    description: '',
    category: '',
    priority: 'Orta',
    completed: false,
    dueDate: new Date().toISOString().split('T')[0]
  };

  constructor(private todoService: TodoService) {}

  onSubmit(): void {
    if (this.todo.title && this.todo.category && this.todo.priority && this.todo.dueDate) {
      this.todoService.addTodo(this.todo).subscribe(() => {
        // Formu sıfırla
        this.todo = {
          title: '',
          description: '',
          category: '',
          priority: 'Orta',
          completed: false,
          dueDate: new Date().toISOString().split('T')[0]
        };
      });
    }
  }
} 