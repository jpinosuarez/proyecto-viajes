import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for debounced auto-save to Firebase.
 * Manages save state, error handling, and debounce timing.
 * 
 * Status: 'unsaved' | 'saving' | 'saved' | 'error'
 */
export function useAutoSaveEditor(formData, viajeId, onSave, debounceMs = 1500) {
  const [saveStatus, setStatus] = useState('unsaved'); // unsaved | saving | saved | error
  const debounceTimer = useRef(null);
  const isMountedRef = useRef(true);
  const lastSavedData = useRef(null);

  const safeSetStatus = useCallback((status) => {
    if (isMountedRef.current) setStatus(status);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Reset auto-save state when editing a different trip
    lastSavedData.current = null;
    safeSetStatus('unsaved');
  }, [viajeId]);

  // Trigger auto-save with debounce
  const triggerAutoSave = useCallback(async () => {
    // Check if data actually changed
    if (JSON.stringify(lastSavedData.current) === JSON.stringify(formData)) {
      return;
    }

    safeSetStatus('saving');

    try {
      const result = await onSave(viajeId, formData);
      
      if (result === true || (typeof result === 'object' && result?.success)) {
        lastSavedData.current = { ...formData };
        safeSetStatus('saved');
        
        // Auto-clear "saved" badge after 2s
        setTimeout(() => {
          safeSetStatus('unsaved');
        }, 2000);
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      safeSetStatus('error');
      
      // Retry on error after 1s
      setTimeout(() => {
        triggerAutoSave();
      }, 1000);
    }
  }, [formData, viajeId, onSave]);

  // Debounced save trigger
  useEffect(() => {
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    safeSetStatus('unsaved');
    debounceTimer.current = setTimeout(() => {
      triggerAutoSave();
    }, debounceMs);

    // Cleanup on unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [formData, triggerAutoSave, debounceMs]);

  // Force save immediately
  const forceSave = useCallback(async () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    await triggerAutoSave();
  }, [triggerAutoSave]);

  return {
    saveStatus,
    forceSave,
  };
}
