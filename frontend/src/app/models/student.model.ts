// Student DTOs matching Spring Boot API exactly

export enum StudentLevel {
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER',
  PHD = 'PHD'
}

export interface StudentRequest {
  level: StudentLevel | string;
  username: string;
}

export interface StudentResponse {
  id: number;
  username: string;
  level: StudentLevel | string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface StudentPageResponse extends PageResponse<StudentResponse> {}
