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

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Menu from "@mui/material/Menu";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DefaultNavbarLink from "examples/Navbars/DefaultNavbar/DefaultNavbarLink";

function DefaultNavbarMobile({ open, close, light }) {
  const { width } = open && open.getBoundingClientRect();

  return (
    <Menu
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      anchorEl={open}
      open={Boolean(open)}
      onClose={close}
      MenuListProps={{ style: { width: `calc(${width}px - 4rem)` } }}
    >
      <MDBox px={0.5}>
        {
          window.location.href.indexOf('student') > 0
            ? <>
              <DefaultNavbarLink icon="table_view" name="courses" route="/student/courses" light={light} />
              <DefaultNavbarLink icon="donut_large" name="knowledge base" route="/student/knowledge-base" light={light} />
              <DefaultNavbarLink icon="public" name="world" route="/student/world" light={light} />
              <DefaultNavbarLink icon="person" name="profile" route="/student/profile" light={light} />
            </>
            : <>
              <DefaultNavbarLink icon="donut_large" name="dashboard" route="/staff/dashboard" light={light} />
              <DefaultNavbarLink icon="table_view" name="courses" route="/staff/courses" light={light} />
              <DefaultNavbarLink icon="person" name="profile" route="/staff/profile" light={light} />
            </>
        }
      </MDBox>
    </Menu>
  );
}

// Typechecking props for the DefaultNavbarMenu
DefaultNavbarMobile.propTypes = {
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  close: PropTypes.oneOfType([PropTypes.func, PropTypes.bool, PropTypes.object]).isRequired,
};

export default DefaultNavbarMobile;
