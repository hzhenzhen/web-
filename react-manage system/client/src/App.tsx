import React from 'react';
import {useRoutes,Link} from 'react-router-dom'
import router from "./router"
import { LanguageProvider } from './views/LanguageContext'
function App() {
  const  outlet=useRoutes(router)
  return (
    <LanguageProvider> {/* 在这里包裹 LanguageProvider */}
      <div className='App'>
        {outlet}
      </div>
    </LanguageProvider>
  )
}
export default App;
