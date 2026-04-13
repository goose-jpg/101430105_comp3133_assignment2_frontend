import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { EmployeeListComponent } from './components/employee-list/employee-list';
import { EmployeeAddComponent } from './components/employee-add/employee-add';
import { EmployeeViewComponent } from './components/employee-view/employee-view';
import { EmployeeEditComponent } from './components/employee-edit/employee-edit';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '',                   redirectTo: '/login', pathMatch: 'full' },
  { path: 'login',              component: LoginComponent },
  { path: 'signup',             component: SignupComponent },
  { path: 'employees',          component: EmployeeListComponent,  canActivate: [AuthGuard] },
  { path: 'employees/add',      component: EmployeeAddComponent,   canActivate: [AuthGuard] },
  { path: 'employees/view/:id', component: EmployeeViewComponent,  canActivate: [AuthGuard] },
  { path: 'employees/edit/:id', component: EmployeeEditComponent,  canActivate: [AuthGuard] },
  { path: '**',                 redirectTo: '/login' }
];