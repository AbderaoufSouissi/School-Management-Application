import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'students',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => 
          import('./pages/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () => 
          import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'students',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => 
          import('./pages/students/student-list/student-list.component').then(m => m.StudentListComponent)
      },
      {
        path: 'create',
        loadComponent: () => 
          import('./pages/students/student-create/student-create.component').then(m => m.StudentCreateComponent)
      },
      {
        path: ':id',
        loadComponent: () => 
          import('./pages/students/student-detail/student-detail.component').then(m => m.StudentDetailComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => 
          import('./pages/students/student-edit/student-edit.component').then(m => m.StudentEditComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'students'
  }
];
