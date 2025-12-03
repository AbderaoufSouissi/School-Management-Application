import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <a routerLink="/students" class="text-2xl font-bold text-indigo-600">
                🎓 Student MS
              </a>
            </div>
            <div class="hidden sm:ml-8 sm:flex sm:space-x-4">
              <a 
                routerLink="/students" 
                routerLinkActive="bg-indigo-50 text-indigo-700"
                [routerLinkActiveOptions]="{ exact: true }"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
              >
                All Students
              </a>
              <a 
                routerLink="/students/create" 
                routerLinkActive="bg-indigo-50 text-indigo-700"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
              >
                Add Student
              </a>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">
              Welcome, <span class="font-medium text-gray-900">{{ authService.currentUser() }}</span>
            </span>
            <button
              (click)="authService.logout()"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div class="sm:hidden border-t border-gray-200">
        <div class="pt-2 pb-3 space-y-1">
          <a 
            routerLink="/students" 
            routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700"
            [routerLinkActiveOptions]="{ exact: true }"
            class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
          >
            All Students
          </a>
          <a 
            routerLink="/students/create" 
            routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700"
            class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
          >
            Add Student
          </a>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}
}
