import { PaperClipIcon } from '@heroicons/react/20/solid';

import { Fragment, MouseEventHandler, useState, useEffect } from 'react';
// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  Bars3BottomLeftIcon,
  BellIcon,
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  To
} from 'react-router-dom';
import AccountService from './AccountService';
// import
import { errorMonitor } from 'events';
import {
  convertCompilerOptionsFromJson,
  isConstructorDeclaration
} from 'typescript';
import ConversationPage from './ConversationPage';
import { Form } from 'react-bootstrap';
import CustomProfilePage from './CustomProfilePage';
import axios from 'axios';
import EnrolledTopics from '../content/EnrolledTopics';
import CreatedResources from '../content/CreatedResources';

// import Detail from '@/Detail';

const navigation = [
  { name: 'Topics', href: '#', icon: HomeIcon, current: true },
  { name: 'Deadlines', href: '#', icon: CalendarIcon, current: false },
  { name: 'Results', href: '#', icon: FolderIcon, current: false },
  { name: 'Conversations', href: '#', icon: UsersIcon, current: false },
  { name: 'Metarials', href: '#', icon: ChartBarIcon, current: false }
];
const userNavigation = [
  { name: 'Your Profile', href: '/profile' },
  { name: 'Sign out', href: '/welcome' }
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default function UserPage() {
  const [topicsShow, setTopicsShow] = useState(true);
  const [resultShow, setResultShow] = useState(false);
  const [conversationShow, setConversationShow] = useState(false);
  const [usersShow, setUsersShow] = useState(false);
  const [deadlineShow, setDeadlineShow] = useState(false);
  const [accessmentShow, setAccessmentShow] = useState(false);
  const [conversationList, setConversationList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [deadlineList, setDeadlineList] = useState<any[]>([]);
  const [resultList, setResultList] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const routeChange = (path: To) => {
    //let path = `newPath`;
    navigate(path);
  };

  useEffect(() => {
    const param = { token: localStorage.getItem('access_token') };
    AccountService.findOpenAssessmentByUserToken(param)
      .then((response) => {
        console.log(response.data);
        setDeadlineList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    AccountService.loadTopicMark(param)
      .then((response) => {
        console.log(response.data);
        setResultList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

      
    
  }, []);

  const loadResults = () => {
    const res = [];
    const len = resultList?.length;
    console.log('len: ' + len);
    if (len != undefined && resultList != null) {
      let i = 0;
      while (i < len) {
        res.push(
          <div key={i}>
            <div
              className={
                i % 2 == 0
                  ? 'bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'
                  : 'bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'
              }
            >
              <dt className="text-sm font-medium text-gray-500">
                {resultList[i].topic.topic_name}
              </dt>
              <dt className="text-sm font-medium text-gray-500">
                {resultList[i].mark}
              </dt>
            </div>
          </div>
        );
        i += 1;
      }
    } else {
      res.push(
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">
            you have no finished topic yet
          </dt>
        </div>
      );
    }
    return res;
  };

  const loadDeadlines = () => {
    const res = [];
    const len = deadlineList?.length;
    console.log('len: ' + len);
    if (len != undefined && deadlineList != null) {
      let i = 0;
      while (i < len) {
        res.push(
          <div>
            <div
              className={
                i % 2 == 0
                  ? 'bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'
                  : 'bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'
              }
            >
              <dt className="text-sm font-medium text-gray-500">
                {deadlineList[i].Assessment.assessmentName}
              </dt>
              <dt className="text-sm font-medium text-gray-500">
                {deadlineList[i].topic_name}
              </dt>
              <dd className="mt-1 text-sm text-red-600 sm:col-span-2 sm:mt-0">
                open hours: {deadlineList[i].Assessment.timeRange}
              </dd>
            </div>
          </div>
        );
        i += 1;
      }
    }
    return res;
  };

  const loadConversationList = () => {
    const res = [];
    console.log(conversationList);
    const len = conversationList?.length;
    console.log('len: ' + len);
    if (len != undefined && conversationList != null) {
      let i = 0;
      while (i < len) {
        console.log(conversationList[i].username);
        console.log(i);
        res.push(
          <Link to={`/details/${conversationList[i].conver.conversation_name}`}>
            <div
              className={
                i % 2 == 0
                  ? 'bg-gray-50 h-10 font-sans font-medium hover:bg-gray-100 m-2'
                  : 'bg-white h-10 font-sans font-medium hover:bg-gray-100 m-2'
              }
            >
              <ul>
                <li className="p-3" key={conversationList[i].id}>
                  {conversationList[i].conver.conversation_name.replace(/_/g, " ").replace(localStorage.getItem("user_name"), "")}
                </li>
              </ul>
            </div>
          </Link>
        );
        i += 1;
      }
    }
    return res;
  };

  const loadUsersList = () => {
    const res = [];
    // console.log(usersList)
    const len = usersList?.length;
    // console.log("len: " + len)
    let i = 0; // for index
    if (len != undefined && usersList != null) {
      while (i < len) {
        if (usersList[i].username != localStorage.getItem('user_name')) {
          res.push(
            <div
              className={
                'bg-gray-50 h-10 font-sans font-medium hover:bg-gray-100 m-2'
              }
            >
              <Link to={`/users/${usersList[i].id}`}>
                <li className="p-3" key={usersList[i].id}>
                  {usersList[i].username}
                </li>
              </Link>
            </div>
          );
        }
        i += 1;
      }
    }
    return res;
  };

  return (
    <>
      <div className={localStorage.getItem("access_token") == null ? "flex flex-col gap-4 items-center justify-center h-screen" : "hidden"}>
        <div>
          please login
        </div>
        <Link to="/welcome">
          <div className='border-b border-gray-500'>
            welcome page
          </div>
          
        </Link>
      </div>
      <div className={localStorage.getItem("access_token") == null ? "hidden" : ""}>
      <div className= "z-50 md:fixed md:top-16 md:bottom-0 md:flex md:w-64 md:flex-col">
        {localStorage.getItem("admin") == "true" ? <Navigate to="/adminuser"></Navigate> : ""}
        <div className="flex flex-grow flex-col overflow-y-auto bg-indigo-500 pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=300"
              alt="Your Company"
            />
          </div>

          <div className="mt-5 flex flex-1 flex-col">
            
            


            <div className="flex-1 space-y-1 px-2 pb-4">
              <button>
                <div
                  className={
                    topicsShow
                      ? 'bg-indigo-800 text-white group w-48 flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      : 'text-white hover:bg-indigo-600 w-48 group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  }
                  onClick={() => {
                    setTopicsShow(true);
                    setDeadlineShow(false);
                    setAccessmentShow(false);
                    setConversationShow(false);
                    setResultShow(false);
                    setUsersShow(false);
                  }}
                >
                  <HomeIcon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                    aria-hidden="true"
                  />
                  Topics
                </div>
              </button>
            </div>

            <div className="flex-1 space-y-1 px-2 pb-4">
              <button>
                <div
                  className={
                    deadlineShow
                      ? 'bg-indigo-800 text-white group w-48 flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      : 'text-white hover:bg-indigo-600 w-48 group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  }
                  onClick={() => {
                    setTopicsShow(false);
                    setDeadlineShow(true);
                    setAccessmentShow(false);
                    setConversationShow(false);
                    setResultShow(false);
                    setUsersShow(false);
                  }}
                >
                  <CalendarIcon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                    aria-hidden="true"
                  />
                  Deadlines
                </div>
              </button>
            </div>

            

            <div className="flex-1 space-y-1 px-2 pb-4">
              <button>
                <div
                  className={
                    conversationShow
                      ? 'bg-indigo-800 text-white group w-48 flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      : 'text-white hover:bg-indigo-600 w-48 group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  }
                  onClick={() => {
                    const param = { id: localStorage.getItem('user_id') };

                    AccountService.getConversations(param)
                      .then((response) => {
                        console.log('users got: ');
                        console.log(response.data);
                        localStorage.setItem('friends', response.data);
                        console.log(response.data.length);
                        setConversationList(response.data.friends);
                      })
                      .catch((error) => {
                        console.log('error');
                      });
                    setTopicsShow(false);
                    setDeadlineShow(false);
                    setAccessmentShow(false);
                    setConversationShow(true);
                    setResultShow(false);
                    setUsersShow(false);
                  }}
                >
                  <FolderIcon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                    aria-hidden="true"
                  />
                  Conversations
                </div>
              </button>
            </div>

            <div className="flex-1 space-y-1 px-2 pb-4">
              <button>
                <div
                  className={
                    resultShow
                      ? 'bg-indigo-800 text-white group w-48 flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      : 'text-white hover:bg-indigo-600 w-48 group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  }
                  onClick={() => {
                    setTopicsShow(false);
                    setDeadlineShow(false);
                    setAccessmentShow(false);
                    setConversationShow(false);
                    setResultShow(true);
                    setUsersShow(false);
                  }}
                >
                  <FolderIcon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                    aria-hidden="true"
                  />
                  Results
                </div>
              </button>
            </div>

            <div className="flex-1 space-y-1 px-2 pb-4">
              <button>
                <div
                  className={
                    accessmentShow
                      ? 'bg-indigo-800 text-white group w-48 flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      : 'text-white hover:bg-indigo-600 w-48 group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  }
                  onClick={() => {
                    setTopicsShow(false);
                    setDeadlineShow(false);
                    setAccessmentShow(true);
                    setConversationShow(false);
                    setResultShow(false);
                    setUsersShow(false);
                    routeChange('/assessmentMain/');
                  }}
                >
                  <ChartBarIcon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                    aria-hidden="true"
                  />
                  Assessment
                </div>
              </button>
            </div>

        

            <div className="flex-1 space-y-1 px-2 pb-4">
              <button>
                <div
                  className={
                    usersShow
                      ? 'bg-indigo-800 text-white group w-48 flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      : 'text-white hover:bg-indigo-600 w-48 group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  }
                  onClick={() => {
                    AccountService.loadUsers()
                      .then((response) => {
                        console.log('users got: ');
                        console.log(response.data);
                        let i = 0;
                        console.log(response.data.length);
                        while (i < response.data.length) {
                          console.log(response.data[i]);

                          i += 1;
                        }
                        setUsersList(response.data);
                      })
                      .catch((error) => {
                        console.log('error');
                      });
                    setTopicsShow(false);
                    setDeadlineShow(false);
                    setAccessmentShow(false);
                    setConversationShow(false);
                    setUsersShow(true);
                    setResultShow(false);
                    console.log('here1');
                  }}
                >
                  <ChartBarIcon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                    aria-hidden="true"
                  />
                  Users
                </div>
              </button>
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>

      <div className="absolute w-full top-16 flex flex-col md:pl-64">
        {/* Topics user has enrolled in */}
        <main className={topicsShow ? '' : 'hidden'}>
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Topics</h1>
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <div className="py-4">
                <div className="rounded-lg border-gray-200">
                  <EnrolledTopics />
                  
                </div>
              </div>
            </div>
          </div>
        </main>

        <main className={deadlineShow ? '' : 'hidden'}>
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Deadline</h1>
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {/* Replace with your content */}

              <div className="py-4">
                <div className="rounded-lg border-4 border-dashed border-gray-200">
                  <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div className="border-t border-gray-200">
                      <dl>{loadDeadlines()}</dl>
                    </div>
                  </div>
                </div>
              </div>
              {/* /End replace */}
            </div>
          </div>
        </main>

      

        <main className={conversationShow ? '' : 'hidden'}>
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Conversations</h1>
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <div></div>
              <div className="py-4">
                <div className=" rounded-lg border-4 border-dashed border-gray-200">
                  <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div className="border-t border-gray-200">
                      {loadConversationList()}
                    </div>
                  </div>
                </div>
              </div>
              {/* /End replace */}
            </div>
          </div>
        </main>

        <main className={accessmentShow ? '' : 'hidden'}>
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                Accessment
              </h1>
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {/* Replace with your content */}
              <div className="py-4">
                <div className="h-96 rounded-lg border-4 border-dashed border-gray-200" />
              </div>
              {/* /End replace */}
            </div>
          </div>
        </main>

        <main className={resultShow ? '' : 'hidden'}>
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Results</h1>
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {/* Replace with your content */}
              <div className="py-4">
                <div className=" rounded-lg border-4 border-dashed border-gray-200 ">
                  <div>
                    <div
                      className={
                        'bg-indigo-200 text-xl text_black font-bold px-5 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'
                      }
                    >
                      <dt className="text-sm font-large text-black">
                        Topic Name
                      </dt>
                      <dt className="text-sm font-large text-black">
                        Overall Mark
                      </dt>
                    </div>
                  </div>
                  {loadResults()}
                </div>
              </div>
              {/* /End replace */}
            </div>
          </div>
        </main>

        <main className={usersShow ? '' : 'hidden'}>
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <div></div>
              <div className="py-4">
                <div className="rounded-lg border-4 border-dashed border-gray-200">
                  <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div className="border-t border-gray-200 flex flex-col gap-2">
                      {loadUsersList()}
                    </div>
                  </div>
                </div>
              </div>
              {/* /End replace */}
            </div>
          </div>
        </main>
      </div>
      </div>
    </>
  );
}
