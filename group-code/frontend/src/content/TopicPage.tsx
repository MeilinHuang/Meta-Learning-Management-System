import { Fragment, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  Bars3BottomLeftIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
  BookOpenIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';

import { capitalise } from './contentHelpers';
import TopicToolbar from './TopicToolbar';
import ResourcesList from './ResourcesList';
import CreateResourceModal from './CreateResourceModal';
import OverviewBar from './OverviewBar';
import { ErrorAlert } from '../common/Alert';
import ResourcePage from './ResourcePage';
import TopicSettings from './TopicSettings';

import {
  useGetTopicInfoQuery,
  useIsSuperuserQuery,
  useGetIsEnrolledInTopicQuery,
  useGetTopicPermissionQuery
} from 'features/api/apiSlice';
import EditResourceModal from './EditResourceModal';
import DeleteResourceModal from './DeleteResourceModal';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function TopicPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createResModal, setCreateResModal] = useState(false);
  const [editResModal, setEditResModal] = useState(false);
  const [deleteResModal, setDeleteResModal] = useState(false);
  const [selectedRes, setSelectedRes] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const navigate = useNavigate();

  const topicId = useParams()['topicId'];
  const currSection = useParams()['section'];
  const resourceId = useParams()['resourceId'];

  const [isSuperuser, setIsSuperUser] = useState(false);
  const [canEditRoles, setCanEditRoles] = useState(false);
  const [rearrange, setRearrange] = useState(false);

  const { data: superuserData, error: superuserError } =
    useIsSuperuserQuery(null);

  const { data: editRolesData, error: editRolesError } =
    useGetTopicPermissionQuery({
      topic_id: Number(topicId),
      permission: 'can_edit_topic_roles'
    });

  const {
    data: enrolledData,
    isLoading: isEnrolledLoading,
    error: enrolledError
  } = useGetIsEnrolledInTopicQuery({ topic_id: topicId });

  useEffect(() => {
    if (superuserData && superuserData['is_superuser']) {
      setIsSuperUser(true);
    }
  }, [superuserData]);

  useEffect(() => {
    if (editRolesData && editRolesData['can_edit_topic_roles']) {
      setCanEditRoles(true);
    }
  }, [editRolesData]);

  useEffect(() => {
    if (enrolledData && enrolledData.status) {
      setIsEnrolled(true);
    }
  }, [enrolledData]);

  const navigation = [
    {
      name: 'Preparation',
      href: '#',
      icon: ClipboardDocumentIcon,
      current: currSection === 'preparation' ? true : false
    },
    {
      name: 'Content',
      href: '#',
      icon: BookOpenIcon,
      current: currSection === 'content' ? true : false
    },
    {
      name: 'Assessment',
      href: '#',
      icon: AcademicCapIcon,
      current: currSection === 'assessment' ? true : false
    },
    {
      name: 'Forum',
      href: '#',
      icon: ChatBubbleBottomCenterTextIcon,
      current: false
    },
    ...(isSuperuser || canEditRoles
      ? [
          {
            name: 'Settings',
            href: '#',
            icon: Cog6ToothIcon,
            current: currSection === 'settings'
          }
        ]
      : [])
  ];

  const {
    data: topicData,
    error: topicError,
    isLoading: topicIsLoading
  } = useGetTopicInfoQuery({ topic_id: topicId });

  return (
    <>
      <div>
        {topicIsLoading && (
          <p className="mt-3 text-sm text-gray-700">Loading topic...</p>
        )}
        {topicError && (
          <ErrorAlert
            message="Something went wrong when fetching topic information"
            description={'error' in topicError ? topicError.error : ''}
            className="px-3"
          />
        )}
        {topicData && !isEnrolledLoading && !isEnrolled && (
          <ErrorAlert
            message="You are not enrolled in this topic."
            description="Navigate to the topic tree to enrol in the topic."
          />
        )}
        {topicData && isEnrolled && (
          <>
            <Transition.Root show={sidebarOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-40 md:hidden"
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

                <div className="fixed inset-0 z-40 flex w-80">
                  <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                  >
                    <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-indigo-700 pt-24 pb-4">
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
                            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
                      <div className="flex flex-col flex-shrink-0 px-4">
                        <h1 className="text-white font-semibold">
                          {topicData.title}
                        </h1>
                        <link
                          rel="preload"
                          as="image"
                          className="h-36 w-auto mt-2"
                          href={topicData.image_url}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-5 h-0 flex-1 overflow-y-auto">
                        <nav className="space-y-1 px-2">
                          {navigation.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? 'bg-indigo-800 text-white'
                                  : 'text-indigo-100 hover:bg-indigo-600',
                                'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                              )}
                              onClick={() =>
                                navigate(
                                  `/topic/${topicId}/${item.name.toLowerCase()}/`
                                )
                              }
                            >
                              <item.icon
                                className="mr-4 h-6 w-6 flex-shrink-0 text-indigo-300"
                                aria-hidden="true"
                              />
                              {item.name}
                            </a>
                          ))}
                        </nav>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                  <div className="w-14 flex-shrink-0" aria-hidden="true">
                    {/* Dummy element to force sidebar to shrink to fit close icon */}
                  </div>
                </div>
              </Dialog>
            </Transition.Root>
            {/* Static sidebar for desktop */}
            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
              {/* Sidebar component */}
              <div className="flex flex-grow flex-col overflow-y-auto bg-indigo-700 absolute h-full pt-20">
                <div className="flex flex-shrink-0 px-4 flex-col">
                  <h1 className="text-white font-semibold">
                    {topicData.title}
                  </h1>
                  <img
                    className="h-auto w-auto mt-2"
                    src={topicData.image_url}
                  />
                </div>
                <div className="mt-5 flex flex-1 flex-col">
                  <nav className="flex-1 space-y-1 px-2 pb-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-indigo-800 text-white'
                            : 'text-indigo-100 hover:bg-indigo-600',
                          'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                        )}
                        onClick={() => {
                          if (item.name === 'Assessment') {
                            navigate('/assessmentMain');
                          } else if (item.name === 'Forum') {
                            navigate(`/forum/${topicId}`);
                          } else {
                            navigate(
                              `/topic/${topicId}/${item.name.toLowerCase()}/`
                            );
                          }
                        }}
                      >
                        <item.icon
                          className="mr-3 h-6 w-6 flex-shrink-0 text-indigo-300"
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col md:pl-64 pt-16">
              <button
                type="button"
                className="w-14 h-10 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <main>
                <div>
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                    {/* Main content */}
                    <div>
                      {!resourceId ? (
                        <div className="py-6">
                          <h1 className="text-center text-xl font-medium leading-6 text-gray-900 mb-4">
                            {topicData.title}
                            <span className="text-gray-500">
                              &nbsp;&nbsp;∙&nbsp;&nbsp;
                              {capitalise(currSection + '')}
                            </span>
                          </h1>

                          {currSection === 'settings' && <TopicSettings />}
                          {currSection !== 'settings' && (
                            <div>
                              <div className="flex justify-center mb-2">
                                <OverviewBar />
                              </div>
                              <TopicToolbar
                                setOpen={setCreateResModal}
                                rearrange={rearrange}
                                setRearrange={setRearrange}
                              />
                              <ResourcesList
                                setEditOpen={setEditResModal}
                                setDeleteOpen={setDeleteResModal}
                                setSelectedRes={setSelectedRes}
                                rearrange={rearrange}
                              />
                              <CreateResourceModal
                                open={createResModal}
                                setOpen={setCreateResModal}
                              />
                              <EditResourceModal
                                open={editResModal}
                                setOpen={setEditResModal}
                                resourceId={selectedRes}
                              />
                              <DeleteResourceModal
                                open={deleteResModal}
                                setOpen={setDeleteResModal}
                                resourceId={selectedRes}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-2 px-6">
                          <ResourcePage />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </>
        )}
      </div>
    </>
  );
}
