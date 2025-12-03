import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  StudentRequest, 
  StudentResponse, 
  StudentPageResponse,
  StudentLevel 
} from '../models';
import { environment } from '../../environments/environment';

export interface StudentQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface StudentSearchParams extends StudentQueryParams {
  query: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly API_URL = `${environment.apiUrl}/api/students`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/students
   * Retrieve all students with pagination and sorting
   */
  getStudents(params: StudentQueryParams = {}): Observable<StudentPageResponse> {
    const httpParams = this.buildParams(params);
    return this.http.get<StudentPageResponse>(this.API_URL, { params: httpParams });
  }

  /**
   * GET /api/students/{id}
   * Retrieve a single student by ID
   */
  getStudentById(id: number): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(`${this.API_URL}/${id}`);
  }

  /**
   * POST /api/students
   * Create a new student
   */
  createStudent(student: StudentRequest): Observable<StudentResponse> {
    return this.http.post<StudentResponse>(this.API_URL, student);
  }

  /**
   * PUT /api/students/{id}
   * Update an existing student
   */
  updateStudent(id: number, student: StudentRequest): Observable<StudentResponse> {
    return this.http.put<StudentResponse>(`${this.API_URL}/${id}`, student);
  }

  /**
   * DELETE /api/students/{id}
   * Delete a student by ID
   */
  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  /**
   * GET /api/students/search
   * Search students by ID or username (partial match allowed)
   */
  searchStudents(params: StudentSearchParams): Observable<StudentPageResponse> {
    let httpParams = this.buildParams(params);
    httpParams = httpParams.set('query', params.query);
    return this.http.get<StudentPageResponse>(`${this.API_URL}/search`, { params: httpParams });
  }

  /**
   * GET /api/students/level/{level}
   * Filter students by level
   */
  getStudentsByLevel(level: StudentLevel | string, params: StudentQueryParams = {}): Observable<StudentPageResponse> {
    const httpParams = this.buildParams(params);
    return this.http.get<StudentPageResponse>(`${this.API_URL}/level/${level}`, { params: httpParams });
  }

  private buildParams(params: StudentQueryParams): HttpParams {
    let httpParams = new HttpParams();
    
    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }
    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }
    if (params.sortDirection) {
      httpParams = httpParams.set('sortDirection', params.sortDirection);
    }
    
    return httpParams;
  }
}
