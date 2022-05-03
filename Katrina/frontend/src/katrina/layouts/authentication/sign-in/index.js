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

import React from 'react';
import axios from 'axios';
import apiConstants from 'katrina/constants/api';
import useAuth from 'katrina/auth/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "katrina/layouts/authentication/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import MDSnackbar from "components/MDSnackbar";

function Basic() {
  const [rememberMe, setRememberMe] = React.useState(false);
  const { setAuth } = useAuth();

  // alert is closed by default
  const [alertMsg, setAlertMsg] = React.useState('');
  const [alert, setAlert] = React.useState(false);

  // for auto redirect to dashboard
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";


  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget.parentNode.parentNode);
    if (!data.get('email') || !data.get('password')) {
      setAlertMsg('Please insert email and password.');
      setAlert(true);
      return;
    }
    const body = {
      email: data.get('email'),
      password: data.get('password'),
    }
    axios.post(`${apiConstants.BASE_URL}/user/auth`,
      JSON.stringify(body),
      {
        headers: {
          "Content-type": "application/json",
        }
      })
      .then((res) => {
        setAlert(false);
        setAuth(res.data);
        localStorage.setItem('auth', JSON.stringify(res.data))
        // auto navigate to where it from
        navigate(from === "/" || undefined
          ? res.data.staff
            ? "/staff/courses"
            : "/student/courses"
          : from, { replace: true })
      })
      .catch((err) => {
        console.log(err)
        switch (err.response.status) {
          case 404:
            setAlertMsg('User not exists. Please try again!');
            setAlert(true);
            break;

          default:
            setAlertMsg('Internal error occurred. Please try again later.');
            setAlert(true);
            break;
        }
      });
  };



  return (
    <BasicLayout image={bgImage}>
      <MDSnackbar
        color="error"
        icon="warning"
        title="Note Taking"
        content={alertMsg}
        open={alert}
        dateTime=""
        onClose={() => setAlert(false)}
        close={() => setAlert(false)}
        bgWhite
      />
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
              <MDInput 
                type="email" 
                name="email"
                label="Email" 
                required
                fullWidth 
                sx={{ mb: 2 }}
              />
              <MDInput 
                type="password" 
                label="Password" 
                name="password"
                required
                fullWidth 
                sx={{mb: 2}}
              />
            {/* <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox> */}
            <MDBox mt={1} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleSubmit}>
                sign in
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;