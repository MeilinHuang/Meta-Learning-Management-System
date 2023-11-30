import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import store from './features/store.js';
import { Provider } from 'react-redux';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
// screens
import WelcomePage from 'account/welcomePage';
import LoginPage from 'account/loginPage';
import SignupPage from 'account/signupPage';
import ChangePassword from 'account/changePassword';
import UserPage from 'account/userPage';
import AdminUserPage from 'account/adminUserPage';
import ProfilePage from 'account/profilePage';
import ConversationPage from 'account/ConversationPage';
import CustomProfilePage from 'account/CustomProfilePage';
import VEmail from 'account/vEmail';
import RecoverPass from 'account/recoverPass';
import TopicPage from 'content/TopicPage';
import Forum from 'forum/Forum';
import AssessmentMain from 'assessment/assessmentMain';
import AssessmentDetail from 'assessment/assessmentDetail';
import TopicTree from 'topictree/TopicTree';
import AssessmentAttempt from 'assessment/assessmentAttempt';
import AssessmentSubmit from 'assessment/assessmentSubmit';
import AssessmentOverviewEdit from 'assessment/assessmentOverviewEdit';
import AssessmentDetailEdit from 'assessment/assessmentDetailEdit';
import AssessmentAttempsTestOverview from 'assessment/assessmentAttemptsTestOverview';
import AssessmentTestMark from 'assessment/assessmentTestMark';
import AssessmentAssignmentMark from 'assessment/assessmentAssignmentMark';
import AssessmentAttemptsList from 'assessment/assessmentAttemptsList';
import AssessmentAttemptDetail from 'assessment/assessmentAttemptDetail';
import AssessmentAssignmentAttemptDetail from 'assessment/assessmentAssignmentAttemptDetail';
import AssessmentEditTestDetail from 'assessment/assessmentEditTestDetail';
import AssessmentAssignmentEditDetail from 'assessment/assessmentAssignmentEditDetail';
import { Layout, LayoutNoPadding } from 'common/Layout';

import RoleEditor from 'account/RoleEditor';
import { SidebarProvider } from 'content/SidebarContext';
import { BreadcrumbProvider } from 'content/BreadCrumbContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    {/* Sidebar Provider */}
    <SidebarProvider>
      {/* Breadcrumb Provider */}
      <BreadcrumbProvider>
        <BrowserRouter>
          <Routes>
            {/* Routes without navbar */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<SignupPage />} />
            <Route path="pwchang" element={<ChangePassword />} />
            <Route path="vEmail" element={<VEmail />} />
            <Route path="welcome" element={<WelcomePage />} />
            <Route path="recoverPass" element={<RecoverPass />} />
            {/* Routes with navbar layout */}
            <Route element={<LayoutNoPadding />}>
              <Route path="test-forum" element={<Forum />} />
              <Route path="forum/:topicId" element={<Forum />} />
              <Route path="forum/:topicId/:sectionId" element={<Forum />} />
              <Route path="topic/:topicId/:section" element={<TopicPage />} />
              <Route
                path="topic/:topicId/:section/:resourceId"
                element={<TopicPage />}
              />
              <Route path="user" element={<UserPage />} />
              <Route path="adminuser" element={<AdminUserPage />} />
            </Route>

            <Route element={<Layout />}>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="assessmentMain" element={<AssessmentMain />} />
              <Route
                path="assessmentOverviewEdit"
                element={<AssessmentOverviewEdit />}
              />
              <Route path="roleEditor" element={<RoleEditor topicId={1} />} />
              <Route path="/details/:id" element={<ConversationPage />} />
              <Route path="/users/:id" element={<CustomProfilePage />} />
              <Route
                path="assessmentDetailEdit/:topicName/:topicId"
                element={<AssessmentDetailEdit />}
              />
              <Route
                path="assessmentAttempsTestOverview/:topicName/:topicId/:assessmentName/:assessmentId/:type"
                element={<AssessmentAttempsTestOverview />}
              />
              <Route
                path="assessmentAttemptsList/:enrollId/:topicName/:topicId/:assessmentName/:assessmentId/:type"
                element={<AssessmentAttemptsList />}
              />
              <Route
                path="assessmentAttemptDetail/:enrollId/:topicName/:topicId/:assessmentName/:assessmentId/:type/:assessmentAttemptID"
                element={<AssessmentAttemptDetail />}
              />
              {/* AssessmentAssignmentAttemptDetail */}
              <Route
                path="assessmentAssignmentAttemptDetail/:enrollId/:topicName/:topicId/:assessmentName/:assessmentId/:type/:assessmentAttemptID"
                element={<AssessmentAssignmentAttemptDetail />}
              />
              <Route
                path="assessmentDetail/:enrollId/:topicName/:topicId"
                element={<AssessmentDetail />}
              />
              <Route
                path="AssessmentAttempt/:enrollId/:topicName/:topicId/:assessmentName/:assessmentId"
                element={<AssessmentAttempt />}
              />
              <Route
                path="AssessmentTestMark/:topicName/:topicId/:assessmentName/:assessmentId/:assessmentAttemptID"
                element={<AssessmentTestMark />}
              />
              <Route
                path="assessmentEditTestDetail/:topicName/:topicId/:assessmentName/:assessmentId"
                element={<AssessmentEditTestDetail />}
              />
              <Route
                path="assessmentAssignmentEditDetail/:topicName/:topicId/:assessmentName/:assessmentId"
                element={<AssessmentAssignmentEditDetail />}
              />
              <Route
                path="AssessmentAssignmentMark/:topicName/:topicId/:assessmentName/:assessmentId/:assessmentAttemptID"
                element={<AssessmentAssignmentMark />}
              />
              <Route
                path="AssessmentSubmit/:enrollId/:topicName/:topicId/:assessmentName/:assessmentId"
                element={<AssessmentSubmit />}
              />
              <Route path="topictree" element={<TopicTree />} />
              <Route path="account/conversation" element={<ConversationPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BreadcrumbProvider>
    </SidebarProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
