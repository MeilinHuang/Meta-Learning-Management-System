import React from "react";
import "./App.css";
import CoursePage from "./pages/CoursePage";
import MainPage from "./pages/MainPage";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import TopicTree from "./components/topictree/TopicTree.js";
import LoginForm from "./components/login/LoginForm";
import TopicTreeList from "./components/topictree/TopicTreeList.js";
import Assessments from "./pages/Assessments.js"
import EditQuiz from "./components/edit-quiz/EditQuiz.js"
import QuizUsage from "./components/quiz-usage/QuizUsage.js"
import QuizViewSubmission from "./components/quiz-view-submission/QuizViewSubmission.js"

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Switch>
          <Route exact path="/topictree">
            <TopicTree />
          </Route>
          <Route exact path="/login">
            <LoginForm />
          </Route>
          <Route exact path="/topictreelist">
            <TopicTreeList />
          </Route>
          <Route path="/course-page/:code">
            <CoursePage />
          </Route>
          <Route exact path="/assessments">
            <Assessments />
          </Route>
          <Route exact path="/assessments/quiz/edit/:quizName">
            <EditQuiz />
          </Route>
          <Route exact path="/assessments/quiz/:quizId/submission">
            <QuizUsage />
          </Route>
          <Route exact path="/assessments/quiz/view-submission">
            <QuizViewSubmission />
          </Route>
          <Route path="/">
            <MainPage />
          </Route>
        </Switch>
      </Router>
    </ChakraProvider>
  );
}

export default App;
