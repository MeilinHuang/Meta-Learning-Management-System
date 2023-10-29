import { Fragment } from 'react';
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
  ClockIcon,
  UserCircleIcon,
  ChatBubbleLeftIcon,
  ArrowUpIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/20/solid';
import { Menu, Transition } from '@headlessui/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import PostReply from './PostReply';
import defaultImg from '../default.jpg';
import { LIMIT, BATCH_SIZE } from './constants';

import {
  useUpvoteThreadMutation,
  useDownvoteThreadMutation,
  useCheckvoteThreadQuery,
  useMakeThreadStickyMutation,
  useMakeThreadUnStickyMutation,
  useDeleteThreadMutation
} from '../features/api/apiSlice';
import React from 'react';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

function convertTZ(date: Date | string, tzString: string) {
  return new Date(
    (typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', {
      timeZone: tzString
    })
  );
}

export default function Thread(props: any) {
  const [numberVotes, setNumberVotes] = React.useState(props.upvotes);

  const { data: checkvoteData } = useCheckvoteThreadQuery(props.id);
  const [upvoteThread] = useUpvoteThreadMutation();
  const [downvoteThread] = useDownvoteThreadMutation();
  const [makeThreadSticky] = useMakeThreadStickyMutation();
  const [makeThreadUnSticky] = useMakeThreadUnStickyMutation();
  const [deleteThread] = useDeleteThreadMutation();

  const [stickied, setStickied] = React.useState(props.stickied);
  const [justDeleted, setJustDeleted] = React.useState(false);

  console.log(
    `props id is ${props.viewerId}, thread id is ${
      props.author.id
    }, result is ${props.viewerId == props.author.id}`
  );

  if (props.id === -1 || justDeleted) {
    return (
      <div className="w-full h-full px-10 py-10">
        <div className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center items-center">
          <div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              Select a Thread
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Select a thread or create a new one.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={props.createNewThreadCallback}
              >
                <PlusIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                New Thread
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getProfilePic = (dp: string) => {
    console.log(props.author)
    if (dp != "" && dp != null) {
      return dp;
    } 
    return defaultImg;
  };

  return (
    <div className="mx-auto">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-4xl font-bold leading-7 text-gray-900 sm:truncate sm:text-2xl sm:tracking-tight ">
            {props.title}
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <img
                className="h-10 w-10 rounded-full mr-2"
                src={getProfilePic(props.author.profilePic)}
                alt=""
              />
              <a href={`#${props.author.id}`}>{props.author.name}</a>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <ClockIcon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {convertTZ(props.time, 'Australia/Sydney').toString()}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <ChatBubbleLeftIcon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {props.numReplies}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <button
                type="button"
                className={`rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex flex-row border ${
                  checkvoteData !== undefined && checkvoteData.voted === true
                    ? 'border-indigo-500'
                    : ''
                }`}
                onClick={() => {
                  if (checkvoteData === undefined) return;
                  if (checkvoteData.voted === false) {
                    // We have not yet upvoted this thread, lets upvote it
                    upvoteThread(props.id);
                    setNumberVotes(numberVotes + 1);
                  } else if (checkvoteData.voted === true) {
                    // We have already upvoted this thread, lets downvote it
                    downvoteThread(props.id);
                    setNumberVotes(numberVotes - 1);
                  }
                }}
              >
                <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
                <span className="text-sm text-gray-500">{numberVotes}</span>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <span className="hidden sm:block">
            {props.permissions !== undefined &&
              props.permissions.can_sticky_forum_posts && (
                <button
                  type="button"
                  className="mx-2 inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                  onClick={() => {
                    if (props.stickied === false) {
                      makeThreadSticky(props.id);
                      setStickied(true);
                    } else if (props.stickied === true) {
                      makeThreadUnSticky(props.id);
                      setStickied(false);
                    }
                  }}
                >
                  <MapPinIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                  {stickied ? 'Remove Sticky Thread' : 'Make Sticky Thread'}
                </button>
              )}
            <button
              type="button"
              className="mx-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PencilIcon
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                aria-hidden="true"
              />
              Edit
            </button>
            {props.permissions !== undefined &&
              props.permissions.can_delete_any_forum_posts && (
                <button
                  type="button"
                  className="mx-2 inline-flex items-center gap-x-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  onClick={() => {
                    deleteThread(props.id);
                    setJustDeleted(true);
                  }}
                >
                  <TrashIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                  Delete
                </button>
              )}
            {parseInt(props.viewerId) === parseInt(props.author.id) &&
              props.permissions !== undefined &&
              props.permissions.can_delete_any_forum_posts !== true && (
                <button
                  type="button"
                  className="mx-2 inline-flex items-center gap-x-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  onClick={() => {
                    deleteThread(props.id);
                    setJustDeleted(true);
                  }}
                >
                  <TrashIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                  Delete
                </button>
              )}
          </span>

          {/*
          <span className="sm:ml-3">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <CheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Publish
            </button>
          </span>

  */}

          {/* Dropdown */}
          <Menu as="div" className="relative ml-3 sm:hidden">
            <Menu.Button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              More
              <ChevronDownIcon
                className="-mr-1 ml-2 h-5 w-5 text-gray-500"
                aria-hidden="true"
              />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 -mr-1 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700'
                      )}
                    >
                      Edit
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700'
                      )}
                    >
                      View
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      <hr className="px-5 my-5" />
      <ReactMarkdown
        className="prose xs: prose-sm sm:prose-sm md:prose-base max-w-none"
        children={props.content}
        remarkPlugins={[remarkGfm, remarkToc, remarkMath]}
        rehypePlugins={[rehypeHighlight, rehypeKatex]}
      />
      <hr className="px-5 my-5" />
      <PostReply
        parentId={null}
        threadId={props.id}
        cancelCallback={() => {
          props.reloadProps.setLastResultParams({
            offset: props.reloadProps.currentBatch * BATCH_SIZE - 20,
            limit: LIMIT,
            sectionId: props.reloadProps.selectedSection,
            reRender: Math.random()
          });
          props.reloadProps.setCurrentResultParams({
            offset: props.reloadProps.currentBatch * BATCH_SIZE,
            limit: LIMIT,
            sectionId: props.reloadProps.selectedSection,
            reRender: Math.random()
          });
          props.reloadProps.setNextResultParams({
            offset: props.reloadProps.currentBatch * BATCH_SIZE + 20,
            limit: LIMIT,
            sectionId: props.reloadProps.selectedSection,
            reRender: Math.random()
          });
        }}
      />
    </div>
  );
}
