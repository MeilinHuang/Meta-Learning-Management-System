import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import { TopicGraph } from './features/topicGraph/TopicGraph';
import { SearchBar } from './features/searchBar/SearchBar';
import { NavBar } from './features/navBar/NavBar';

import { NetworkGraph } from './features/network/Network';
import './App.css';

import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';
import { updateData, updateNetworkData } from './features/network/networkSlice';

// old
var d = {
  'nodes': [
    {
      'id': 1,
      'title': "Pointers",
      'prerequisites': ["Variables", "Structs"],
      'description': "Lorem Ipsum",
      'preparation': {
        'attachments': ["prereading.pdf"]
      },
      'content': {
        'attachments': ["slides.pdf", "lecture.mp4"]
      },
      'practice': {
        'attachments': ["exercise_set.pdf"]
      },
      'assessment': {
        'attachments': ["quiz.pdf"]
      },
      'group': 'C Programming'
    },
    {
      'id': 2,
      'title': "Struct",
      'prerequisites': ["Variables"],
      'description': "Lorem Ipsum",
      'preparation': {
        'attachments': ["prereading.pdf"]
      },
      'content': {
        'attachments': ["slides.pdf", "lecture.mp4"]
      },
      'practice': {
        'attachments': ["exercise_set.pdf"]
      },
      'assessment': {
        'attachments': ["quiz.pdf"]
      }, 'group': 'C Programming'
    },
    {
      'id': 3,
      'title': "Memory Allocation",
      'prerequisites': ["Pointers"],
      'description': "Lorem Ipsum",
      'preparation': {
        'attachments': ["prereading.pdf"]
      },
      'content': {
        'attachments': ["slides.pdf", "lecture.mp4"]
      },
      'practice': {
        'attachments': ["exercise_set.pdf"]
      },
      'assessment': {
        'attachments': ["quiz.pdf"]
      }, 'group': 'C Programming'
    },
    {
      'id': 4,
      'title': "Variables",
      'prerequisites': ["Variables", "Structs"],
      'description': "Lorem Ipsum",
      'preparation': {
        'attachments': ["prereading.pdf"]
      },
      'content': {
        'attachments': ["slides.pdf", "lecture.mp4"]
      },
      'practice': {
        'attachments': ["exercise_set.pdf"]
      },
      'assessment': {
        'attachments': ["quiz.pdf"]
      }, 'group': 'C Programming'
    },
    {
      'id': 5,
      'title': "Linked List",
      'prerequisites': ["Pointers", "Structs"],
      'description': "Lorem Ipsum",
      'preparation': {
        'attachments': ["prereading.pdf"]
      },
      'content': {
        'attachments': ["slides.pdf", "lecture.mp4"]
      },
      'practice': {
        'attachments': ["exercise_set.pdf"]
      },
      'assessment': {
        'attachments': ["quiz.pdf"]
      }, 'group': 'C Programming'
    },
    {
      'id': 6,
      'title': "Doubly Linked List",
      'prerequisites': ["Linked List"],
      'description': "Lorem Ipsum",
      'preparation': {
        'attachments': ["prereading.pdf"]
      },
      'content': {
        'attachments': ["slides.pdf", "lecture.mp4"]
      },
      'practice': {
        'attachments': ["exercise_set.pdf"]
      },
      'assessment': {
        'attachments': ["quiz.pdf"]
      }, 'group': 'Data Structures and Algorithms'
    }
  ],
  'links': [
    { 'source': "4", 'target': "2" },
    { 'source': "4", 'target': "1" },
    { 'source': "2", 'target': "1" },
    { 'source': "1", 'target': "3" },
    { 'source': "1", 'target': "5" },
    { 'source': "2", 'target': "5" },
    { 'source': "3", 'target': "5" },
    { 'source': "5", 'target': "6" }
  ]
}

// https://stackoverflow.com/questions/38892672/react-why-child-component-doesnt-update-when-prop-changes
function App() {
  const dispatch = useDispatch();

  let num = 50;
  return (
    <>
      {/* <Button variant="contained" color="primary" onClick={() => {
        // console.log('clicked');
        // num = Math.random() * (100 - 20) + 20;
        // console.log('num: ', num)
        // dispatch(updateData(num))
        dispatch(updateNetworkData(d))

      }}>
        Primary
      </Button>
      <NetworkGraph /> */}


      {/* <NetworkGraph data={500} /> */}
      {/* <div id="network"></div> */}
      <NavBar />
      <TopicGraph />
    </>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <Counter />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <span>
    //       <span>Learn </span>
    //       <a
    //         className="App-link"
    //         href="https://reactjs.org/"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         React
    //       </a>
    //       <span>, </span>
    //       <a
    //         className="App-link"
    //         href="https://redux.js.org/"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Redux
    //       </a>
    //       <span>, </span>
    //       <a
    //         className="App-link"
    //         href="https://redux-toolkit.js.org/"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Redux Toolkit
    //       </a>
    //       ,<span> and </span>
    //       <a
    //         className="App-link"
    //         href="https://react-redux.js.org/"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         React Redux
    //       </a>
    //     </span>
    //   </header>
    // </div>
  );
}

export default App;
