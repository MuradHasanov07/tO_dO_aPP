import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterOptions {
  category: string;
  priority: string;
  status: string;
  dueDate: string | null;
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-container">
      <button class="filter-toggle" (click)="toggleFilter()">
        <i class="fas" [class.fa-filter]="!isOpen" [class.fa-times]="isOpen"></i>
        {{ isOpen ? 'Filtreleri Kapat' : 'Filtrele' }}
      </button>

      <div class="filter-panel" [class.open]="isOpen">
        <div class="filter-section">
          <h3>Kategori</h3>
          <div class="filter-options">
            <button 
              *ngFor="let category of categories" 
              [class.active]="filters.category === category"
              (click)="applyFilter('category', category)"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <div class="filter-section">
          <h3>Öncelik</h3>
          <div class="filter-options">
            <button 
              *ngFor="let priority of priorities" 
              [class.active]="filters.priority === priority"
              (click)="applyFilter('priority', priority)"
            >
              {{ priority }}
            </button>
          </div>
        </div>

        <div class="filter-section">
          <h3>Durum</h3>
          <div class="filter-options">
            <button 
              *ngFor="let status of statuses" 
              [class.active]="filters.status === status"
              (click)="applyFilter('status', status)"
            >
              {{ status }}
            </button>
          </div>
        </div>

        <div class="filter-section">
          <h3>Tarih</h3>
          <div class="date-filter">
            <input
              type="date"
              [value]="filters.dueDate"
              (change)="onDateChange($event)"
            >
          </div>
        </div>

        <div class="filter-actions">
          <button class="btn-clear" (click)="clearFilters()">
            Filtreleri Temizle
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-container {
      max-width: 1200px;
      margin: 0 auto 2rem;
      padding: 0 1rem;
    }

    .filter-toggle {
      background: var(--dark-card);
      border: 1px solid var(--neon-blue);
      padding: 0.8rem 1.5rem;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-light);
      transition: all 0.3s ease;
    }

    .filter-toggle:hover {
      box-shadow: var(--neon-shadow);
    }

    .filter-toggle i {
      transition: transform 0.3s ease;
    }

    .filter-toggle:hover i {
      transform: rotate(180deg);
    }

    .filter-panel {
      background: var(--dark-card);
      border-radius: 10px;
      padding: 1.5rem;
      margin-top: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: all 0.3s ease;
    }

    .filter-panel.open {
      max-height: 500px;
      opacity: 1;
    }

    .filter-section h3 {
      color: var(--text-light);
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .filter-options {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .filter-options button {
      padding: 0.5rem 1rem;
      border: 1px solid var(--neon-blue);
      border-radius: 20px;
      background: var(--dark-bg);
      color: var(--text-light);
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .filter-options button:hover {
      box-shadow: var(--neon-shadow);
    }

    .filter-options button.active {
      background: var(--neon-blue);
      color: var(--dark-bg);
      border-color: var(--neon-blue);
    }

    .date-filter input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--neon-blue);
      border-radius: 5px;
      background: var(--dark-bg);
      color: var(--text-light);
    }

    .filter-actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
    }

    .btn-clear {
      background: var(--dark-bg);
      border: 1px solid var(--neon-blue);
      padding: 0.8rem 1.5rem;
      border-radius: 5px;
      cursor: pointer;
      color: var(--text-light);
      transition: all 0.3s ease;
    }

    .btn-clear:hover {
      box-shadow: var(--neon-shadow);
    }

    @media (max-width: 768px) {
      .filter-panel {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FilterComponent {
  @Output() filterChange = new EventEmitter<FilterOptions>();

  isOpen = false;
  categories = ['İş', 'Kişisel', 'Alışveriş', 'Sağlık', 'Eğitim'];
  priorities = ['Yüksek', 'Orta', 'Düşük'];
  statuses = ['Tümü', 'Tamamlanan', 'Tamamlanmayan'];

  filters: FilterOptions = {
    category: '',
    priority: '',
    status: '',
    dueDate: null
  };

  toggleFilter(): void {
    this.isOpen = !this.isOpen;
  }

  applyFilter(type: keyof FilterOptions, value: string): void {
    this.filters[type] = value;
    this.filterChange.emit(this.filters);
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.applyFilter('dueDate', input.value);
  }

  clearFilters(): void {
    this.filters = {
      category: '',
      priority: '',
      status: '',
      dueDate: null
    };
    this.filterChange.emit(this.filters);
  }
} 