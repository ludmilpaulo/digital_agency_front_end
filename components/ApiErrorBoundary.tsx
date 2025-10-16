"use client";

import { Component, ReactNode } from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ApiErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('API Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
          <FaExclamationTriangle className="text-red-500 text-4xl mb-4" />
          <h3 className="text-lg font-bold text-red-900 mb-2">Something went wrong</h3>
          <p className="text-sm text-red-700 mb-4 text-center">
            {this.state.error?.message || 'Unable to load data from server'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
          >
            <FaRedo /> Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional component for API errors
export function ApiError({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
      <FaExclamationTriangle className="text-yellow-500 text-4xl mb-4" />
      <h3 className="text-lg font-bold text-yellow-900 mb-2">Unable to Load Data</h3>
      <p className="text-sm text-yellow-700 mb-4 text-center">
        {message || 'The server is temporarily unavailable. Please try again later.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center gap-2"
        >
          <FaRedo /> Retry
        </button>
      )}
      <p className="text-xs text-yellow-600 mt-4">
        If this persists, please contact support: info@maindodigital.com
      </p>
    </div>
  );
}

// Loading component
export function ApiLoading({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">{message || 'Loading...'}</p>
    </div>
  );
}
