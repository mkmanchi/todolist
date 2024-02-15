import { Routes } from '@angular/router';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { TodosComponent } from './pages/todos/todos.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full',
  },
  {
    path: 'search',
    component: SearchPageComponent,
  },
  {
    path: 'todos/:id',
    component: TodosComponent,
  },
];
