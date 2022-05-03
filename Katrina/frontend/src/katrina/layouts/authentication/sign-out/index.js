import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import useAuth from 'katrina/auth/useAuth';
import DashboardNavbar from 'katrina/components/Navbar';
import React from 'react';

const SignOut = () => {
  const { setAuth } = useAuth();

  React.useEffect(() => {
    setAuth({})
    localStorage.clear()
  }, [])
  

  return (
    <DashboardLayout>
      <DashboardNavbar />
        <h1>You've signed out</h1>
    </DashboardLayout>
  )
}

export default SignOut;