import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatToolbarModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule,
    MatSelectModule, MatSnackBarModule
  ],
  templateUrl: './employee-add.html',
  styleUrls: ['./employee-add.scss']
})
export class EmployeeAddComponent {
  form: FormGroup;
  loading = false;
  previewUrl: string | null = null;
  departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design', 'Operations'];
  genders = ['Male', 'Female', 'Other'];

  constructor(private fb: FormBuilder, private empService: EmployeeService,
              private router: Router, private snack: MatSnackBar) {
    this.form = this.fb.group({
      firstName:   ['', Validators.required],
      lastName:    ['', Validators.required],
      email:       ['', [Validators.required, Validators.email]],
      gender:      ['', Validators.required],
      designation: ['', Validators.required],
      department:  ['', Validators.required],
      salary:      ['', [Validators.required, Validators.min(1)]]
    });
  }

  get f() { return this.form.controls; }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { this.previewUrl = reader.result as string; };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.empService.add({
      ...this.form.value,
      salary: parseFloat(this.form.value.salary),
      profilePicture: this.previewUrl || ''
    }).subscribe({
      next: () => { this.snack.open('Employee added!', 'OK', { duration: 3000 }); this.router.navigate(['/employees']); },
      error: (err) => { this.snack.open(err.message, 'Close', { duration: 4000 }); this.loading = false; }
    });
  }
}