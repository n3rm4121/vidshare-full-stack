import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMenu } from '../features/MenuSlice';

function MainLayout() {
  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state) => state.menu.isMenuOpen);

  const handleToggleMenu = () => {
    dispatch(toggleMenu());
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isMenuOpen={isMenuOpen} />

      <div className="flex-1 flex flex-col">
        <Navbar toggleMenu={handleToggleMenu} />

        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 lg:p-10">
          <Outlet />
        </main>

        {/* Overlay when menu is open */}
        {isMenuOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 lg:hidden" />
        )}
      </div>
    </div>
  );
}

export default MainLayout;
