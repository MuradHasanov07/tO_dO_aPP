import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-edit-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="edit-container">
      <h2>Görevi Düzenle</h2>
      <form (ngSubmit)="onSubmit()" #todoForm="ngForm">
        <div class="form-group">
          <label for="title">Başlık</label>
          <input
            type="text"
            id="title"
            name="title"
            [(ngModel)]="todo.title"
            required
            #title="ngModel"
          >
          <div *ngIf="title.invalid && (title.dirty || title.touched)" class="error-message">
            Başlık zorunludur
          </div>
        </div>

        <div class="form-group">
          <label for="description">Açıklama</label>
          <textarea
            id="description"
            name="description"
            [(ngModel)]="todo.description"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="category">Kategori</label>
          <select
            id="category"
            name="category"
            [(ngModel)]="todo.category"
            required
            #category="ngModel"
          >
            <option value="">Seçiniz</option>
            <option value="İş">İş</option>
            <option value="Kişisel">Kişisel</option>
            <option value="Alışveriş">Alışveriş</option>
            <option value="Sağlık">Sağlık</option>
            <option value="Eğitim">Eğitim</option>
          </select>
          <div *ngIf="category.invalid && (category.dirty || category.touched)" class="error-message">
            Kategori seçimi zorunludur
          </div>
        </div>

        <div class="form-group">
          <label for="priority">Öncelik</label>
          <select
            id="priority"
            name="priority"
            [(ngModel)]="todo.priority"
            required
            #priority="ngModel"
          >
            <option value="">Seçiniz</option>
            <option value="Yüksek">Yüksek</option>
            <option value="Orta">Orta</option>
            <option value="Düşük">Düşük</option>
          </select>
          <div *ngIf="priority.invalid && (priority.dirty || priority.touched)" class="error-message">
            Öncelik seçimi zorunludur
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
            #dueDate="ngModel"
          >
          <div *ngIf="dueDate.invalid && (dueDate.dirty || dueDate.touched)" class="error-message">
            Bitiş tarihi zorunludur
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="goBack()">İptal</button>
          <button type="submit" class="btn-save" [disabled]="!todoForm.form.valid">Kaydet</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .edit-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 2rem;
      background: var(--dark-card);
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: var(--text-light);
      margin-bottom: 2rem;
      text-align: center;
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

    input, select, textarea {
      width: 100%;
      padding: 1rem;
      border: 1px solid var(--neon-blue);
      border-radius: 6px;
      background: var(--dark-bg);
      color: var(--text-light);
      transition: all 0.3s ease;
      font-size: 1rem;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      box-shadow: var(--neon-shadow);
    }

    .error-message {
      color: var(--neon-red);
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    button {
      padding: 1.2rem 2rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      font-size: 1.1rem;
    }

    .btn-cancel {
      background: var(--dark-bg);
      color: var(--text-light);
      border: 1px solid var(--neon-blue);
    }

    .btn-cancel:hover {
      box-shadow: var(--neon-shadow);
    }

    .btn-save {
      background: var(--neon-blue);
      color: var(--dark-bg);
    }

    .btn-save:hover {
      box-shadow: var(--neon-shadow);
    }

    .btn-save:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .edit-container {
        padding: 1.5rem;
        margin: 1rem;
      }
    }
  `]
})
export class EditTodoComponent implements OnInit {
  todo: Todo = {
    id: 0,
    title: '',
    description: '',
    category: '',
    priority: 'Orta',
    completed: false,
    dueDate: new Date().toISOString().split('T')[0]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.todoService.getTodoById(id).subscribe((todo: Todo | undefined) => {
        if (todo) {
          this.todo = { ...todo };
        } else {
          this.router.navigate(['/']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.todo.id) {
      this.todoService.updateTodo(this.todo).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
} 