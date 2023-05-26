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
import { FaceSmileIcon } from '@heroicons/react/24/solid';
import EnrolledTopics from '../content/EnrolledTopics';
import CreatedResources from '../content/CreatedResources';

// import Detail from '@/Detail';

const userNavigation = [
  { name: 'Your Profile', href: '/profile' },
  { name: 'Sign out', href: '/welcome' }
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminUserPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [topicsShow, setTopicsShow] = useState(true);
  const [materialShow, setMaterialShow] = useState(false);
  const [conversationShow, setConversationShow] = useState(false);
  const [usersShow, setUsersShow] = useState(false);
  const [adminShow, setAdminShow] = useState(false);
  const [friendsList, setFriendsList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [addAdmin, setAddAdmin] = useState(false);
  const [accessmentShow, setAccessmentShow] = useState(false);
  const [deleteAdmin, setDeleteAdmin] = useState(false);
  const [selectedList, setSelectedUsersList] = useState<number[]>([]);
  const [adminList, setAdminList] = useState<any[]>([]);
  const [nonAdminList, setNonAdminList] = useState<any[]>([]);
  const [detail1, setDetail1] = useState(false);
  const [detail2, setDetail2] = useState(false);
  const navigate = useNavigate();
  const routeChange = (path: To) => {
    //let path = `newPath`;
    navigate(path);
  };

  const updateAdminList = () => {
    AccountService.getAdmins()
      .then((response) => {
        console.log(response.data);
        setAdminList(response.data);
      })
      .catch((error) => {
        console.log('error');
      });
  };

  const updateNonAdminList = () => {
    AccountService.getNonAdmins()
      .then((response) => {
        console.log(response.data);
        setNonAdminList(response.data);
      })
      .catch((error) => {
        console.log('error');
      });
  };

  const updateUserList = () => {
    AccountService.loadUsers()
      .then((response) => {
        // console.log("users got: ")
        console.log(response.data);
        // console.log(response.data.length)

        setUsersList(response.data);
      })
      .catch((error) => {
        console.log('error');
      });
  };

  useEffect(() => {
    const param = { id: localStorage.getItem('user_id') };
    AccountService.getConversations(param)
      .then((response) => {
        setFriendsList(response.data.friends);
      })
      .catch((error) => {
        console.log('error');
      });

    updateUserList();

    // get the current admins
    updateAdminList()

    updateNonAdminList()
    console.log(localStorage.getItem('admin'))
    
  },[])

  const loadConversationList = () => {
    const res = [];
    const len = friendsList?.length;
    // console.log("len: " + len)

    if (len != undefined && friendsList != null) {
      let i = 0;
      while (i < len) {
        // console.log(friendsList[i].username)
        // console.log(i)
        res.push(
          <Link to={`/details/${friendsList[i].conver.conversation_name}`}>
            <div
              className={
                i % 2 == 0
                  ? 'bg-gray-50 h-10 font-sans font-medium hover:bg-gray-100 m-2'
                  : 'bg-white h-10 font-sans font-medium hover:bg-gray-100 m-2'
              }
            >
              <ul>
                <li 
                  className='p-3'
                  key={friendsList[i].id}
                >
                  
                  {friendsList[i].conver.conversation_name.replace(/_/g, " ").replace(localStorage.getItem("user_name"), "")}
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
    let i = 0;
    if (len != undefined && usersList != null) {
      while (i < len) {
        // console.log(usersList[i].username)
        if (usersList[i].username != localStorage.getItem("user_name")) {
          res.push(<Link to={`/users/${usersList[i].id}`}>
            <div className={
                'bg-gray-50 h-10 font-sans font-medium hover:bg-gray-100 m-2'
              }
            >
              <li key={usersList[i].id}>
                  {usersList[i].username}
              </li>
            </div>
            </Link>
          )
        }
        i += 1;
      }
    }
    return res;
  };

  return (
    <div>
      <div className="z-50 md:fixed md:top-16 md:bottom-0 md:flex md:w-64 md:flex-col">
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
                    setAdminShow(false);
                    setConversationShow(false);
                    setUsersShow(false);
                    setMaterialShow(false);
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
                    materialShow
                      ? 'bg-indigo-800 text-white group w-48 flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      : 'text-white hover:bg-indigo-600 w-48 group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  }
                  onClick={() => {
                    setTopicsShow(false);
                    setAdminShow(false);
                    setConversationShow(false);
                    setUsersShow(false);
                    setMaterialShow(true);
                  }}
                >
                  <FolderIcon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                    aria-hidden="true"
                  />
                  Resources
                </div>
              </button>
            </div>

            <div className="flex-1 space-y-1 px-2 pb-4">
              <button>
                <div
                  className={
                    adminShow
                      ? 'bg-indigo-800 text-white group w-48 flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      : 'text-white hover:bg-indigo-600 w-48 group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  }
                  onClick={() => {
                    AccountService.loadUsers()
                      .then((response) => {
                        console.log('users got: ');
                        console.log(response.data);
                        // let i = 0
                        console.log(response.data.length);
                        setUsersList(response.data);
                      })
                      .catch((error) => {
                        console.log('error');
                      });
                    setTopicsShow(false);
                    setAdminShow(true);
                    setConversationShow(false);
                    setUsersShow(false);
                    setMaterialShow(false);
                  }}
                >
                  <CalendarIcon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                    aria-hidden="true"
                  />
                  Admin Management
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
                        setFriendsList(response.data.friends);
                      })
                      .catch((error) => {
                        console.log('error');
                      });
                    setTopicsShow(false);
                    setAdminShow(false);
                    setConversationShow(true);
                    setUsersShow(false);
                    setMaterialShow(false);
                  }}
                >
                  <InboxIcon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                    aria-hidden="true"
                  />
                  Conversations
                </div>
              </button>
            </div>

            {/* <div className="flex-1 space-y-1 px-2 pb-4">
              <Link to="/assessmentOverviewEdit">
                <button>
                  <div
                    className={
                      accessmentShow
                        ? 'bg-indigo-800 text-white group w-48 flex items-center px-2 py-2 text-sm font-medium rounded-md'
                        : 'text-black hover:bg-indigo-600 w-48 group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    }
                  >
                    <FolderIcon
                      className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                      aria-hidden="true"
                    />
                    Assessment
                  </div>
                </button>
              </Link>
            </div> */}

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
                    setAdminShow(false);
                    setConversationShow(false);
                    setUsersShow(true);
                    setMaterialShow(false);
                  }}
                >
                  <UsersIcon
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

        {/* List of resources user has created */}
        <main className={materialShow ? '' : 'hidden'}>
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                Resources
              </h1>
            </div>
            <div className="mx-auto max-w-7x px-4 sm:px-6 md:px-8">
              <div className="py-4">
                <div className="h-96 rounded-lg border-gray-200">
                  <CreatedResources />
                </div>
              </div>
            </div>
          </div>
        </main>

        <main className={adminShow ? '' : 'hidden'}>
          <div className="py-6 bg-green-">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                Admin Management
              </h1>
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {/* Replace with your content */}
              <div className="py-4">
                <div className="rounded-lg border-4 border-dashed border-gray-200">
                  <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div className="border-t border-gray-200">
                      {/* change */}
                      {/* the add section */}
                      <div
                        className={
                          addAdmin ? 'flex flex-col gap-3 m-5' : 'hidden'
                        }
                      >
                        {nonAdminList.map((user) => (
                          <div className="flex flex-row" key={user.id}>
                            <div className={'flex h-6 items-center'}>
                              <input
                                id={user.id}
                                aria-describedby="offers-description"
                                name={user.id}
                                type="checkbox"
                                defaultChecked={false}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                onChange={() => {
                                  if (selectedList.indexOf(user.id) == -1) {
                                    // not selected now
                                    const added_list = selectedList.concat([
                                      user.id
                                    ]);
                                    setSelectedUsersList(added_list);
                                  } else {
                                    const new_list = selectedList.filter(
                                      (userId) => userId != user.id
                                    );
                                    setSelectedUsersList(new_list);
                                  }
                                }}
                              />
                            </div>
                            <div className="ml-3 text-sm leading-6 bg-neutral-100 text-neutral-600 rounded-md border-solid gap-2 p-1">
                              <label
                                htmlFor={user.id}
                                className="font-medium text-gray-900"
                              >
                                {user.username}
                              </label>
                            </div>
                          </div>
                        ))}

                        <div className="flex flex-row-reverse gap-4">
                          <button
                            className="bg-neutral-200 text-indigo-600 h-10 w-10 font-mono text-2xl rounded-md border-solid border-slate-300 hover:bg-neutral-300"
                            onClick={() => {
                              setDeleteAdmin(true);
                              setAddAdmin(false);
                              setSelectedUsersList([]);
                            }}
                          >
                            -
                          </button>
                          <button
                            className="bg-neutral-200 w-64 text-indigo-600 h-10 font-mono rounded-md border-solid border-slate-300 hover:bg-neutral-300"
                            onClick={() => {
                              console.log(selectedList);
                              AccountService.promoteAdmin({
                                ids: selectedList,
                                token: localStorage.getItem('access_token')
                              }).then((response) => {
                                console.log(response);
                                updateAdminList();
                                setAddAdmin(false);
                                updateNonAdminList();
                              });
                              setSelectedUsersList([]);
                            }}
                          >
                            promote them as admin
                          </button>
                        </div>
                      </div>
                      {/* the delete section */}
                      <div
                        className={
                          deleteAdmin ? 'flex flex-col gap-3 m-5' : 'hidden'
                        }
                      >
                        {adminList.map((user) => (
                          <div className="flex flex-row" key={user.id}>
                            <div className={'flex h-6 items-center'}>
                              <input
                                id={user.id}
                                aria-describedby="offers-description"
                                name={user.id}
                                type="checkbox"
                                defaultChecked={false}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                onChange={() => {
                                  if (selectedList.indexOf(user.id) == -1) {
                                    // not selected now
                                    const added_list = selectedList.concat([
                                      user.id
                                    ]);
                                    setSelectedUsersList(added_list);
                                  } else {
                                    const new_list = selectedList.filter(
                                      (userId) => userId != user.id
                                    );
                                    setSelectedUsersList(new_list);
                                  }
                                }}
                              />
                            </div>
                            <div className="ml-3 text-sm leading-6">
                              <label
                                htmlFor={user.id}
                                className="font-medium text-gray-900"
                              >
                                {/* {user.username} */}
                                <div className="flex flex-row bg-neutral-100 ml-3 text-m leading-6 rounded-md border-solid border-slate-300 gap-2 p-1">
                                  <div>{user.username}</div>
                                  <div className="text-neutral-400">
                                    {localStorage.getItem('user_id') != user.id
                                      ? ''
                                      : '(myself)'}
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>
                        ))}
                        <div className="flex flex-row-reverse gap-4">
                          <button
                            className="bg-neutral-200  text-indigo-600 h-10 w-10 font-mono text-2xl rounded-md border-solid border-slate-300 hover:bg-neutral-300"
                            onClick={() => {
                              setAddAdmin(true);
                              setDeleteAdmin(false);
                              setSelectedUsersList([]);
                            }}
                          >
                            +
                          </button>
                          <button
                            className="bg-neutral-200 w-64 text-indigo-600 h-10 font-mono rounded-md border-solid border-slate-300 hover:bg-neutral-300"
                            onClick={() => {
                              console.log(selectedList);
                              AccountService.demoteAdmin({
                                ids: selectedList,
                                token: localStorage.getItem('access_token')
                              }).then((response) => {
                                console.log(response);
                                updateAdminList();
                              });
                              updateUserList();
                              setDeleteAdmin(false);
                              setSelectedUsersList([]);
                              updateNonAdminList();
                            }}
                          >
                            delete them from admin
                          </button>
                        </div>
                      </div>
                      {/* the current list */}
                      <div
                        className={
                          !addAdmin && !deleteAdmin
                            ? 'flex flex-col gap-3 m-5'
                            : 'hidden'
                        }
                      >
                        <div className="flex flex-col m-3">
                          {adminList.map((user) => (
                            <div
                              className="flex flex-row bg-neutral-100 ml-3 text-m leading-6 rounded-md border-solid border-slate-300 gap-2 m-3"
                              key={user.id}
                            >
                              <Link
                                to={`/users/${user.id}`}
                                className="flex flex-row gap-2"
                              >
                                <div>{user.username}</div>
                                <div className="text-neutral-400">
                                  {localStorage.getItem('user_id') != user.id
                                    ? ''
                                    : '(myself)'}
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-row-reverse gap-4">
                          <button
                            className="bg-indigo-200  text-indigo-400 h-10 w-10 font-mono text-2xl rounded-md border-solid border-slate-300 hover:bg-indigo-300"
                            onClick={() => {
                              setDeleteAdmin(true);
                              setSelectedUsersList([]);
                            }}
                          >
                            -
                          </button>
                          <button
                            className="bg-indigo-200  text-indigo-400 h-10 w-10 font-mono text-2xl rounded-md border-solid border-slate-300 hover:bg-indigo-300"
                            onClick={() => {
                              setAddAdmin(true);
                              setSelectedUsersList([]);
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      {/* change ends */}
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
              <h1 className="text-2xl font-semibold text-gray-900">Conversation</h1>
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <div></div>
              <div className="py-4">
                <div className="rounded-lg border-4 border-dashed border-gray-200">
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
                    <div className="border-t border-gray-200">
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
  );
}
