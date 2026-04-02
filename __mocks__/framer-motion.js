import React from 'react';

const createMotionComponent = (Component) =>
  React.forwardRef((props, ref) => React.createElement(Component, { ...props, ref }));

export const motion = new Proxy({}, {
  get: (_target, key) => createMotionComponent(typeof key === 'string' ? key : 'div'),
});

export const useMotionValue = (v) => ({ get: () => v, set: () => {} });
export const useTransform = () => ({ get: () => 0, set: () => {} });
export const useSpring = (value) => value;
export const useReducedMotion = () => false;
export const animate = () => ({ stop: () => {} });
export const AnimatePresence = ({ children }) => children;
export const LayoutGroup = ({ children }) => children;
export const MotionConfig = ({ children }) => children;
