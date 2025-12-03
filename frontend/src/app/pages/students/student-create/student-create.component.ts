import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { StudentRequest, StudentLevel } from '../../../models';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

@Component({
  selector: 'app-student-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar />
      
      <main class="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Back button -->
        <div class="mb-6">
          <a
            routerLink="/students"
            class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <svg class="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clip-rule="evenodd" />
            </svg>
            Back to Students
          </a>
        </div>

        <!-- Header -->
        <div class="md:flex md:items-center md:justify-between mb-6">
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Add New Student
            </h1>
            <p class="mt-1 text-sm text-gray-500">
              Create a new student record in the system
            </p>
          </div>
        </div>

        <!-- Form -->
        <div class="bg-white shadow rounded-lg">
          <form [formGroup]="studentForm" (ngSubmit)="onSubmit()" class="space-y-6 p-6">
            @if (errorMessage()) {
              <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
                <span>{{ errorMessage() }}</span>
              </div>
            }

            @if (fieldErrors()) {
              <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                @for (error of getFieldErrorEntries(); track error[0]) {
                  <p class="text-sm">{{ error[0] }}: {{ error[1] }}</p>
                }
              </div>
            }

            <!-- Username -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">
                Username <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                formControlName="username"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                [class.border-red-300]="studentForm.get('username')?.invalid && studentForm.get('username')?.touched"
                placeholder="Enter username"
              />
              @if (studentForm.get('username')?.invalid && studentForm.get('username')?.touched) {
                <p class="mt-1 text-sm text-red-600">
                  @if (studentForm.get('username')?.hasError('required')) {
                    Username is required
                  }
                </p>
              }
            </div>

            <!-- Level -->
            <div>
              <label for="level" class="block text-sm font-medium text-gray-700">
                Level <span class="text-red-500">*</span>
              </label>
              <select
                id="level"
                formControlName="level"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border"
                [class.border-red-300]="studentForm.get('level')?.invalid && studentForm.get('level')?.touched"
              >
                <option value="">Select a level</option>
                <option value="BACHELOR">Bachelor</option>
                <option value="MASTER">Master</option>
                <option value="PHD">PhD</option>
              </select>
              @if (studentForm.get('level')?.invalid && studentForm.get('level')?.touched) {
                <p class="mt-1 text-sm text-red-600">
                  @if (studentForm.get('level')?.hasError('required')) {
                    Level is required
                  }
                </p>
              }
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <a
                routerLink="/students"
                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </a>
              <button
                type="submit"
                [disabled]="loading() || studentForm.invalid"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                @if (loading()) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                } @else {
                  <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  Create Student
                }
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  `
})
export class StudentCreateComponent {
  studentForm: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  fieldErrors = signal<{ [key: string]: string } | null>(null);

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router
  ) {
    this.studentForm = this.fb.group({
      username: ['', [Validators.required]],
      level: ['', [Validators.required]]
    });
  }

  getFieldErrorEntries(): [string, string][] {
    const errors = this.fieldErrors();
    return errors ? Object.entries(errors) : [];
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.fieldErrors.set(null);

    const request: StudentRequest = {
      username: this.studentForm.value.username,
      level: this.studentForm.value.level
    };

    this.studentService.createStudent(request).subscribe({
      next: (student) => {
        this.router.navigate(['/students', student.id]);
      },
      error: (error) => {
        this.loading.set(false);
        if (error.status === 400 && error.error?.errors) {
          this.fieldErrors.set(error.error.errors);
        } else if (error.error?.message) {
          this.errorMessage.set(error.error.message);
        } else {
          this.errorMessage.set('Failed to create student. Please try again.');
        }
      }
    });
  }
}
