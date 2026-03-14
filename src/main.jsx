
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './i18n'; // i18n debe inicializarse antes que cualquier componente
import '@shared/config/styles/index.css';
import '@shared/config/styles/mobile-polish.css';
import { App } from '@app/layout';
import { AuthProvider, ToastProvider, UploadProvider, UIProvider, SearchProvider } from '@app/providers';
import { ErrorBoundary } from '@shared/ui/components/ErrorBoundary';

// Test helpers: expose auth + firestore helpers to the browser for E2E automation.
// These are only enabled in test mode or when explicitly requested via env var.
// This code is excluded from production builds by Vite tree-shaking.
if (typeof window !== 'undefined' && (import.meta.env.MODE === 'test' || import.meta.env.VITE_ENABLE_TEST_LOGIN === 'true')) {
  // Lazy imports to avoid increasing initial bundle size for production.
  import('@shared/firebase').then(({ auth, db }) => {
    import('firebase/auth').then(({ signInWithEmailAndPassword, signOut }) => {
      window.__test_signInWithEmail = async ({ email, password }) => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          return true;
        } catch (err) {
          console.error('🧪 test signIn failed', err);
          return false;
        }
      };
      window.__test_signOut = async () => signOut(auth);
    });

    import('firebase/firestore').then(({ doc, setDoc, getDoc }) => {
      window.__test_createDoc = async (fullPath, documentData) => {
        try {
          const ref = doc(db, fullPath);
          await setDoc(ref, documentData, { merge: true });
          return true;
        } catch (err) {
          console.error('🧪 test createDoc failed', err);
          return false;
        }
      };

      window.__test_readDoc = async (fullPath) => {
        try {
          const ref = doc(db, fullPath);
          const snap = await getDoc(ref);
          return snap.exists() ? snap.data() : null;
        } catch (err) {
          console.error('🧪 test readDoc failed', err);
          return null;
        }
      };
    });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
    </BrowserRouter>
  </StrictMode>
);
