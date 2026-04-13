import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeService } from '../../services/employee';
import { AuthService } from '../../services/auth';
import { SalaryFormatPipe } from '../../pipes/salary-format-pipe';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatTableModule, MatFormFieldModule, MatInputModule,
    MatCardModule, MatProgressSpinnerModule, MatSnackBarModule,
    MatTooltipModule, SalaryFormatPipe
  ],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  loading = true;
  searchDept = '';
  searchPos = '';
  isSearching = false;
  columns = ['avatar', 'name', 'email', 'department', 'designation', 'salary', 'actions'];

  constructor(
    private empService: EmployeeService,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.loading = true;
    this.empService.getAll().valueChanges.subscribe({
      next: (res: any) => {
        this.employees = res.data.getAllEmployees;
        this.filteredEmployees = this.employees;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onSearch() {
    if (!this.searchDept && !this.searchPos) {
      this.filteredEmployees = this.employees;
      return;
    }
    this.isSearching = true;
    this.empService.search(this.searchDept || undefined, this.searchPos || undefined)
      .valueChanges.subscribe({
        next: (res: any) => {
          this.filteredEmployees = res.data.searchEmployeeByDepartmentOrPosition;
          this.isSearching = false;
        }
      });
  }

  clearSearch() {
    this.searchDept = '';
    this.searchPos = '';
    this.filteredEmployees = this.employees;
  }

  delete(id: string) {
    if (!confirm('Delete this employee?')) return;
    this.empService.delete(id).subscribe({
      next: () => this.snack.open('Employee deleted', 'OK', { duration: 3000 }),
      error: (e) => this.snack.open(e.message, 'Close', { duration: 3000 })
    });
  }

  logout() { this.auth.logout(); }

  getInitials(f: string, l: string) {
    return (f[0] + l[0]).toUpperCase();
  }
}