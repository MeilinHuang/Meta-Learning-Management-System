import React from "react"
import './App.css';
import CoursePage from "./pages/CoursePage";
import { ChakraProvider } from "@chakra-ui/react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom"
import TopicTree from "./components/topictree/TopicTree.js"
import Assessments from "./pages/Assessments.js"

function App() {
    return (
        <ChakraProvider>
            <Router>
                <Switch>
                    <Route exact path="/topictree"><TopicTree /></Route>
                    <Route exact path="/assessments"><Assessments /></Route>
                    <Route path="/" ><CoursePage /></Route>
                </Switch>
            </Router>
        </ChakraProvider>
    );
}

export default App;
