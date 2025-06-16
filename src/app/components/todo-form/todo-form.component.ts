import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService, Todo } from '../../services/todo.service';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="todo-form-container">
      <form (ngSubmit)="onSubmit()" #todoForm="ngForm">
        <div class="form-group">
          <label for="title">Başlık</label>
          <input
            type="text"
            id="title"
            name="title"
            [(ngModel)]="todo.title"
            required
            placeholder="Görev başlığı"
          >
        </div>

        <div class="form-group">
          <label for="description">Açıklama</label>
          <textarea
            id="description"
            name="description"
            [(ngModel)]="todo.description"
            placeholder="Görev açıklaması"
            rows="3"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="category">Kategori</label>
            <select
              id="category"
              name="category"
              [(ngModel)]="todo.category"
              required
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
            >
              <option value="">Seçiniz</option>
              <option value="Yüksek">Yüksek</option>
              <option value="Orta">Orta</option>
              <option value="Düşük">Düşük</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="dueDate">Bitiş Tarihi</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            [(ngModel)]="todo.dueDate"
            required
          >
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit" [disabled]="!todoForm.form.valid">
            {{ isEditing ? 'Güncelle' : 'Ekle' }}
          </button>
          <button type="button" class="btn-cancel" *ngIf="isEditing" (click)="cancelEdit()">
            İptal
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .todo-form-container {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
    }

    input, textarea, select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
    }

    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: #4a90e2;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .btn-submit, .btn-cancel {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .btn-submit {
      background-color: #4a90e2;
      color: white;
    }

    .btn-submit:hover:not(:disabled) {
      background-color: #357abd;
    }

    .btn-submit:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .btn-cancel {
      background-color: #f5f5f5;
      color: #666;
    }

    .btn-cancel:hover {
      background-color: #e0e0e0;
    }

    @media (max-width: 768px) {
      .todo-form-container {
        padding: 1rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TodoFormComponent implements OnInit {
  todo: Todo = {
    id: 0,
    title: '',
    description: '',
    category: '',
    priority: 'Orta',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false
  };

  private _editTodo: Todo | null = null;
  isEditing = false;

  @Input()
  set editTodo(todo: Todo | null) {
    if (todo) {
      this._editTodo = todo;
      this.todo = { ...todo };
      this.isEditing = true;
    }
  }

  get editTodo(): Todo | null {
    return this._editTodo;
  }

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.isEditing && this._editTodo) {
      this.todoService.updateTodo(this.todo);
    } else {
      this.todoService.addTodo(this.todo);
    }
    this.resetForm();
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.todo = {
      id: 0,
      title: '',
      description: '',
      category: '',
      priority: 'Orta',
      dueDate: new Date().toISOString().split('T')[0],
      completed: false
    };
    this._editTodo = null;
    this.isEditing = false;
  }
} 