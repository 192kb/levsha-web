import React from 'react';
import moment from 'moment';

export const DateFromNow: React.FC<{ value: string }> = ({ value }) =>
  value ? <span className='date'>{moment(value).fromNow()}</span> : null;

export const getPriceText = (value: string) => moment(value).fromNow();
