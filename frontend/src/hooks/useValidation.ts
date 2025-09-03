import { useState, useCallback } from 'react';

export interface ValidationError {
  [key: string]: string[];
}

export interface UseValidationReturn {
  errors: ValidationError;
  hasErrors: boolean;
  setErrors: (errors: ValidationError) => void;
  clearErrors: () => void;
  getFieldError: (field: string) => string | undefined;
  hasFieldError: (field: string) => boolean;
}

export const useValidation = (): UseValidationReturn => {
  const [errors, setErrorsState] = useState<ValidationError>({});

  const setErrors = useCallback((newErrors: ValidationError) => {
    setErrorsState(newErrors);
  }, []);

  const clearErrors = useCallback(() => {
    setErrorsState({});
  }, []);

  const getFieldError = useCallback((field: string): string | undefined => {
    return errors[field]?.[0];
  }, [errors]);

  const hasFieldError = useCallback((field: string): boolean => {
    return Boolean(errors[field] && errors[field].length > 0);
  }, [errors]);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    hasErrors,
    setErrors,
    clearErrors,
    getFieldError,
    hasFieldError,
  };
};
