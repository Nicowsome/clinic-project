export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  errors?: any[];

  constructor(message: string, statusCode: number, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errors?: any[]) {
    return new AppError(message, 400, errors);
  }

  static unauthorized(message: string = 'Not authorized') {
    return new AppError(message, 401);
  }

  static forbidden(message: string = 'Forbidden') {
    return new AppError(message, 403);
  }

  static notFound(message: string = 'Resource not found') {
    return new AppError(message, 404);
  }

  static validationError(message: string, errors: any[]) {
    return new AppError(message, 422, errors);
  }
} 