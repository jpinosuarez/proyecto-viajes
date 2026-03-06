
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n'; // i18n debe inicializarse antes que cualquier componente
import './index.css';
import './styles/mobile-polish.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { UploadProvider } from './context/UploadContext.jsx';
import { UIProvider, SearchProvider } from './context/UIContext.jsx';
import { ErrorBoundary } from './components/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <UploadProvider>
            <UIProvider>
              <SearchProvider>
                <App />
              </SearchProvider>
            </UIProvider>
          </UploadProvider>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
