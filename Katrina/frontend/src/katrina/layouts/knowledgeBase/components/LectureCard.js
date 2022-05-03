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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";
import useAuth from "katrina/auth/useAuth";

function ComplexStatisticsCard({ color, lectureObj, courseCode, term, id }) {
  const {auth} = useAuth();
  return (
    <Card 
      variant="outlined" 
      component={Link}
      to={`/student/courses/${courseCode}/${term}/${id}`}
      sx={{ 
        m: 1,
        pb: 1,
        borderRadius: '7px', 
        border: '0px', 
        height: '250px', 
        width: '350px',
        transition: '0.3s',
        '&:hover': { transform: 'scale(1.03)' },
      }}
    >
      <MDBox display="flex" justifyContent="space-between" pt={1} px={2} >
        <MDBox
          variant="gradient"
          bgColor={color}
          color={color === "light" ? "dark" : "white"}
          coloredShadow={color}
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="4rem"
          height="3.7rem"
          mt={-3}
        >
          {auth.name.toUpperCase()[0]}
        </MDBox>
        <MDBox display="flex" flexDirection="column" alignItems="flex-end" textAlign="right" lineHeight={1.25}  sx={{ width: '300px'}}>
          <MDTypography variant="button" fontWeight="light" color="text">
            {`Updated at: ${lectureObj.last_update}`}
          </MDTypography>
          <MDBadge 
            badgeContent={lectureObj.is_public ? "Public" : "Private"} 
            color={lectureObj.is_public ? "success" : "secondary"} 
            variant="gradient" 
            size="sm" 
          />
        </MDBox>
      </MDBox>
      <MDBox lineHeight={1.25} sx={{p: '10px 20px 0 20px'}}>
        <MDTypography variant="h6">{`${lectureObj.lecture_title} (wk${lectureObj.lecture_week})`}</MDTypography>
      </MDBox>
      <Divider />
      <MDBox pb={2} px={2} sx={{overflow: 'auto'}}>
            {
              // list concepts added in this lecture
              lectureObj.concepts.sort().map((c, idx) =>
                  <MDButton  
                    component={Link} 
                    to={`/student/knowledge-base/${c}`}
                    variant='outlined'
                    color='info'
                    size="small"
                    key={idx}
                    sx={{ margin: '3px'}}
                  >
                    {c}
                  </MDButton>
              )
            }
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of ComplexStatisticsCard
ComplexStatisticsCard.defaultProps = {
  color: "info",
  percentage: {
    color: "success",
    text: "",
    label: "",
  },
};

// Typechecking props for the ComplexStatisticsCard
ComplexStatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
};

export default ComplexStatisticsCard;
