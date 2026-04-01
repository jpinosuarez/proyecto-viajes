import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateRange } from '@shared/lib/utils/viajeUtils';
import { getLocalizedCountryName } from '@shared/lib/utils/countryI18n';

export function useVisorViajeStory({ data, viajeBase, paradas }) {
  const { t, i18n } = useTranslation(['countries', 'visor']);

  const fotoMostrada = useMemo(() => {
    if (data.foto && typeof data.foto === 'string' && data.foto.trim()) return data.foto;
    if (viajeBase?.foto && typeof viajeBase.foto === 'string' && viajeBase.foto.trim()) return viajeBase.foto;
    return null;
  }, [data.foto, viajeBase?.foto]);

  const countryCode = data?.paisCodigo || data?.code || viajeBase?.paisCodigo || viajeBase?.code || null;
  const localizedCountryName = getLocalizedCountryName(countryCode, i18n.language, t);
  const fallbackTitle = localizedCountryName || viajeBase?.nombreEspanol || t('untitledTrip', { ns: 'visor', defaultValue: 'Mi viaje' });

  const storyData = useMemo(
    () => ({
      titulo: data.titulo || fallbackTitle,
      fechas: formatDateRange(data.fechaInicio, data.fechaFin),
      foto: fotoMostrada,
      banderas: data.banderas || [],
      paisesCount: [...new Set((paradas || []).map((p) => p.paisCodigo).filter(Boolean))].length || 1,
      paradasCount: paradas.length,
      diasCount: (() => {
        if (!data.fechaInicio || !data.fechaFin) return '—';
        const d1 = new Date(data.fechaInicio);
        const d2 = new Date(data.fechaFin);
        return isNaN(d1) || isNaN(d2) ? '—' : Math.max(1, Math.round((d2 - d1) / 86400000) + 1);
      })(),
      presupuesto: data.presupuesto || null,
      vibes: data.vibe || [],
    }),
    [data, fallbackTitle, fotoMostrada, paradas]
  );

  return {
    fotoMostrada,
    storyData,
  };
}
