import React from "react"
import './App.css';
import CoursePage from "./pages/CoursePage";
import { ChakraProvider } from "@chakra-ui/react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom"
import TopicTree from "./components/topictree/TopicTree.js"
import TopicGroupList from "./components/topictree/TopicGroupList.js";

function App() {
    return (
        <ChakraProvider>
            <Router>
                <Switch>
                    <Route exact path="/topictree"><TopicGroupList /></Route>
                    <Route exact path="/topictree/:topicGroup" component={TopicTree} />
                    <Route path="/" ><CoursePage /></Route>
                </Switch>
            </Router>
        </ChakraProvider>
    );
}

export default App;
