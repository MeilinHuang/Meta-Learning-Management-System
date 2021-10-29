import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.js";
import WidgetsBar from "../components/widgets/WidgetsBar.js";

import CourseContentPage from "../pages/CourseContentPage.js";
import CourseDashboard from "../pages/CourseDashboard.js";
import ForumOverviewPage from "../pages/ForumOverviewPage.js";
import ForumPostPage from "../pages/ForumPostPage";
import CourseAnnouncementPage from "../pages/CourseAnnouncementPage";
import LecturesPage from "./LecturesPage.js";

import { Switch, Route } from "react-router-dom";
import { backend_url } from "../Constants.js";
import { useBreakpointValue, Flex, Container, Box } from "@chakra-ui/react";
import { isLoggedIn, isStaff } from "../utils/helpers.js";
import EnrollmentDashboard from "../components/enrollment/EnrollmentDashboard.js";

function CoursePage() {
  //currently hardcoded sidebar content
  // Add the name and url for your page here
  const links = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "Content",
      url: "/content",
    },
    {
      name: "Forums",
      url: "/forums",
    },
    {
      name: "Lectures",
      url: "/lectures",
    },
  ];
  if (isStaff()) {
    links.push({
      name: "Enrollment",
      url: "/enrollment",
    });
  }
  const smVariant = "drawer";
  const mdVariant = "sidebar";
  const variants = useBreakpointValue({ base: smVariant, md: mdVariant });
  const [isOpen, setOpen] = useState(false);

    const [topicGroup, setGroup] = useState(null);
    const [name, setName] = useState(
        window.location.pathname.split("/").filter((e) => e !== "")[1]
    );
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!isLoggedIn()) {
            //Redirect to main page if not logged in
            window.location.pathname = "/"
        }
        else {
            //Need to get user logged in
            fetch(backend_url + `user/${localStorage.getItem("id")}`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((e) => e.json())
            .then((e) => {
                let enrolled = false

                if (e.enrolled_courses) {
                    e.enrolled_courses.map(course => {
                        if (course["name"] === decodeURI(name)) {
                            enrolled = true
                        }
                    })
                }

                //If not enrolled in course then redirect back to mainpage
                if (!enrolled) {
                    window.location.pathname = "/"
                }
                else {
                    setUser(e)
                }
            });


            fetch(backend_url + "topicGroup/" + name, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            })
            .then((e) => e.json())
            .then((e) => setGroup(e));
        }
    }, [name]);

  return (
    <div>
      <Box position="sticky" width="100%" top={0} zIndex={3}>
        <Box position="fixed" left={0}>
          <Sidebar
            links={links}
            user={user}
            groupState={{ object: topicGroup, set: setGroup }}
            nameState={{ name: name, set: setName }}
            isOpen={isOpen}
            setOpen={setOpen}
            variant={variants}
          ></Sidebar>
        </Box>
        <Box position="fixed" right={0}>
          <WidgetsBar page="course" user={user}></WidgetsBar>
        </Box>
      </Box>
      <Flex marginLeft={[0, 0, 200, 200]} marginRight={[0, 0, 0, 200]}>
        <Container
          marginTop={[70, 70, 50]}
          mx={{ base: "0", md: "24px" }}
          maxWidth="100%"
        >
          <Switch>
            {/* Add your page as a Route here */}
            <Route
              exact
              path="/course-page/:code/lectures"
              component={LecturesPage}
            />
            <Route
              exact
              path="/course-page/:code/forums"
              component={ForumOverviewPage}
            />
            <Route
              exact
              path="/course-page/:code/content"
              render={() => <CourseContentPage topicGroup={topicGroup}/>}
            ></Route>
            <Route
              exact
              path="/course-page/:code/forums/:id"
              component={ForumPostPage}
            />
            <Route
              exact
              path="/course-page/:code/announcement/:id"
              component={CourseAnnouncementPage}
            />
            <Route
              exact
              path="/course-page/:code/enrollment"
              component={EnrollmentDashboard}
            />
            <Route path="/course-page/:code" component={CourseDashboard} />
          </Switch>
        </Container>
      </Flex>
    </div>
  );
}

export default CoursePage;
