import React from 'react';

export const getPriceToRender = (value: number) => (
  <span className='price'>{value.toFixed(0)} ₽</span>
);

export const getPriceText = (value: number) => value.toFixed(0) + ' ₽';
