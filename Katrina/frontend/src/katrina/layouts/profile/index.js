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

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Navbar from "katrina/components/Navbar";
import ProfileInfoCard from "./components/ProfileInfoCard";

// Overview page components
import Header from "./components/Header";

// Data
import { Card } from "@mui/material";
import useAuth from "katrina/auth/useAuth";
import React from "react";
import axios from "axios";
import apiConstants from "katrina/constants/api";
import { Link, useParams } from "react-router-dom";

function Overview({self, staff}) {
  const { auth } = useAuth();
  const [notes, setNotes] = React.useState([])
  const [user, setUser] = React.useState({})
  const urlParams = useParams();

  React.useEffect(() => {
    // fetch all public notes of this person
    axios.get(`${apiConstants.BASE_URL}/user/name/${self ? auth.id : urlParams.userId}`)
    .then(res => {
      setUser(res.data)
      if (!staff)
        return axios.get(`${apiConstants.BASE_URL}/notes-user/public/${self ? auth.id : urlParams.userId}`)
    })
    .then(res => {
      setNotes(res.data.reverse())
    })
    .catch(err => {
      console.log(err)
    })
  }, [self, staff])

  return (
    <DashboardLayout>
      <Navbar />
      <MDBox mb={2} />
      <Header user={user}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            {/*  basic information  */}
            <Grid item xs={12} md={12} xl={12} sx={{ display: "flex" }}>
              <ProfileInfoCard
                title="profile information"
                description="Hi, nice to meet you!"
                info={{
                  fullName: user.name,
                }}
                social={[
                  {
                    link: "https://www.facebook.com",
                    icon: <FacebookIcon />,
                    color: "facebook",
                  },
                  {
                    link: "https://twitter.com/",
                    icon: <TwitterIcon />,
                    color: "twitter",
                  },
                  {
                    link: "https://www.instagram.com/",
                    icon: <InstagramIcon />,
                    color: "instagram",
                  },
                ]}
                shadow={false}
              />
              {
                staff
                ? <></>
                : <>
                    <Divider orientation="vertical" sx={{ mx: 0 }} />
                    <Grid item xs={12} xl={9}>
                      <Card sx={{ height: "100%", boxShadow: "none" }}>
                        <MDBox pt={2} px={2}>
                          <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                            Public Notes
                          </MDTypography>
                        </MDBox>
                        {/* display all public notes of this person */}
                        <MDBox p={2}>
                          <MDBox component="ul" display="flex" flexDirection="row" flexWrap='wrap' p={0} m={0}>
                            {
                              notes.length === 0 
                              ? <h5>No public notes available.</h5>
                              : notes.map((n, idx) => 
                                <MDBox 
                                  key={idx} 
                                  component={Link}
                                  to={`/student/courses/${n.course_code}/${n.term}/${n.lecture_id}/${self || urlParams.userId == auth.id ? '' : urlParams.userId}`}
                                  shadow='lg' 
                                  color='white' 
                                  bgColor='info'
                                  variant='gradient'
                                  p={1} 
                                  m={0.5}
                                  borderRadius='lg'
                                  sx={{
                                    width: '30%',
                                    transition: '0.3s',
                                    '&:hover': { transform: 'scale(1.03)' },
                                    fontWeight: 'light',
                                    fontSize: '10pt'
                                  }}
                                >
                                  <span style={{fontWeight: 'bold'}}>{n.course_code} ({n.term})</span> - [Wk{n.lecture_week}] {n.lecture_title}
                                </MDBox>)
                            }
                          </MDBox>
                        </MDBox>
                      </Card>
                    </Grid>
                
                  </>
              }
              </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={2} px={2} lineHeight={1.25} />
      </Header>
    </DashboardLayout>
  );
}

export default Overview;
