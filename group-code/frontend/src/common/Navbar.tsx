import { Fragment, useEffect, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import defaultImg from '../default.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation, useIsSuperuserQuery } from 'features/api/apiSlice';
import AccountService from 'account/AccountService';
import msgIcon from '../Icons/newMsgF.png';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const navigate = useNavigate();
  const [path, setPath] = useState('');
  const [logout] = useLogoutMutation();
  const [isSuperuser, setIsSuperUser] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [lastMsgLink, setLastMsgLink] = useState('');

  const getProfilePic = () => {
    const dp = localStorage.getItem('profilePic');
    if (dp != '' && dp != null) {
      return dp;
    }
    return defaultImg;
  };

  useEffect(() => {
    AccountService.notifications().then((response) => {
      setNotifications(response.data.notifications);
      console.log(response.data.notifications);
    });
    console.log(notifications);
  }, []);

  useEffect(() => {
    console.log(notifications);
    if (notifications.length > 0) {
      setLastMsgLink('/details/' + notifications[0]['conversation_name']);
    }
    console.log(lastMsgLink);
  }, [notifications]);

  useEffect(() => {
    setPath(window.location.pathname);
  }, [window.location.pathname]);

  const { data: superuserData, error: superuserError } =
    useIsSuperuserQuery(null);

  useEffect(() => {
    if (superuserData && superuserData['is_superuser']) {
      setIsSuperUser(true);
    }
  }, [superuserData]);

  return (
    <Disclosure as="nav" className="bg-white shadow fixed w-full z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="block h-8 w-auto lg:hidden"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="MetaLMS"
                  />
                  <img
                    className="hidden h-8 w-auto lg:block"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="MetaLMS"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  <Link
                    className={
                      path === '/user' || path === '/adminuser'
                        ? 'inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900'
                        : 'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }
                    to={isSuperuser ? '/adminuser' : '/user'}
                  >
                    Home
                  </Link>
                  <Link
                    className={
                      path === '/topictree'
                        ? 'inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900'
                        : 'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }
                    to="/topictree"
                  >
                    Topic Tree
                  </Link>
                  <Link
                    className={
                      path === '/assessmentMain'
                        ? 'inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900'
                        : 'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }
                    to="/assessmentMain"
                  >
                    Assessments
                  </Link>
                  <Link
                    className={
                      path === '/assessmentOverviewEdit'
                        ? 'inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900'
                        : 'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }
                    to="/assessmentOverviewEdit"
                  >
                    AssessmentsEdit
                  </Link>
                  {/* <Link
                    className={
                      path === '/account/conversation'
                        ? 'inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900'
                        : 'inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }
                    to="/account/conversation"
                  >
                    Chat
                  </Link> */}
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Link to={lastMsgLink}>
                  <img
                    className={
                      notifications.length != 0
                        ? 'h-8 w-8'
                        : 'hidden overflow-hidden bg-white shadow sm:rounded-lg'
                    }
                    src={msgIcon}
                  ></img>
                </Link>
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={getProfilePic()}
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                            onClick={() => navigate('/profile')}
                          >
                            Profile
                          </a>
                        )}
                      </Menu.Item>
                      {/* <Link to="/welcome"
                      > */}
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                            onClick={() => {
                              AccountService.logout({
                                access_token:
                                  localStorage.getItem('access_token')
                              })
                                .then((response) => {
                                  console.log(response);
                                })
                                .catch((error) => {
                                  console.log(error);
                                });

                              localStorage.clear();
                              logout(null);
                              navigate('/welcome');
                              location.reload();
                            }}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                      {/* </Link> */}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-4 pt-2">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              <Disclosure.Button
                as="a"
                href="#"
                className={
                  path === '/user' || path === '/adminuser'
                    ? 'block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700'
                    : 'block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                }
              >
                <Link to="/user">Home</Link>
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className={
                  path === '/topictree'
                    ? 'block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700'
                    : 'block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                }
              >
                <Link to="/topictree">Topic Tree</Link>
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className={
                  path === '/test-forum'
                    ? 'block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700'
                    : 'block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                }
              >
                <Link to="/test-forum">Forum</Link>
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className={
                  path === '/assessmentMain'
                    ? 'block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700'
                    : 'block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                }
              >
                <Link to="/assessmentMain">Assessments</Link>
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className={
                  path === '/assessmentOverviewEdit'
                    ? 'block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700'
                    : 'block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                }
              >
                <Link to="/assessmentOverviewEdit">AssessmentsEdit</Link>
              </Disclosure.Button>
              {/* <Disclosure.Button
                as="a"
                href="#"
                className={
                  path === '/account/conversation'
                    ? 'block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700'
                    : 'block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                }
              >
                <Link to="/account/conversation">Conversations</Link>
              </Disclosure.Button> */}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
