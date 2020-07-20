import React from 'react';

export const Price: React.FC<{ value: number }> = ({ value }) => (
  <span className='price'>{value.toFixed(0)} ₽</span>
);

export const getPriceText = (value: number) => value.toFixed(0) + ' ₽';
