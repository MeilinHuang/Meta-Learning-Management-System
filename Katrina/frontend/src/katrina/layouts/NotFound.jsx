import React from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'katrina/components/Navbar';

/* Display for invalid url */
const NotFound = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
        <h1>
          404 Not Found
        </h1>
        <h2>
          Opps! Page not exists :O
        </h2>
    </DashboardLayout>
  );
};

export default NotFound;
