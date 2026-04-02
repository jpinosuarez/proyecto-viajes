import React from 'react';
import { contextCardStyles as s } from './ContextCard.styles';

const areOnlyImageChildren = (children) => {
  const childList = React.Children.toArray(children).filter(Boolean);
  if (childList.length === 0) return false;
  return childList.every((child) => React.isValidElement(child) && child.type === 'img');
};

/**
 * Tarjeta tipo Bento local para el Modo Destino del VisorViaje.
 * Puro presentacional — usa tokens del theme via ContextCard.styles.js.
 * NO importa ni extiende BentoCard.
 *
 * @param {{ icon?: string, label: string, value?: string, children?: React.ReactNode, style?: object }} props
 */
const ContextCard = ({ icon, label, value, children, style }) => (
  <div style={{ ...s.card, ...style }}>
    <div style={s.header}>
      {icon && <span style={s.icon}>{icon}</span>}
      <span style={s.label}>{label}</span>
    </div>
    {children ? (
      <div style={{ ...s.childrenWrapper, ...(areOnlyImageChildren(children) ? s.flagsWrap : null) }}>{children}</div>
    ) : (
      value && <span style={s.value}>{value}</span>
    )}
  </div>
);

export default ContextCard;
