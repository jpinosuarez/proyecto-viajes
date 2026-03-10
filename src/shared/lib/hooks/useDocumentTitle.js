import { useEffect } from 'react';

const APP_NAME = 'Keeptrip';

/**
 * Actualiza `document.title` a `"${title} | Keeptrip"`.
 * Acepta un string ya traducido; la traducción es responsabilidad del consumer.
 * En viajes dinámicos pasar `viajeBase?.titulo` (puede ser undefined inicialmente).
 * Restaura el título base al desmontar.
 *
 * @param {string | undefined} title - Título de la página actual.
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
