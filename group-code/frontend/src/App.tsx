import React from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      Homepage
      <li>
        <Link to="/welcome">Welcome Page</Link>
      </li>
      <li>
        <Link to="/profile">Profile</Link>
      </li>
      <li>
        <Link to="/test-forum">Forum Test</Link>
      </li>
      <li>
        <Link to="/assessmentMain">AssessmentMain</Link>
      </li>
      {/* <li>
        <Link to="/timer">PomodoroTimer</Link>
      </li> */}
      <li>
        <Link to="/topictree">Topic Tree</Link>
      </li>
    </div>
  );
}

export default App;
