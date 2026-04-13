import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeService } from '../../services/employee';
import { SalaryFormatPipe } from '../../pipes/salary-format-pipe';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [
    CommonModule, RouterLink, DatePipe,
    MatToolbarModule, MatCardModule, MatButtonModule,
    MatIconModule, MatDividerModule, MatProgressSpinnerModule,
    SalaryFormatPipe
  ],
  templateUrl: './employee-view.html',
  styleUrls: ['./employee-view.scss']
})
export class EmployeeViewComponent implements OnInit {
  employee: any = null;
  loading = true;

  constructor(private route: ActivatedRoute, private empService: EmployeeService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.empService.getOne(id).valueChanges.subscribe({
      next: (res: any) => { this.employee = res.data.searchEmployeeById; this.loading = false; }
    });
  }

  getInitials() {
    if (!this.employee) return '';
    return (this.employee.firstName[0] + this.employee.lastName[0]).toUpperCase();
  }
}