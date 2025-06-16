import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/todo-list/todo-list.component').then((m) => m.TodoListComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/edit-todo/edit-todo.component').then((m) => m.EditTodoComponent),
  },
  { path: '**', redirectTo: '' }
];
