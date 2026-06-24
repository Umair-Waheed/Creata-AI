import React,{useState} from 'react'
import { Outlet,useNavigate } from 'react-router-dom'
import {assets} from "../assets/assets"
import {X,Menu} from "lucide-react"
import Sidebar from '../components/Sidebar'
import { SignIn,useUser} from "@clerk/clerk-react"

const Layout = () => {
  const navigate=useNavigate();
  const [sidebar,setSidebar]=useState(false);
  const {user}=useUser();

  return user ? (
    <div className="flex flex-col items-start justify-start h-screen">
      <nav className="w-full px-8 h-16 flex items-center justify-between
      border-b border-gray-200 shrink-0">
        <img src={assets.logo} className="cursor-pointer w-32 sm:w-44 object-contain" alt="logo" onClick={()=>navigate('/')}/>

        {
          sidebar ? <X onClick={()=> setSidebar(false)} className="w-6 h-6 text-gray-600 sm:hidden" />
          : <Menu onClick={()=> setSidebar(true)} className="w-6 h-6 text-gray-600 sm:hidden " />
      
      }
      </nav>

      <div className="flex-1 w-full flex h-[calc(100vh-64px)]">
        {/* Overlay — only shows on mobile when sidebar open */}
        {sidebar && (
          <div
            className="fixed inset-0 z-40 bg-black/40 sm:hidden"
            onClick={() => setSidebar(false)}
          />
        )}
        {/* sidebar show on left side */}
        <Sidebar sidebar={sidebar} setSidebar={setSidebar}/>
      
        {/* outlet is the links or childern or layout route for ai tools show on right side */}
        <div className="flex-1 bg-[#F4F7FB] overflow-auto">
          <Outlet/> 
        </div>
      
      </div>
    </div>
  ) :
    <div className="flex items-center justify-center h-screen">
      <SignIn/>
    </div>
}

export default Layout