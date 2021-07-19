import React from "react"
import './App.css';
import CoursePage from "./pages/CoursePage";
import { ChakraProvider } from "@chakra-ui/react"
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom"
import TopicTree from "./components/topictree/TopicTree.js"
import LoginForm from "./components/login/LoginForm";
import CourseInvite from "./components/enrollment/JoinCourse";

function App() {
    return (
        <ChakraProvider>
            <Router>
                <Switch>
                    <Route exact path="/topictree"><TopicTree /></Route>
                    <Route exact path="/login"><LoginForm /></Route>
                    <Route path="/invite/:code?"><CourseInvite/></Route>
                    <Route path="/" ><CoursePage /></Route>
                </Switch>
            </Router>
        </ChakraProvider>
    );
}

export default App;
