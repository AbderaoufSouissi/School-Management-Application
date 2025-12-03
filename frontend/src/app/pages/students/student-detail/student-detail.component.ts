import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { StudentResponse, StudentLevel } from '../../../models';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { ConfirmModalComponent } from '../../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, LoadingSpinnerComponent, ConfirmModalComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar />
      
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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

        <!-- Error Message -->
        @if (errorMessage()) {
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
              </svg>
              <span>{{ errorMessage() }}</span>
            </div>
          </div>
        }

        <!-- Loading -->
        @if (loading()) {
          <app-loading-spinner />
        } @else if (student()) {
          <!-- Student Details Card -->
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span class="text-2xl font-bold text-indigo-600">
                      {{ student()!.username.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <h1 class="text-2xl font-bold text-gray-900">{{ student()!.username }}</h1>
                    <p class="text-sm text-gray-500">Student ID: {{ student()!.id }}</p>
                  </div>
                </div>
                <span [class]="getLevelBadgeClass(student()!.level)">
                  {{ student()!.level }}
                </span>
              </div>
            </div>

            <div class="px-6 py-5">
              <h2 class="text-lg font-medium text-gray-900 mb-4">Student Information</h2>
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">ID</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ student()!.id }}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Username</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ student()!.username }}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Level</dt>
                  <dd class="mt-1">
                    <span [class]="getLevelBadgeClass(student()!.level)">
                      {{ student()!.level }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <!-- Actions -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                (click)="openDeleteModal()"
                class="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                </svg>
                Delete
              </button>
              <a
                [routerLink]="['/students', student()!.id, 'edit']"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                </svg>
                Edit
              </a>
            </div>
          </div>
        }
      </main>

      <!-- Delete Confirmation Modal -->
      <app-confirm-modal
        [isOpen]="deleteModalOpen()"
        title="Delete Student"
        [message]="'Are you sure you want to delete student \\'' + (student()?.username || '') + '\\'? This action cannot be undone.'"
        confirmText="Delete"
        cancelText="Cancel"
        [loading]="deleteLoading()"
        (confirm)="confirmDelete()"
        (cancel)="closeDeleteModal()"
      />
    </div>
  `
})
export class StudentDetailComponent implements OnInit {
  student = signal<StudentResponse | null>(null);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  deleteModalOpen = signal(false);
  deleteLoading = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadStudent(id);
    }
  }

  loadStudent(id: number): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.studentService.getStudentById(id).subscribe({
      next: (student) => {
        this.student.set(student);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        if (error.status === 404) {
          this.errorMessage.set('Student not found.');
        } else {
          this.errorMessage.set(error.error?.message || 'Failed to load student details.');
        }
      }
    });
  }

  getLevelBadgeClass(level: string | StudentLevel): string {
    const baseClasses = 'inline-flex px-3 py-1 text-sm font-semibold rounded-full';
    switch (level) {
      case 'BACHELOR':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'MASTER':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'PHD':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  openDeleteModal(): void {
    this.deleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.deleteModalOpen.set(false);
  }

  confirmDelete(): void {
    const student = this.student();
    if (!student) return;

    this.deleteLoading.set(true);

    this.studentService.deleteStudent(student.id).subscribe({
      next: () => {
        this.deleteLoading.set(false);
        this.router.navigate(['/students']);
      },
      error: (error) => {
        this.deleteLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Failed to delete student.');
        this.closeDeleteModal();
      }
    });
  }
}
