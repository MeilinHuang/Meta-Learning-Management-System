import MDBox from 'components/MDBox';
import React from 'react';
import MDTypography from 'components/MDTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Navbar from "katrina/components/Navbar";
import DataTable from 'examples/Tables/DataTable';

import { Card } from '@mui/material';
import Footer from 'katrina/components/Footer';
import axios from 'axios';
import apiConstants from 'katrina/constants/api';
import MDButton from 'components/MDButton';
import useAuth from 'katrina/auth/useAuth';
import { Link, useParams } from 'react-router-dom';
import MDBadge from 'components/MDBadge';



const Course = () => {

  const [rows, setRows] = React.useState([]);
  const { auth } = useAuth();
  const urlParams = useParams();

  const Title = ({ title }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox lineHeight={3}>
        <MDTypography display="block" variant="button" fontWeight="medium" >
          {title}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  const CourseCode = ({ code }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography component={Link} to={`/${auth.staff ? 'staff' : 'student'}/courses/${code}`}  display="block" variant="caption" color="text" fontWeight="medium">
        {code}
      </MDTypography>
    </MDBox>
  );

  const columns = [
    { Header: "title", accessor: "title", width: "60%", align: "left" },
    { Header: "course code", accessor: "course code", width: "15%", align: "left" },
    { Header: "term", accessor: "term", align: "center" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  React.useEffect(() => {
    console.log('code', urlParams.course)
    axios.get(`${apiConstants.BASE_URL}/courses/${ auth.staff ? 'teach/course/' : '' }${urlParams.course}`)
      .then((res) => {
        const sorted = res.data?.sort((a, b) => {
          return a.term > b.term ? -1 : 1
        })
        const rows = [];
        sorted?.forEach(c => {
          rows.push({
            title: <Title title={c.course_name} />,
            'course code': <CourseCode code={c.course_code} />,
            status: (
              <MDBadge
                badgeContent={c.term === '22T1' ? "In progress" : "finished"}
                color={c.term === '22T1' ? "success" : "dark"}
                variant="gradient"
                size="sm"
              />
            ),
            term: (
              <MDTypography variant="caption" color="text" fontWeight="medium">
                {c.term}
              </MDTypography>
            ),
            action: (
              <MDButton 
                component={Link} 
                to={auth.staff
                  ? `/staff/courses/${c.course_code}/${c.term}`
                  : `/student/courses/${c.course_code}/${c.term}`
                } 
                size='small' 
                variant="outlined" 
                color="info" 
                fontWeight="medium"
              >
                View
              </MDButton>
            ),
          })
        });
        setRows(rows);
      })
      .catch((err) => {
        console.log("getting course eerr")
        alert(err.status + ': ' + err);
      });
    // eslint-disable-next-line 
  }, []);

  return (
    <DashboardLayout>
      <Navbar />
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox
            mx={2}
            mt={-3}
            py={3}
            px={2}
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
          >
            <MDTypography variant="h6" color="white">
              {urlParams.course}
            </MDTypography>
          </MDBox>
          <MDBox pt={3}>
            <DataTable
              table={{ columns, rows }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
            />
          </MDBox>
        </Card>

      </MDBox>
    </DashboardLayout>
  )
}

export default Course;