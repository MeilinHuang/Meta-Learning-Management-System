/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, useLocation, Outlet, Navigate } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import { defaultRoutes, studentRoutes, staffRoutes } from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import React from 'react';

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import RequireAuth from "katrina/auth/RequireAuth";
import NotFound from "katrina/layouts/NotFound";
import Dashboard from "layouts/dashboard";
import Courses from "katrina/layouts/courses";
import Profile from "katrina/layouts/profile";
import KnowledgeBase from "katrina/layouts/knowledgeBase";
import HomePage from "katrina/layouts/HomePage";
import SignIn from "katrina/layouts/authentication/sign-in";
import SignOut from "katrina/layouts/authentication/sign-out";
import Unauthorized from "katrina/layouts/authentication/Unauthorized";
import CoursePage from "katrina/layouts/coursePage";
import Course from "katrina/layouts/course";
import LecturePage from "katrina/layouts/LecturePage";
import ConceptPage from "katrina/layouts/concept/ConceptPage";
import World from "katrina/layouts/world/World";
import useAuth from "katrina/auth/useAuth";
import Notes from "katrina/layouts/notes";


export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  const { setAuth } = useAuth();

  React.useEffect(() => {
    const a = JSON.parse(localStorage.getItem('auth'))
    if (a !== undefined) {
      setAuth(a)
    }
  }, [])

  
  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  const pathnameContain = (needle) => pathname.indexOf(needle) !== -1;


  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {
      // layout === "dashboard" && (
      //   <>
      //     <Sidenav
      //       color={sidenavColor}
      //       brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
      //       brandName="Note Taking"
      //       routes={defaultRoutes}
      //       onMouseEnter={handleOnMouseEnter}
      //       onMouseLeave={handleOnMouseLeave}
      //     />
      //     <Configurator />
      //     {/* {configsButton} */}
      //   </>
      //   )
      }
      
      <Routes>
        <Route path="/" element=
          { 
            <>
              <MDBox>
              
                {
                  layout === "dashboard" && (
                  <>
                    <Sidenav
                      color={sidenavColor}
                      brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                      brandName="Note Taking"
                      routes={
                        (pathnameContain('student') && studentRoutes) ||
                        (pathnameContain('staff') && staffRoutes) ||
                        defaultRoutes
                      }
                      onMouseEnter={handleOnMouseEnter}
                      onMouseLeave={handleOnMouseLeave}
                    />
                    <Configurator />
                    {/* {configsButton} */}
                  </>
                )}
                {layout === "vr" && <Configurator />}
              </MDBox>
              <Outlet />
            </>
          }
        
         >

          {/* Public views (does not reqire login) */}
          <Route exact path='/' element={<Navigate replace to='home' />} />
          <Route exact path='/home' element={<HomePage />} />
          <Route exact path='/authentication/sign-in' element={<SignIn />} />
          <Route exact path='/authentication/sign-out' element={<SignOut />} />
          <Route exact path='/unauthorized' element={<Unauthorized />} />

          

          {/* For students view */}
          <Route path="/student" element={<RequireAuth isStaff={false} />}>
            <Route exact path='dashboard' element={<Dashboard />} />
            <Route exact path='courses' element={<Courses />} />
            <Route exact path='courses/:course' element={<Course />} />
            <Route exact path='profile/:userId' element={<Profile self={false} staff={false}/>} />
            <Route exact path='profile/' element={<Profile self={true} staff={false}/>} />
            <Route exact path='knowledge-base' element={<KnowledgeBase />} />
            <Route exact path='world' element={<World />} />


            <Route exact path='courses/:course/:term' element={<CoursePage />} />
            <Route exact path='courses/:course/:term/:lecture/:userId' element={<LecturePage self={false}/>} />
            <Route exact path='courses/:course/:term/:lecture' element={<LecturePage self={true}/>} />
            <Route exact path='knowledge-base/:keyword' element={<ConceptPage />} />
            <Route exact path="" element={<Navigate replace to='courses'/>} />
          </Route>

          {/* For staff view */}
          <Route path='/staff' element={<RequireAuth isStaff={true} />}>
            <Route exact path='dashboard' element={<Dashboard />} />
            <Route exact path='courses' element={<Courses />} />
            <Route exact path='courses/:course/:term/:lecture/:userId' element={<LecturePage self={false} />} />
            <Route exact path='courses/:course/:term' element={<Notes />} />
            <Route exact path='courses/:course' element={<Course />} />
            <Route exact path='profile/:userId' element={<Profile self={false} staff={false} />} />
            <Route exact path='profile/' element={<Profile self={true} staff={true} />} />
            <Route exact path="" element={<Navigate replace to='courses' />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
