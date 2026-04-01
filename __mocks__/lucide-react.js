import React from 'react';

const createIconComponent = (name) => 
  React.forwardRef((props, ref) => 
    React.createElement('span', { 'data-testid': `icon-${name}`, ...props, ref })
  );

export const BookOpen = createIconComponent('BookOpen');
export const MapPin = createIconComponent('MapPin');
export const Settings = createIconComponent('Settings');
export const LogOut = createIconComponent('LogOut');
export const Search = createIconComponent('Search');
export const X = createIconComponent('X');
export const ChevronDown = createIconComponent('ChevronDown');
export const ChevronUp = createIconComponent('ChevronUp');
export const Menu = createIconComponent('Menu');
export const Bell = createIconComponent('Bell');
export const Heart = createIconComponent('Heart');
export const Share2 = createIconComponent('Share2');
export const Trash2 = createIconComponent('Trash2');
export const Star = createIconComponent('Star');
export const Clock = createIconComponent('Clock');
export const Plus = createIconComponent('Plus');
export const Upload = createIconComponent('Upload');
export const Download = createIconComponent('Download');
export const Eye = createIconComponent('Eye');
export const EyeOff = createIconComponent('EyeOff');
