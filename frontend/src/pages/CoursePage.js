import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.js";
import WidgetsBar from "../components/WidgetsBar.js";
import CourseContentPage from "../pages/CourseContentPage.js";
import CourseDashboard from "../pages/CourseDashboard.js";
import ForumOverviewPage from "../pages/ForumOverviewPage.js";
import ForumPostPage from "../pages/ForumPostPage";
import CourseAnnouncementPage from "../pages/CourseAnnouncementPage";
import { Switch, Route } from "react-router-dom";
import { backend_url } from "../Constants.js";
import { useBreakpointValue, Flex, Container, Box } from "@chakra-ui/react";
import { isLoggedIn } from "../utils/helpers.js";

function CoursePage() {
  //currently hardcoded sidebar content
  // Add the name and url for your page here
  const links = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "Course Outline",
      url: "/course-outline",
    },
    {
      name: "Content",
      url: "/content",
    },
    {
      name: "Forums",
      url: "/forums",
    },
  ];
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
    fetch(backend_url + "topicGroup/" + name)
      .then((e) => e.json())
      .then((e) => setGroup(e));
    //Need to get user logged in
    if (isLoggedIn()) {
      fetch(backend_url + `user/${localStorage.getItem("id")}`)
        .then((e) => e.json())
        .then((e) => setUser(e));
    }
  }, [name]);

  return (
    <div>
      <Box position="sticky" width="100%" top={0} zIndex={100}>
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
              path="/course-page/:code/forums"
              component={ForumOverviewPage}
            />
            <Route
              exact
              path="/course-page/:code/content"
              render={() => <CourseContentPage topicGroup={topicGroup} />}
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
            <Route path="/course-page/:code" component={CourseDashboard} />
          </Switch>
        </Container>
      </Flex>
    </div>
  );
}

export default CoursePage;
