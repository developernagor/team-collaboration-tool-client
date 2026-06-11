import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'
import useSessionTracker from '../../hooks/useSessionTracker';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebase.config';

function MainLayout() {
  const [user, setUser] =
    useState(null);

    useEffect(() => {
    return onAuthStateChanged(
      auth,
      setUser
    );
  }, []);

  useSessionTracker(user);


  return (
    <div lassName="pt-16">
      <Navbar></Navbar>
      <div className="min-h-[calc(100vh-116px)]">
      <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  )
}

export default MainLayout
