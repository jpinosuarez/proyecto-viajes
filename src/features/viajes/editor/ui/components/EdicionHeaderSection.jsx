import React from 'react';
import { LoaderCircle, Globe2, CalendarDays, MapPinned } from 'lucide-react';
import { getCountryName, getFlagUrl, normalizeCountryCode } from '@shared/lib/utils/countryUtils';

const EdicionHeaderSection = ({
  t,
  formData,
  isMobile,
  isBusy,
  esBorrador,
  isTituloAuto,
  titlePulse,
  isProcessingImage,
  onTituloChange,
  onToggleTituloAuto,
}) => {
  const heroHeight = isMobile ? 178 : 214;

  const fallbackCountryName = getCountryName(formData?.code || formData?.paisCodigo || '') || t('labels.countryFallback', 'Destino por confirmar');
  const fallbackLocation = formData?.nombreEspanol || fallbackCountryName;
  const dateRangeText = `${formData?.fechaInicio || '--'} - ${formData?.fechaFin || '--'}`;

  const normalizedCountryCode = normalizeCountryCode(formData?.code || formData?.paisCodigo || formData?.countryCode || null);

  const flagValues = [];
  if (Array.isArray(formData?.banderas)) flagValues.push(...formData.banderas);
  if (Array.isArray(formData?.flags)) flagValues.push(...formData.flags);
  if (formData?.flag) flagValues.push(formData.flag);
  if (flagValues.length === 0 && normalizedCountryCode) flagValues.push(normalizedCountryCode);

  const rawFlags = flagValues
    .map((value) => {
      if (typeof value !== 'string') return null;
      if (/^https?:\/\//i.test(value)) return value;
      const normalized = normalizeCountryCode(value);
      return normalized ? getFlagUrl(normalized) : null;
    })
    .filter(Boolean)
    .slice(0, 4);

  const titleInputStyle = {
    width: '100%',
    minHeight: '52px',
    borderRadius: '14px',
    border: titlePulse ? '2px solid rgba(255, 107, 53, 0.65)' : '1.5px solid #D8E2F0',
    background: '#FFFFFF',
    color: '#1F2937',
    fontFamily: '"Plus Jakarta Sans", Inter, "Segoe UI", sans-serif',
    fontSize: isMobile ? '1.08rem' : '1.15rem',
    fontWeight: 700,
    lineHeight: 1.3,
    padding: '12px 14px',
    outline: 'none',
    transition: 'border-color 0.18s ease-out, box-shadow 0.18s ease-out',
  };

  const autoModeBtnStyle = {
    minHeight: '44px',
    borderRadius: '999px',
    border: isTituloAuto ? '1.5px solid #FF6B35' : '1.5px solid #D8E2F0',
    background: isTituloAuto ? 'rgba(255, 107, 53, 0.1)' : '#FFFFFF',
    color: isTituloAuto ? '#C94A1D' : '#475569',
    fontSize: '0.72rem',
    fontWeight: 800,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    padding: '0 14px',
    cursor: isBusy ? 'not-allowed' : 'pointer',
    opacity: isBusy ? 0.55 : 1,
  };

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '14px', flexShrink: 0 }}>
      <div
        style={{
          position: 'relative',
          height: heroHeight,
          borderRadius: isMobile ? '0 0 18px 18px' : '18px',
          overflow: 'hidden',
          background: formData?.portadaUrl
            ? `linear-gradient(145deg, rgba(16, 24, 40, 0.28) 0%, rgba(16, 24, 40, 0.55) 100%), url(${formData.portadaUrl}) center / cover`
            : 'linear-gradient(135deg, #2C3E50 0%, #45B0A8 68%, #FF6B35 100%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.12) 0%, rgba(15, 23, 42, 0.68) 92%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: isMobile ? '14px 14px 16px' : '16px 18px 18px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
            <span
              style={{
                minHeight: '32px',
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: '999px',
                padding: '0 10px',
                background: 'rgba(248, 250, 252, 0.18)',
                border: '1px solid rgba(248, 250, 252, 0.32)',
                color: '#F8FAFC',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}
            >
              {esBorrador ? t('labels.draft', 'Borrador') : t('labels.editing', 'Editando')}
            </span>

            {isProcessingImage && (
              <div
                style={{
                  minHeight: '32px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '999px',
                  padding: '0 10px',
                  background: 'rgba(248, 250, 252, 0.2)',
                  border: '1px solid rgba(248, 250, 252, 0.36)',
                  color: '#F8FAFC',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                <LoaderCircle size={14} className="spin" />
                <span>{t('optimizing', 'Optimizando...')}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                color: '#FFFFFF',
                fontSize: isMobile ? '1.22rem' : '1.38rem',
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
                textShadow: '0 1px 8px rgba(2, 6, 23, 0.35)',
              }}
            >
              {fallbackLocation}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span
                style={{
                  minHeight: '32px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '999px',
                  padding: '0 10px',
                  background: 'rgba(15, 23, 42, 0.36)',
                  border: '1px solid rgba(248, 250, 252, 0.28)',
                  color: '#F8FAFC',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                <CalendarDays size={14} />
                {dateRangeText}
              </span>

              <span
                style={{
                  minHeight: '32px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '999px',
                  padding: '0 10px',
                  background: 'rgba(15, 23, 42, 0.36)',
                  border: '1px solid rgba(248, 250, 252, 0.28)',
                  color: '#F8FAFC',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                <MapPinned size={14} />
                {fallbackCountryName}
              </span>

              {rawFlags.length > 0 ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', minHeight: '32px' }}>
                  {rawFlags.map((flagSrc, idx) => (
                    <img
                      key={`${flagSrc}-${idx}`}
                      src={flagSrc}
                      alt={t('labels.flagAlt', 'Country flag')}
                      width="24"
                      height="24"
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '1px solid rgba(248, 250, 252, 0.65)',
                        boxShadow: '0 2px 8px rgba(2, 6, 23, 0.35)',
                        background: 'rgba(255,255,255,0.9)',
                        objectFit: 'cover',
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ))}
                </span>
              ) : (
                <span
                  style={{
                    minHeight: '32px',
                    minWidth: '32px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '999px',
                    background: 'rgba(15, 23, 42, 0.36)',
                    border: '1px solid rgba(248, 250, 252, 0.28)',
                    color: '#F8FAFC',
                  }}
                  aria-label={t('labels.flagAlt', 'Country flag')}
                  title={t('labels.flagAlt', 'Country flag')}
                >
                  <Globe2 size={14} />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          background: '#F8FAFC',
          padding: isMobile ? '14px' : '16px',
          boxShadow: '0 10px 28px rgba(15, 23, 42, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <label
            htmlFor="trip-title-editor-input"
            style={{
              color: '#334155',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}
          >
            {t('labels.tripTitle', 'Titulo de la bitacora')}
          </label>

          {esBorrador && (
            <button
              type="button"
              style={autoModeBtnStyle}
              onClick={onToggleTituloAuto}
              disabled={isBusy}
              title={isTituloAuto ? t('tooltip.autoUpdate', 'Modo automatico') : t('tooltip.manualMode', 'Modo manual')}
            >
              {isTituloAuto ? t('autoTitle', 'AUTO') : t('manualTitle', 'MANUAL')}
            </button>
          )}
        </div>

        <input
          id="trip-title-editor-input"
          type="text"
          name="titulo"
          value={formData?.titulo || ''}
          onChange={(e) => onTituloChange(e.target.value)}
          style={titleInputStyle}
          placeholder={t('tripTitlePlaceholder', 'Titulo del viaje')}
          maxLength={80}
          disabled={isBusy}
        />

        <p
          style={{
            margin: 0,
            color: '#64748B',
            fontSize: '0.75rem',
            lineHeight: 1.35,
          }}
        >
          {t('editor:titleHint', 'Usa un titulo corto y memorable para reconocer rapido esta ruta en tu bitacora.')}
        </p>
      </div>
    </section>
  );
};

export default EdicionHeaderSection;
