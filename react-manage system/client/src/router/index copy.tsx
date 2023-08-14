import App from '../App';
import Home from '../views/Home'
import About from "../views/About"
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from "react-router-dom"
import React,{lazy} from "react"
// 懒加载
// const About=lazy(()=>import("../views/About"))
const withLoadingComponent=(comp:JSX.Element)=>(
    <React.Suspense fallback={<div>Loading...</div>}>
        {comp}
    </React.Suspense>
)
const baseRouter = () => {
   
    return (
        <HashRouter>
            <Routes>
                <Route path='/' element={<App />}>
                    {/* 重定向 */}
                    <Route path='/' element={<Navigate to="/home" />}></Route>
                    <Route path='/home' element={<Home />}></Route>
                    <Route path='/about' element={<About />}></Route>
                </Route>
            </Routes>
        </HashRouter>
    )

}
export default baseRouter;