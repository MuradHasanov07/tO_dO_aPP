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
            maxlength="50"
            #title="ngModel"
            (input)="validateTitle()"
          />
          <div class="char-counter">{{ todo.title.length }}/50</div>
          <div
            *ngIf="title.invalid && (title.dirty || title.touched)"
            class="error-message"
          >
            Başlık zorunludur
          </div>
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
          <div
            *ngIf="category.invalid && (category.dirty || category.touched)"
            class="error-message"
          >
            Kategori seçimi zorunludur
          </div>
        </div>

        <div class="form-group">
          <label>Öncelik</label>
          <div class="priority-buttons">
            <button
              type="button"
              class="priority-btn"
              [class.active]="todo.priority === 'Yüksek'"
              (click)="setPriority('Yüksek')"
            >
              Yüksek
            </button>
            <button
              type="button"
              class="priority-btn"
              [class.active]="todo.priority === 'Orta'"
              (click)="setPriority('Orta')"
            >
              Orta
            </button>
            <button
              type="button"
              class="priority-btn"
              [class.active]="todo.priority === 'Düşük'"
              (click)="setPriority('Düşük')"
            >
              Düşük
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="description">Açıklama</label>
          <textarea
            id="description"
            name="description"
            [(ngModel)]="todo.description"
            maxlength="100"
            rows="3"
            (input)="validateDescription()"
          ></textarea>
          <div class="char-counter">{{ todo.description.length }}/100</div>
        </div>

        <div class="form-group">
          <label for="dueDate">Bitiş Tarihi</label>
          <div class="date-input-container">
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              [(ngModel)]="todo.dueDate"
              required
              #dueDate="ngModel"
              class="date-input"
              #dateInput
            />
            <button
              type="button"
              class="calendar-btn"
              (click)="openCalendar(dateInput)"
              title="Takvim Aç"
            >
              <i class="fas fa-calendar-alt"></i>
            </button>
          </div>
          <div
            *ngIf="dueDate.invalid && (dueDate.dirty || dueDate.touched)"
            class="error-message"
          >
            Bitiş tarihi zorunludur
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="goBack()">
            İptal
          </button>
          <button type="submit" class="btn-save" [disabled]="!isFormValid()">
            Kaydet
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
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

      input,
      select,
      textarea {
        width: 100%;
        padding: 1rem;
        border: 1px solid var(--neon-blue);
        border-radius: 6px;
        background: var(--dark-bg);
        color: var(--text-light);
        transition: all 0.3s ease;
        font-size: 1rem;
      }

      input:focus,
      select:focus,
      textarea:focus {
        outline: none;
        box-shadow: var(--neon-shadow);
      }

      .date-input-container {
        position: relative;
        display: flex;
        align-items: center;
      }

      .date-input {
        cursor: pointer;
        font-family: inherit;
        font-weight: 500;
        padding-right: 3.5rem;
      }

      .calendar-btn {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        background: var(--neon-blue);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        color: var(--dark-bg);
        font-size: 1rem;
        box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
      }

      .calendar-btn:hover {
        background: var(--neon-blue);
        box-shadow: var(--neon-shadow);
        transform: translateY(-50%) scale(1.1);
        animation: neonPulse 1s infinite alternate;
      }

      @keyframes neonPulse {
        0% {
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }
        100% {
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.8),
            0 0 30px rgba(0, 212, 255, 0.4);
        }
      }

      .date-input::-webkit-calendar-picker-indicator {
        cursor: pointer;
        filter: invert(0.8);
        opacity: 0.8;
        font-size: 1.2rem;
        background: none;
      }

      .date-input::-webkit-calendar-picker-indicator:hover {
        opacity: 1;
        filter: invert(1);
      }

      .char-counter {
        text-align: right;
        font-size: 0.85rem;
        color: var(--text-light);
        opacity: 0.7;
        margin-top: 0.25rem;
      }

      .priority-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .priority-btn {
        flex: 1;
        min-width: 80px;
        padding: 0.8rem 1rem;
        border: 1px solid var(--neon-blue);
        border-radius: 6px;
        background-color: var(--dark-bg);
        color: var(--text-light);
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
        font-weight: 500;
      }

      .priority-btn:hover {
        box-shadow: var(--neon-shadow);
        transform: translateY(-1px);
      }

      .priority-btn.active {
        background-color: var(--neon-blue);
        color: var(--dark-bg);
        border-color: var(--neon-blue);
        box-shadow: var(--neon-shadow);
      }

      .error-message {
        color: #ff4444;
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

        .priority-buttons {
          flex-direction: column;
        }

        .priority-btn {
          flex: none;
          width: 100%;
        }
      }
    `,
  ],
})
export class EditTodoComponent implements OnInit {
  todo: Todo = {
    id: 0,
    title: '',
    description: '',
    category: '',
    priority: 'Orta',
    completed: false,
    dueDate: new Date().toISOString().split('T')[0],
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

  validateTitle(): void {
    if (this.todo.title.length > 50) {
      this.todo.title = this.todo.title.substring(0, 50);
    }
  }

  validateDescription(): void {
    if (this.todo.description.length > 100) {
      this.todo.description = this.todo.description.substring(0, 100);
    }
  }

  setPriority(priority: string): void {
    this.todo.priority = priority;
  }

  openCalendar(dateInput: HTMLInputElement): void {
    dateInput.showPicker();
  }

  isFormValid(): boolean {
    return !!(
      this.todo.title &&
      this.todo.title.length <= 50 &&
      this.todo.category &&
      this.todo.priority &&
      this.todo.dueDate &&
      this.todo.description.length <= 100
    );
  }

  onSubmit(): void {
    if (this.todo.id && this.isFormValid()) {
      this.todoService.updateTodo(this.todo).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
