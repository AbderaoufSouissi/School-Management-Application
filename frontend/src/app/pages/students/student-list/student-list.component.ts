import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentService, StudentQueryParams, StudentSearchParams } from '../../../services/student.service';
import { StudentResponse, StudentLevel, StudentPageResponse } from '../../../models';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { ConfirmModalComponent } from '../../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    FormsModule, 
    NavbarComponent, 
    PaginationComponent, 
    LoadingSpinnerComponent,
    ConfirmModalComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar />
      
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="md:flex md:items-center md:justify-between mb-6">
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Students
            </h1>
            <p class="mt-1 text-sm text-gray-500">
              Manage all students in the system
            </p>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4">
            <a
              routerLink="/students/create"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Add Student
            </a>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow mb-6 p-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Search -->
            <div class="md:col-span-2">
              <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div class="relative">
                <input
                  type="text"
                  id="search"
                  [(ngModel)]="searchQuery"
                  (keyup.enter)="onSearch()"
                  placeholder="Search by ID or username..."
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10 py-2 border"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Level Filter -->
            <div>
              <label for="level" class="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                id="level"
                [(ngModel)]="selectedLevel"
                (change)="onLevelChange()"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border"
              >
                <option value="">All Levels</option>
                <option value="BACHELOR">Bachelor</option>
                <option value="MASTER">Master</option>
                <option value="PHD">PhD</option>
              </select>
            </div>

            <!-- Sort -->
            <div>
              <label for="sort" class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <div class="flex gap-2">
                <select
                  id="sort"
                  [(ngModel)]="sortBy"
                  (change)="onSortChange()"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border"
                >
                  <option value="id">ID</option>
                  <option value="username">Username</option>
                  <option value="level">Level</option>
                </select>
                <button
                  (click)="toggleSortDirection()"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  [title]="sortDirection === 'ASC' ? 'Ascending' : 'Descending'"
                >
                  @if (sortDirection === 'ASC') {
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clip-rule="evenodd" />
                    </svg>
                  } @else {
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clip-rule="evenodd" />
                    </svg>
                  }
                </button>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="mt-4 flex gap-2">
            <button
              (click)="onSearch()"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Search
            </button>
            <button
              (click)="resetFilters()"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset
            </button>
          </div>
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
        } @else {
          <!-- Students Table -->
          <div class="bg-white shadow rounded-lg overflow-hidden">
            @if (students().length === 0) {
              <div class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                <p class="mt-1 text-sm text-gray-500">Get started by creating a new student.</p>
                <div class="mt-6">
                  <a
                    routerLink="/students/create"
                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                    Add Student
                  </a>
                </div>
              </div>
            } @else {
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @for (student of students(); track student.id) {
                    <tr class="hover:bg-gray-50 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ student.id }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ student.username }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span [class]="getLevelBadgeClass(student.level)">
                          {{ student.level }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div class="flex justify-end gap-2">
                          <a
                            [routerLink]="['/students', student.id]"
                            class="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                            title="View"
                          >
                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                              <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                            </svg>
                          </a>
                          <a
                            [routerLink]="['/students', student.id, 'edit']"
                            class="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50 transition-colors"
                            title="Edit"
                          >
                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                            </svg>
                          </a>
                          <button
                            (click)="openDeleteModal(student)"
                            class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>

              <!-- Pagination -->
              <app-pagination
                [currentPage]="pageInfo().number"
                [totalPages]="pageInfo().totalPages"
                [totalElements]="pageInfo().totalElements"
                [pageSize]="pageInfo().size"
                [isFirst]="pageInfo().first"
                [isLast]="pageInfo().last"
                (pageChange)="onPageChange($event)"
              />
            }
          </div>
        }
      </main>

      <!-- Delete Confirmation Modal -->
      <app-confirm-modal
        [isOpen]="deleteModalOpen()"
        title="Delete Student"
        [message]="'Are you sure you want to delete student \\'' + (studentToDelete()?.username || '') + '\\'? This action cannot be undone.'"
        confirmText="Delete"
        cancelText="Cancel"
        [loading]="deleteLoading()"
        (confirm)="confirmDelete()"
        (cancel)="closeDeleteModal()"
      />
    </div>
  `
})
export class StudentListComponent implements OnInit {
  // State
  students = signal<StudentResponse[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  
  // Pagination info
  pageInfo = signal({
    number: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10,
    first: true,
    last: true
  });

  // Filters
  searchQuery = '';
  selectedLevel = '';
  sortBy = 'id';
  sortDirection: 'ASC' | 'DESC' = 'ASC';

  // Delete modal
  deleteModalOpen = signal(false);
  studentToDelete = signal<StudentResponse | null>(null);
  deleteLoading = signal(false);

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const params: StudentQueryParams = {
      page: this.pageInfo().number,
      size: this.pageInfo().size,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection
    };

    let request$;

    if (this.searchQuery.trim()) {
      const searchParams: StudentSearchParams = {
        ...params,
        query: this.searchQuery.trim()
      };
      request$ = this.studentService.searchStudents(searchParams);
    } else if (this.selectedLevel) {
      request$ = this.studentService.getStudentsByLevel(this.selectedLevel as StudentLevel, params);
    } else {
      request$ = this.studentService.getStudents(params);
    }

    request$.subscribe({
      next: (response) => {
        this.students.set(response.content);
        this.pageInfo.set({
          number: response.number,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          size: response.size,
          first: response.first,
          last: response.last
        });
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.message || 'Failed to load students. Please try again.');
      }
    });
  }

  onSearch(): void {
    this.pageInfo.update(p => ({ ...p, number: 0 }));
    this.loadStudents();
  }

  onLevelChange(): void {
    this.searchQuery = ''; // Clear search when filtering by level
    this.pageInfo.update(p => ({ ...p, number: 0 }));
    this.loadStudents();
  }

  onSortChange(): void {
    this.loadStudents();
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    this.loadStudents();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedLevel = '';
    this.sortBy = 'id';
    this.sortDirection = 'ASC';
    this.pageInfo.update(p => ({ ...p, number: 0 }));
    this.loadStudents();
  }

  onPageChange(page: number): void {
    this.pageInfo.update(p => ({ ...p, number: page }));
    this.loadStudents();
  }

  getLevelBadgeClass(level: string | StudentLevel): string {
    const baseClasses = 'inline-flex px-2 py-1 text-xs font-semibold rounded-full';
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

  openDeleteModal(student: StudentResponse): void {
    this.studentToDelete.set(student);
    this.deleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.deleteModalOpen.set(false);
    this.studentToDelete.set(null);
  }

  confirmDelete(): void {
    const student = this.studentToDelete();
    if (!student) return;

    this.deleteLoading.set(true);

    this.studentService.deleteStudent(student.id).subscribe({
      next: () => {
        this.deleteLoading.set(false);
        this.closeDeleteModal();
        this.loadStudents();
      },
      error: (error) => {
        this.deleteLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Failed to delete student. Please try again.');
        this.closeDeleteModal();
      }
    });
  }
}
