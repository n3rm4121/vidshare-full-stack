import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './MainLayout';  
const Layout = () => {
  return (
    <>
      <Navbar /> 
      <main>
        <Outlet />  
      </main>
    </>
  );
};

export default Layout;
