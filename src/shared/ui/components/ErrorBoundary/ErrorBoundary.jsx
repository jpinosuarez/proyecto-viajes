import React, { Component } from 'react';
import ErrorFallback from './ErrorFallback';

/**
 * ErrorBoundary (Orchestrator)
 * Captures rendering errors in child components and displays a fallback UI.
 * Usage:
 * <ErrorBoundary fallback={<CustomFallback />}>
 *   <ComponentThatMayFail />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to reporting service (Sentry, etc.)
    // Optionally integrate with Sentry here
    this.setState({ errorInfo });
    // console.error('ErrorBoundary caught error:', { error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
