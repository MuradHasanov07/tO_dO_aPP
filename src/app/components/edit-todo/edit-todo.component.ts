import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService, Todo } from '../../services/todo.service';

@Component({
  selector: 'app-edit-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="edit-todo-container">
      <h1>Görevi Düzenle</h1>
      
      <form [formGroup]="todoForm" (ngSubmit)="onSubmit()" class="edit-form">
        <div class="form-group">
          <label for="title">Başlık</label>
          <input
            type="text"
            id="title"
            formControlName="title"
            [class.error]="isFieldInvalid('title')"
            placeholder="Görev başlığı"
          >
          <div class="error-message" *ngIf="isFieldInvalid('title')">
            Başlık alanı zorunludur
          </div>
        </div>

        <div class="form-group">
          <label for="description">Açıklama</label>
          <textarea
            id="description"
            formControlName="description"
            placeholder="Görev açıklaması"
            rows="3"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="category">Kategori</label>
            <select id="category" formControlName="category">
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
            <select id="priority" formControlName="priority">
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
            formControlName="dueDate"
          >
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit" [disabled]="todoForm.invalid">
            Kaydet
          </button>
          <button type="button" class="btn-cancel" (click)="goBack()">
            İptal
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .edit-todo-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #333;
      margin-bottom: 2rem;
      text-align: center;
    }

    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    label {
      font-weight: 500;
      color: #333;
    }

    input, textarea, select {
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

    input.error {
      border-color: #ff4444;
    }

    .error-message {
      color: #ff4444;
      font-size: 0.8rem;
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
      .edit-todo-container {
        margin: 1rem;
        padding: 1rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EditTodoComponent implements OnInit {
  todoForm!: FormGroup;
  todoId: number = 0;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.todoId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTodo();
  }

  private initForm(): void {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      category: [''],
      priority: [''],
      dueDate: ['']
    });
  }

  private loadTodo(): void {
    const todo = this.todoService.getTodoById(this.todoId);
    if (!todo) {
      this.router.navigate(['/']);
      return;
    }

    this.todoForm.patchValue({
      title: todo.title,
      description: todo.description,
      category: todo.category,
      priority: todo.priority,
      dueDate: todo.dueDate
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.todoForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const updatedTodo: Todo = {
        id: this.todoId,
        ...this.todoForm.value,
        completed: false
      };
      
      this.todoService.updateTodo(updatedTodo);
      this.router.navigate(['/']);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
} 