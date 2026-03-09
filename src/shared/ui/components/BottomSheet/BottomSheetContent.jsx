import React from 'react';

/**
 * BottomSheetContent
 * Scrollable content area inside the BottomSheet.
 * Applies safe-area padding and touch-friendly scroll.
 */
const BottomSheetContent = ({ children, style }) => (
  <div
    style={{
      padding: '0 0 max(16px, env(safe-area-inset-bottom, 0px))',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      flex: 1,
      ...style,
    }}
  >
    {children}
  </div>
);

export default BottomSheetContent;
