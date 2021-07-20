import React from "react"
import './App.css';
import CoursePage from "./pages/CoursePage";
import MainPage from "./pages/MainPage";
import { ChakraProvider } from "@chakra-ui/react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom"
import TopicTree from "./components/topictree/TopicTree.js"

function App() {
    return (
        <ChakraProvider>
            <Router>
                <Switch>
                    <Route exact path="/topictree"><TopicTree /></Route>
                    <Route path="/course-page/:code" ><CoursePage /></Route>
                    <Route path="/"><MainPage/></Route>
                </Switch>
            </Router>
        </ChakraProvider>
    );
}

export default App;
