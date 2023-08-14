import React from 'react';
import ReactDOM from 'react-dom/client';

// 样式初始化
import 'reset-css'
// UI框架样式

// 全局样式
import './assets/styles/global.css'
// 组件样式

import App from './App';
import { HashRouter } from 'react-router-dom';
// import Router from './router';
import { LanguageProvider } from './views/LanguageContext';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HashRouter>
   
        <App />
     
    </HashRouter>
  </React.StrictMode>
);


