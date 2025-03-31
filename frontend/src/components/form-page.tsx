import type { ReactNode } from 'react';
import { z } from 'zod';
import React from 'react';

export interface FormContentProps<T extends z.Schema<any, any>> {
  children?: ReactNode;
  formSchema: T;
  onSubmit: (values: z.infer<T>) => void;
  defaultValues?: Partial<z.TypeOf<T>>;
  render?: (props: FormHelpers<z.TypeOf<T>>) => ReactNode;
  submit: {
    text: string;
    loadingText?: string;
  };
}

interface FormHelpers<T> {
  values: T;
  errors: { [K in keyof T]?: string };
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormPage = <T extends z.Schema<any, any>>({
  children,
  className,
  title,
  description,
  form,
  ...props
}: {
  children?: ReactNode;
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  form?: FormContentProps<T>;
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className={`flex flex-col gap-6 ${className || ''}`} {...props}>
          <div className="block min-w-[300px] max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {title && (
              <div className="mb-4 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {title}
              </div>
            )}
            {form && <FormContent {...form} />}
            {children}
          </div>
          <div className="text-muted-foreground text-balance text-center text-sm [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
            By continue to use this site, you agree to our <a href="#">Terms of Service</a> and{' '}
            <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export const FormContent = <T extends z.Schema<any, any>>({
  onSubmit,
  formSchema,
  defaultValues,
  submit,
  render
}: FormContentProps<T>) => {
  const [values, setValues] = React.useState<z.TypeOf<T>>(defaultValues as z.TypeOf<T>);
  const [errors, setErrors] = React.useState<{ [K in keyof z.TypeOf<T>]?: string }>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data using the schema
      const validatedData = formSchema.parse(values);
      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(prev => ({...prev, ...newErrors}));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formHelpers: FormHelpers<z.TypeOf<T>> = {
    values,
    errors,
    isSubmitting,
    handleChange,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {render?.(formHelpers)}
      <button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <svg 
              className="animate-spin -ml-1 mr-3 h-5 w-5 inline-block" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{submit.loadingText ?? submit.text}</span>
          </>
        ) : (
          submit.text
        )}
      </button>
    </form>
  );
};
