import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider, useApp } from './contexts/AppContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-12 text-center">
          <h1 className="text-red-600 text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-gray-700 mb-4">{this.state.error?.message}</p>
          <pre className="text-left bg-gray-100 p-3 rounded text-sm overflow-auto">
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const { currentView } = useApp();

  return currentView === 'landing' ? <LandingPage /> : <Dashboard />;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
