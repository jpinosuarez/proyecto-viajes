import React from 'react';
import { COLORS } from '@shared/config';

/**
 * BottomSheetHeader
 * Renders the drag handle bar at the top of the sheet.
 * Touch target row is >=44px for ergonomic drag interaction.
 */
const BottomSheetHeader = ({ isDragging = false }) => (
  <div
    aria-hidden="true"
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '44px', // Touch target
      padding: '14px 0 6px',
      cursor: isDragging ? 'grabbing' : 'grab',
      userSelect: 'none',
      touchAction: 'none',
    }}
  >
    <div
      style={{
        width: '40px',
        height: '5px',
        borderRadius: '3px',
        background: isDragging ? COLORS.atomicTangerine : COLORS.border,
        transition: 'background 0.2s ease',
      }}
    />
  </div>
);

export default BottomSheetHeader;
