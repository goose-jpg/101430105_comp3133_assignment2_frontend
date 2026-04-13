import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatToolbarModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule,
    MatSelectModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  templateUrl: './employee-edit.html',
  styleUrls: ['./employee-edit.scss']
})
export class EmployeeEditComponent implements OnInit {
  form: FormGroup;
  loading = true;
  saving = false;
  employeeId = '';
  previewUrl: string | null = null;
  departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design', 'Operations'];
  genders = ['Male', 'Female', 'Other'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private empService: EmployeeService,
    private snack: MatSnackBar
  ) {
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

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id')!;
    this.empService.getOne(this.employeeId).valueChanges.subscribe({
      next: (res: any) => {
        const e = res.data.searchEmployeeById;
        this.form.patchValue(e);
        // Show existing photo if there is one
        if (e.profilePicture) this.previewUrl = e.profilePicture;
        this.loading = false;
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { this.previewUrl = reader.result as string; };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving = true;
    this.empService.update({
      id: this.employeeId,
      ...this.form.value,
      salary: parseFloat(this.form.value.salary)
    }).subscribe({
      next: () => {
        this.snack.open('Employee updated!', 'OK', { duration: 3000 });
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.snack.open(err.message, 'Close', { duration: 4000 });
        this.saving = false;
      }
    });
  }
}