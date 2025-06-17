import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>Todo Uygulaması</h1>
        <nav class="app-nav">
          <a
            routerLink="/"
            class="nav-link"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            <i class="fas fa-list"></i> Görevler
          </a>
          <a routerLink="/add" class="nav-link" routerLinkActive="active">
            <i class="fas fa-plus"></i> Yeni Görev
          </a>
        </nav>
      </header>

      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .app-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        min-height: 100vh;
      }

      .app-header {
        margin-bottom: 2rem;
        text-align: center;
      }

      .app-header h1 {
        color: var(--text-light);
        margin-bottom: 1.5rem;
        font-size: 2.5rem;
        text-shadow: 0 0 10px rgba(0, 123, 255, 0.3);
      }

      .app-nav {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.8rem 1.5rem;
        background: var(--dark-card);
        color: var(--text-light);
        text-decoration: none;
        border-radius: 6px;
        border: 1px solid #444;
        transition: all 0.3s ease;
        font-weight: 500;
      }

      .nav-link:hover {
        border-color: var(--neon-blue);
        box-shadow: var(--neon-shadow);
        transform: translateY(-1px);
      }

      .nav-link.active {
        background: var(--neon-blue);
        color: var(--dark-bg);
        border-color: var(--neon-blue);
        box-shadow: var(--neon-shadow);
      }

      .nav-link i {
        font-size: 1rem;
      }

      .app-main {
        min-height: calc(100vh - 200px);
      }

      @media (max-width: 768px) {
        .app-container {
          padding: 1rem;
        }

        .app-nav {
          flex-direction: column;
          align-items: center;
        }

        .nav-link {
          width: 200px;
          justify-content: center;
        }

        .app-header h1 {
          font-size: 2rem;
        }
      }
    `,
  ],
})
export class AppComponent {
  title = 'todo-app';
}
