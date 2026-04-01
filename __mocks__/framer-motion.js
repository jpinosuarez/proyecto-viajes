import React from 'react';

const createMotionComponent = (Component) => 
  React.forwardRef((props, ref) => React.createElement(Component, { ...props, ref }));

export const motion = {
  div: createMotionComponent('div'),
  span: createMotionComponent('span'),
  button: createMotionComponent('button'),
  p: createMotionComponent('p'),
  h1: createMotionComponent('h1'),
  h2: createMotionComponent('h2'),
  h3: createMotionComponent('h3'),
  header: createMotionComponent('header'),
  nav: createMotionComponent('nav'),
  section: createMotionComponent('section'),
  article: createMotionComponent('article'),
  footer: createMotionComponent('footer'),
};

export const useMotionValue = (v) => ({ get: () => v, set: () => {} });
export const useTransform = () => ({ get: () => 0, set: () => {} });
export const animate = () => {};
export const AnimatePresence = ({ children }) => children;
