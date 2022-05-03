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

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Notifications from "layouts/notifications";
import Profile from "katrina/layouts/profile";
import SignIn from "katrina/layouts/authentication/sign-in";

// @mui icons
import Icon from "@mui/material/Icon";
import Courses from "katrina/layouts/courses";
import KnowledgeBase from "katrina/layouts/knowledgeBase";
import Unauthorized from "katrina/layouts/authentication/Unauthorized";
import HomePage from "katrina/layouts/HomePage";
import CoursePage from "katrina/layouts/coursePage";
import SignOut from "katrina/layouts/authentication/sign-out";

export const studentRoutes = [
  // {
  //   type: "collapse",
  //   name: "Dashboard",
  //   key: "dashboard",
  //   icon: <Icon fontSize="small">dashboard</Icon>,
  //   route: "/student/dashboard",
  //   component: <Dashboard />,
  // },
  {
    type: "collapse",
    name: "Courses",
    key: "courses",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/student/courses",
    component: <Courses />,
  },
  {
    type: "collapse",
    name: "KnowedgeBase",
    key: "knowledgebase",
    icon: <Icon fontSize="small">donut_large</Icon>,
    route: "/student/knowledge-base",
    component: <KnowledgeBase />,
  },
  {
    type: "collapse",
    name: "World",
    key: "world",
    icon: <Icon fontSize="small">public</Icon>,
    route: "/student/world",
    component: <KnowledgeBase />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/student/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Sign Out",
    key: "sign-out",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/authentication/sign-out",
    component: <SignOut />,
  },
  
];

export const staffRoutes = [
  // {
  //   type: "collapse",
  //   name: "Dashboard",
  //   key: "dashboard",
  //   icon: <Icon fontSize="small">dashboard</Icon>,
  //   route: "/staff/dashboard",
  //   component: <Dashboard />,
  // },
  {
    type: "collapse",
    name: "Courses",
    key: "courses",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/staff/courses",
    component: <Courses />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/staff/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Sign Out",
    key: "sign-out",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/authentication/sign-out",
    component: <SignOut />,
  },
  
]

export const defaultRoutes = [
  {
    type: "",
    name: "Home",
    key: "home2",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/",
    component: <HomePage />,
  },
  {
    type: "collapse",
    name: "Home",
    key: "home",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/home",
    component: <HomePage />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "",
    name: "Unauthorized",
    key: "unauthorized",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/unauthorized",
    component: <Unauthorized />,
  },
]

