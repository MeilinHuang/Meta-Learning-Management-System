import React from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'katrina/components/Navbar';

/* Display for invalid url */
const HomePage = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <h4>Welcome! Please sign in from the side bar!</h4>
    </DashboardLayout>
  );
};

export default HomePage;
