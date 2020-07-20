import React from 'react';
import moment from 'moment';

export const getDateFromNowToRender = (value: string) =>
  value ? <span className='date'>{moment(value).fromNow()} ₽</span> : null;

export const getPriceText = (value: string) => moment(value).fromNow();
