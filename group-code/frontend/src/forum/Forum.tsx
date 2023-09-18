import { Fragment, useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { BATCH_SIZE, LIMIT } from './constants';
import {
  Bars3Icon,
  CalendarIcon,
  HomeIcon,
  MagnifyingGlassCircleIcon,
  MapIcon,
  MegaphoneIcon,
  UserGroupIcon,
  XMarkIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';

import { useGetForumQuery } from 'features/api/apiSlice';
import ThreadList from './ThreadList';
import ThreadViewer from './ThreadViewer';
import PostCreator from './PostCreator';
import { Thread } from './forum.types';
import { PlusIcon } from '@heroicons/react/20/solid';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Forum() {
  const navigate = useNavigate();
  const { topicId, sectionId } = useParams();
  const topic = topicId ? Number(topicId) : 1;
  const section = sectionId ? Number(sectionId) : 0;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [switchOrder, setSwitchOrder] = useState(false);

  const [showPostCreator, setShowPostCreator] = useState(false);

  const [selectedSection, setSelectedSection] = useState(section);

  // since RTK queries make api as hook to use, api cannot passed into callback
  // Therefore, states of parameters must be set, such to call api using setState methods (once states updates, Quries are called again)
  // This is due to the very bad design of previous contributor. RTK queries MUST BE USED WITH REDUX!!!!!!!!!!
  const [currentBatch, setCurrentBatch] = useState(0);
  const [lastResultParams, setLastResultParams] = useState({
    offset: currentBatch * BATCH_SIZE - 20,
    limit: LIMIT,
    sectionId: selectedSection
  });
  const [currentResultParams, setCurrentResultParams] = useState({
    offset: currentBatch * BATCH_SIZE,
    limit: LIMIT,
    sectionId: selectedSection
  });
  const [nextResultParams, setNextResultParams] = useState({
    offset: currentBatch * BATCH_SIZE + 20,
    limit: LIMIT,
    sectionId: selectedSection
  });
  
  // useEffect to initialise the parameter states.
  useEffect(() => {
    setLastResultParams({
      offset: currentBatch * BATCH_SIZE - 20,
      limit: LIMIT,
      sectionId: selectedSection
    });
    setCurrentResultParams({
      offset: currentBatch * BATCH_SIZE,
      limit: LIMIT,
      sectionId: selectedSection
    });
    setNextResultParams({
      offset: currentBatch * BATCH_SIZE + 20,
      limit: LIMIT,
      sectionId: selectedSection
    });
  }, [selectedSection]);

  // Reload properties for getting the updated Thread after posting
  const reloadProps = {
    currentBatch,
    selectedSection,
    setLastResultParams,
    setCurrentResultParams,
    setNextResultParams
  };

  const [selectedThread, setSelectedThread] = useState<Thread>({
    id: -1,
    author: {
      name: 'Please select a thread',
      username: 'Please select a thread',
      id: -1
    },
    section_id: -1,
    title: 'Please select a thread',
    time: new Date(),
    content: 'Please select a thread',
    upvotes: -1,
    posts: [],
    stickied: false,
    reported: false
  });

  const {
    data: forum,
    isLoading: forumIsLoading,
    isSuccess: forumIsSuccess,
    isError: forumIsError,
    error: forumError
  } = useGetForumQuery(topic);

  useEffect(() => {
    if (forum) {
      if (section === 0) {
        setSelectedSection(forum.sections[0].id);
      }
    }
  }, [forum]);

  let sidebarContent;
  if (forumIsLoading) {
    sidebarContent = (
      <div role="status">
        <svg
          aria-hidden="true"
          className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  } else if (forumIsSuccess) {
    sidebarContent = forum.sections.map((item: any) => (
      // eslint-disable-next-line
      <a
        key={item.title}
        href="#"
        className={classNames(
          item.id === selectedSection
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
          'group flex items-center px-2 py-2 text-base font-medium rounded-md'
        )}
        onClick={() => {
          setSelectedSection(item.id);
          navigate(`/forum/${topic}/${item.id}`);
        }}
      >
        {item.title}
      </a>
    ));
  } else if (forumIsError) {
    let errorMessage = undefined;
    if ('status' in forumError) {
      errorMessage =
        'error' in forumError
          ? forumError.error
          : JSON.stringify(forumError.data);
    } else {
      errorMessage = forumError.message;
    }
    sidebarContent = <div>{errorMessage}</div>;
  }

  const selectedThreadCallback = (thread: Thread) => {
    setSwitchOrder(true);
    setSelectedThread(thread);
    setShowPostCreator(false);
  }

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full overflow-hidden">
        ```
      */}
      <div className="flex pt-16">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white focus:outline-none">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 mt-16 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-0 flex-1 overflow-y-auto pb-4 pt-20">
                    <div className="flex flex-shrink-0 items-center px-4">
                      <ArrowUturnLeftIcon
                        title="Back to topic"
                        className="h-6 w-6 hover:cursor-pointer text-indigo-600"
                        onClick={() => {
                          navigate(`/topic/${topicId}/preparation`);
                        }}
                      />
                      <button
                        type="button"
                        className="ml-5 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => {
                          setShowPostCreator(!showPostCreator);
                        }}
                      >
                        Create Post
                      </button>
                    </div>
                    <nav aria-label="Sidebar" className="mt-5">
                      <div className="space-y-1 px-2">{sidebarContent}</div>
                    </nav>
                  </div>
                  <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                    <a href="#" className="group block flex-shrink-0">
                      <div className="flex items-center">
                        <div>
                          <img
                            className="inline-block h-10 w-10 rounded-full"
                            src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
                            alt=""
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                            Whitney Francis
                          </p>
                          <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                            View profile
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex w-64 flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-gray-100">
              <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                <div className="flex flex-shrink-0 items-center px-4">
                  <ArrowUturnLeftIcon
                    title="Back to topic"
                    className="h-6 w-6 hover:cursor-pointer text-indigo-600"
                    onClick={() => {
                      navigate(`/topic/${topicId}/preparation`);
                    }}
                  />
                  <button
                    type="button"
                    className="ml-5 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => {
                      setShowPostCreator(!showPostCreator);
                    }}
                  >
                    <PlusIcon
                      className="-ml-0.5 mr-1.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    New Thread
                  </button>
                </div>
                <nav className="mt-5 flex-1" aria-label="Sidebar">
                  <div className="space-y-1 px-2">{sidebarContent}</div>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="lg:hidden">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-1.5">
              <div>
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt="Your Company"
                />
              </div>
              <div>
                <button
                  type="button"
                  className="-mr-3 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          <div className="h-[calc(100vh-64px)] flex flex-col">
            {switchOrder ? (
              <div className="z-0 flex flex-row h-full">
                <main
                  className="relative z-0 w-full flex-none md:flex-1"
                  key={1}
                >
                  {/* Start main area*/}
                  {showPostCreator ? (
                    <PostCreator
                      closeCallback={() => {
                        setShowPostCreator(false);
                      }}
                      sectionId={selectedSection}
                    ></PostCreator>
                  ) : (
                    <ThreadViewer
                      thread={selectedThread}
                      createNewThreadCallback={() => {
                        setShowPostCreator(true);
                      }}
                      topicId={topic}
                      reloadProps={reloadProps}
                      selectedThreadCallback={selectedThreadCallback}
                    ></ThreadViewer>
                  )}
                  {/* End main area */}
                </main>
                <aside
                  className="relative border-2 border-r border-gray-200 md:order-first w-full md:w-96 flex-none"
                  key={2}
                >
                  {/* Start secondary column (hidden on smaller screens) */}
                  <ThreadList
                    sectionId={selectedSection}
                    selectThreadCallback={selectedThreadCallback}
                    currentBatch={currentBatch}
                    setCurrentBatch={setCurrentBatch}
                    lastResultParams={lastResultParams}
                    currentResultParams={currentResultParams}
                    nextResultParams={nextResultParams}
                  />
                  {/* End secondary column */}
                </aside>
              </div>
            ) : (
              <div className="z-0 flex flex-row h-full">
                <aside
                  className="relative border-2 border-r border-gray-200 md:order-first w-full md:w-96 flex-none"
                  key={2}
                >
                  {/* Start secondary column (hidden on smaller screens) */}
                  <ThreadList
                    sectionId={selectedSection}
                    selectThreadCallback={selectedThreadCallback}
                    currentBatch={currentBatch}
                    setCurrentBatch={setCurrentBatch}
                    lastResultParams={lastResultParams}
                    currentResultParams={currentResultParams}
                    nextResultParams={nextResultParams}
                  />
                  {/* End secondary column */}
                </aside>
                <main
                  className="relative z-0 w-full flex-none md:flex-1"
                  key={1}
                >
                  {/* Start main area*/}
                  {showPostCreator ? (
                    <PostCreator
                      closeCallback={() => {
                        setShowPostCreator(false);
                      }}
                      sectionId={selectedSection}
                    ></PostCreator>
                  ) : (
                    <ThreadViewer
                      thread={selectedThread}
                      createNewThreadCallback={() => {
                        setShowPostCreator(true);
                      }}
                      topicId={topic}
                      reloadProps={reloadProps}
                      selectedThreadCallback={selectedThreadCallback}
                    ></ThreadViewer>
                  )}
                  {/* End main area */}
                </main>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
