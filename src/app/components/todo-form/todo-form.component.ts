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
            maxlength="50"
            class="form-control"
            (input)="validateTitle()"
          />
          <div class="char-counter">{{ todo.title.length }}/50</div>
        </div>

        <div class="form-group">
          <label for="description">Açıklama</label>
          <textarea
            id="description"
            name="description"
            [(ngModel)]="todo.description"
            maxlength="100"
            class="form-control"
            (input)="validateDescription()"
          ></textarea>
          <div class="char-counter">{{ todo.description.length }}/100</div>
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
          <label for="dueDate">Bitiş Tarihi</label>
          <div class="date-input-container">
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              [(ngModel)]="todo.dueDate"
              required
              class="form-control date-input"
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
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit" [disabled]="!isFormValid()">
            Ekle
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
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
export class TodoFormComponent {
  todo: Omit<Todo, 'id'> = {
    title: '',
    description: '',
    category: '',
    priority: '', // Boş başlatıyoruz - kullanıcı seçmek zorunda
    completed: false,
    dueDate: new Date().toISOString().split('T')[0], // String olarak başlat
  };

  constructor(private todoService: TodoService) {}

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
    if (this.isFormValid()) {
      this.todoService.addTodo(this.todo).subscribe(() => {
        // Formu sıfırla
        this.todo = {
          title: '',
          description: '',
          category: '',
          priority: '', // Boş başlatıyoruz
          completed: false,
          dueDate: new Date().toISOString().split('T')[0],
        };
      });
    }
  }
}
