import React from 'react';
import { Toaster } from 'react-hot-toast';

interface ToasterComponent {
  position:
    | 'top-left'
    | 'top-center'
    | 'top-left'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
}

export const ToasterComponent = ({ position }: ToasterComponent) => {
  return <Toaster position={position} reverseOrder={false} />;
};
