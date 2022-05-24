import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
);