import './index.css';
import 'moment/locale/ru';

import moment from 'moment';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import App from './App';

moment.locale('ru');
const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
