// Error DTOs matching Spring Boot API exactly

export interface ValidationError {
  status: number;
  errors: { [key: string]: string };
}

export interface UnauthorizedError {
  error: string;
  message: string;
}
