import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Sidebar from "../components/Sidebar.js";
import WidgetsBar from "../components/widgets/WidgetsBar.js";
import { Switch, Route } from "react-router-dom";
import MainSelection from "./MainSelection.js";
import { useBreakpointValue, Flex, Container, Box } from "@chakra-ui/react";
import { backend_url } from "../Constants.js";
import { isLoggedIn, isStaff } from "../utils/helpers.js";
import CourseInvite from "../components/enrollment/JoinCourse";
import AccountSettings from "../components/enrollment/accountSettings.js";

function MainPage() {
  const history = useHistory();
  const [links, setLinks] = useState([
    {
      name: "Home",
      url: "/",
    },
    {
      name: "Gamification",
      url: "/gamification",
    },
    {
      name: 'Assessments',
      url: '/assessments',
    },
    {
      name: 'Topic Tree',
      url: "/topictree",
    },
  ]);
  const smVariant = "drawer";
  const mdVariant = "sidebar";
  const variants = useBreakpointValue({ base: smVariant, md: mdVariant });
  const [isOpen, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    //Need to get user logged in
    if (isLoggedIn()) {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/JSON",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };
      fetch(backend_url + `user/${localStorage.getItem("id")}`, options)
        .then((e) => e.json())
        .then((e) => {
          if (e === {} || e === null || e.error) {
            // history.push("/login");
          } else {
            setUser(e);
          }
        });
    } else {
      // history.push("/login");
    }
  }, []);

  return (
    <div>
      <Box position="sticky" width="100%" top={0} zIndex={5}>
        <Box position="fixed" left={0}>
          <Sidebar
            links={links}
            groupState={{ object: null, set: null }}
            isOpen={isOpen}
            setOpen={setOpen}
            variant={variants}
            user={user}
          ></Sidebar>
        </Box>
        <Box position="fixed" right={0}>
          <WidgetsBar page="main" user={user}></WidgetsBar>
        </Box>
      </Box>
      <Flex marginLeft={[0, 0, 250, 250]} marginRight={[0, 0, 0, 250]}>
        <Container
          marginTop={50}
          mx={{ base: "0", md: "24px" }}
          maxWidth="100%"
        >
          <Switch>
            {/* Add your page as a Route here */}
            <Route path="/invite/:code?">
              <CourseInvite />
            </Route>
            <Route path="/account">
              <AccountSettings user={user} />
            </Route>
            <Route path="/">
              <MainSelection user={user} />
            </Route>
          </Switch>
        </Container>
      </Flex>
    </div>
  );
}

export default MainPage;
