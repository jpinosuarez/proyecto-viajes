import { useCallback } from 'react';
import { useOperationalFlags } from '@shared/lib/hooks/useOperationalFlags';

export function useEdicionGalleryManager({ galeria, captionDrafts, setCaptionDrafts, pushToast, t }) {
  const {
    flags: { level: operationalLevel, appReadonlyMode },
  } = useOperationalFlags();
  const isReadOnlyMode = Boolean(appReadonlyMode) || operationalLevel >= 3;

  const handleSetPortadaExistente = useCallback(
    async (fotoId) => {
      if (isReadOnlyMode) {
        pushToast(
          t(
            'common:operational.readOnlyBlockedAction',
            'Keeptrip is in Read-Only mode. Your data is safe, but edits are paused.'
          ),
          'info'
        );
        return;
      }

      const ok = await galeria.cambiarPortada(fotoId);
      if (!ok) pushToast(t('error.coverUpdateFailed'), 'error');
    },
    [galeria, isReadOnlyMode, pushToast, t]
  );

  const handleEliminarFoto = useCallback(
    async (fotoId) => {
      if (isReadOnlyMode) {
        pushToast(
          t(
            'common:operational.readOnlyBlockedAction',
            'Keeptrip is in Read-Only mode. Your data is safe, but edits are paused.'
          ),
          'info'
        );
        return;
      }

      const confirm = window.confirm(t('confirm.deletePhoto'));
      if (!confirm) return;
      const ok = await galeria.eliminar(fotoId);
      if (!ok) pushToast(t('error.photoDeleteFailed'), 'error');
    },
    [galeria, isReadOnlyMode, pushToast, t]
  );

  const handleCaptionChange = useCallback((fotoId, value) => {
    setCaptionDrafts((prev) => ({ ...prev, [fotoId]: value }));
  }, [setCaptionDrafts]);

  const handleCaptionSave = useCallback(
    async (foto) => {
      if (isReadOnlyMode) {
        pushToast(
          t(
            'common:operational.readOnlyBlockedAction',
            'Keeptrip is in Read-Only mode. Your data is safe, but edits are paused.'
          ),
          'info'
        );
        return;
      }

      const draft = captionDrafts[foto.id];
      if (draft === undefined) return;

      const normalized = draft.trim();
      const nextCaption = normalized.length ? normalized : null;
      const currentCaption = foto.caption || null;
      if (currentCaption === nextCaption) return;

      const ok = await galeria.actualizarCaption(foto.id, nextCaption);
      if (!ok) {
        pushToast(t('error.captionSaveFailed'), 'error');
        return;
      }

      pushToast(t('toast.captionUpdated'), 'success', 1500);
    },
    [captionDrafts, galeria, isReadOnlyMode, pushToast, t]
  );

  return {
    handleSetPortadaExistente,
    handleEliminarFoto,
    handleCaptionChange,
    handleCaptionSave,
  };
}
