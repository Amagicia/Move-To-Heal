import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const containerRef = useRef(null);

  useGSAP(() => {
    // Only animate on route change
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa]">
      {!isLanding && <Sidebar />}
      
      <div className={`flex flex-col flex-1 relative ${!isLanding ? 'w-[calc(100%-250px)]' : 'w-full'}`}>
        <Navbar isLanding={isLanding} />
        <main 
          className="flex-1 overflow-y-auto overflow-x-hidden pt-20 px-6 lg:px-12 pb-12"
          id="main-scroll"
        >
          <div ref={containerRef} className="max-w-7xl mx-auto w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
