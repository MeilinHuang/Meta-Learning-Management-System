import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  CodeBracketIcon,
  EllipsisVerticalIcon,
  FlagIcon,
  StarIcon,
  ArrowUturnLeftIcon,
  ArrowUpIcon,
  CheckIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  TrashIcon
} from '@heroicons/react/20/solid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import rehypeHighlight from 'rehype-highlight';
import defaultImg from '../default.jpg';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import PostReply from './PostReply';

import parseISO from 'date-fns/parseISO';

import { Post as PostType } from './forum.types';

import {
  useGetPostsQuery,
  useUpvotePostMutation,
  useDownvotePostMutation,
  useCheckvotePostQuery,
  useMakePostEndorsedMutation,
  useMakePostUnEndorsedMutation,
  useMakePostAsAnswerMutation,
  useRemovePostAsAnswerMutation,
  useGetTopicPermissionQuery,
  useReportPostMutation,
  useClearReportPostMutation,
  useDeletePostMutation
} from '../features/api/apiSlice';
import React from 'react';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

function convertTZ(date: Date, tzString: string) {
  return new Date(
    (typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', {
      timeZone: tzString
    })
  );
}

export default function Post(props: any) {
  const [replyOpen, setReplyOpen] = useState(false);

  const [numberVotes, setNumberVotes] = React.useState(props.upvotes);

  const { data: checkvoteData } = useCheckvotePostQuery(props.id);
  const [upvotePost] = useUpvotePostMutation();
  const [downvotePost] = useDownvotePostMutation();
  const [makePostEndorsed] = useMakePostEndorsedMutation();
  const [makePostUnEndorsed] = useMakePostUnEndorsedMutation();
  const [makePostAsAnswer] = useMakePostAsAnswerMutation();
  const [removePostAsAnswer] = useRemovePostAsAnswerMutation();
  const [reportPost] = useReportPostMutation();
  const [clearReportPost] = useClearReportPostMutation();
  const [deletePost] = useDeletePostMutation();

  const {
    data: topLevelPosts = [],
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPostsQuery({ postIds: props.replies });

  const getProfilePic = (dp: string) => {
    console.log(props.author)
    if (dp != "" && dp != null) {
      return dp;
    } 
    return defaultImg;
  };

  return (
    <div className="mx-auto my-10 ">
      <div
        className={`bg-white sm:rounded-lg sm:shadow 
        ${props.endorsed ? 'border-2 border-indigo-700' : ''} 
        ${props.answered ? 'border-2 border-blue-400' : ''}
        ${
          props.permissions !== undefined &&
          props.permissions.can_view_forum_flagged_posts &&
          props.reported
            ? 'border-2 border-red-500 bg-red-100'
            : ''
        }
        
        `}
      >
        <div className="flex flex-row items-start">
          <div className="ml-6 mt-4">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <button
                type="button"
                className={`rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex flex-col border ${
                  checkvoteData !== undefined && checkvoteData.voted === true
                    ? 'border-indigo-500'
                    : ''
                }`}
                onClick={() => {
                  if (checkvoteData.voted === false) {
                    // We have not yet upvoted this thread, lets upvote it
                    upvotePost(props.id);
                    setNumberVotes(numberVotes + 1);
                  } else if (checkvoteData.voted === true) {
                    // We have already upvoted this thread, lets downvote it
                    downvotePost(props.id);
                    setNumberVotes(numberVotes - 1);
                  }
                }}
              >
                <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
                <span className="text-sm text-gray-500">{numberVotes}</span>
              </button>
            </div>
          </div>
          <div className="flex space-x-3 w-full">
            <div
              className={`bg-white px-4 py-5 sm:px-6 w-full ${
                props.permissions !== undefined &&
                props.permissions.can_view_forum_flagged_posts &&
                props.reported
                  ? 'bg-red-100'
                  : ''
              }`}
            >
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={getProfilePic(props.author.profilePic)}
                    alt=""
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    <a href="#" className="hover:underline">
                      {props.author.name}
                    </a>
                  </p>
                  <p className="text-sm text-gray-500">
                    <a href="#" className="hover:underline">
                      {convertTZ(props.time, 'Australia/Sydney').toString()}
                    </a>
                  </p>
                </div>
                <div className="flex flex-col flex-shrink-0 self-center">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-400 hover:text-gray-600">
                        <span className="sr-only">Open options</span>
                        <EllipsisVerticalIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {props.topLevel === true && props.viewerIsAuthor && (
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active
                                      ? 'bg-gray-100 text-gray-900'
                                      : 'text-gray-700',
                                    'flex px-4 py-2 text-sm'
                                  )}
                                  onClick={() => {
                                    if (props.answered === false) {
                                      makePostAsAnswer({
                                        post_id: props.id,
                                        thread_id: props.thread_id
                                      });
                                    } else {
                                      removePostAsAnswer({
                                        post_id: props.id,
                                        thread_id: props.thread_id
                                      });
                                    }
                                  }}
                                >
                                  <CheckIcon
                                    className="mr-3 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  <span>
                                    {props.answered === false
                                      ? 'Mark as answer'
                                      : 'Remove marked as answer'}
                                  </span>
                                </a>
                              )}
                            </Menu.Item>
                          )}
                          {props.topLevel === true &&
                            props.permissions !== undefined &&
                            props.permissions.can_endorse_forum_posts && (
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(
                                      active
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700',
                                      'flex px-4 py-2 text-sm'
                                    )}
                                    onClick={() => {
                                      if (props.endorsed === false) {
                                        makePostEndorsed({
                                          post_id: props.id,
                                          thread_id: props.thread_id
                                        });
                                      } else {
                                        makePostUnEndorsed({
                                          post_id: props.id,
                                          thread_id: props.thread_id
                                        });
                                      }
                                    }}
                                  >
                                    <CheckBadgeIcon
                                      className="mr-3 h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    <span>
                                      {props.endorsed === false
                                        ? 'Endorse post'
                                        : 'Remove post endorsement'}
                                    </span>
                                  </a>
                                )}
                              </Menu.Item>
                            )}
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                  'flex px-4 py-2 text-sm'
                                )}
                                onClick={() => {
                                  reportPost(props.id);
                                }}
                              >
                                <FlagIcon
                                  className="mr-3 h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                <span>Report content</span>
                              </a>
                            )}
                          </Menu.Item>
                          {props.permissions !== undefined &&
                            props.permissions.can_delete_any_forum_posts && (
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(
                                      active
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700',
                                      'flex px-4 py-2 text-sm'
                                    )}
                                    onClick={() => {
                                      deletePost({
                                        post_id: props.id,
                                        thread_id: props.thread_id
                                      });
                                    }}
                                  >
                                    <TrashIcon
                                      className="mr-3 h-5 w-5 text-red-400"
                                      aria-hidden="true"
                                    />
                                    <span className="text-red-400">
                                      Remove Post
                                    </span>
                                  </a>
                                )}
                              </Menu.Item>
                            )}
                          {parseInt(props.viewerId) ===
                            parseInt(props.author.id) &&
                            props.permissions !== undefined &&
                            props.permissions.can_delete_any_forum_posts !==
                              true && (
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(
                                      active
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700',
                                      'flex px-4 py-2 text-sm'
                                    )}
                                    onClick={() => {
                                      deletePost({
                                        post_id: props.id,
                                        thread_id: props.thread_id
                                      });
                                    }}
                                  >
                                    <TrashIcon
                                      className="mr-3 h-5 w-5 text-red-400"
                                      aria-hidden="true"
                                    />
                                    <span className="text-red-400">
                                      Remove Post
                                    </span>
                                  </a>
                                )}
                              </Menu.Item>
                            )}
                          {props.reported &&
                            props.permissions !== undefined &&
                            props.permissions.can_view_forum_flagged_posts && (
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(
                                      active
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700',
                                      'flex px-4 py-2 text-sm'
                                    )}
                                    onClick={() => {
                                      clearReportPost(props.id);
                                    }}
                                  >
                                    <CheckCircleIcon
                                      className="mr-3 h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    <span>Clear Reports</span>
                                  </a>
                                )}
                              </Menu.Item>
                            )}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                  <div
                    className="hover:text-gray-600 cursor-pointer"
                    onClick={() => {
                      setReplyOpen(!replyOpen);
                    }}
                  >
                    <ArrowUturnLeftIcon
                      className="mt-2 h-4 w-4"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
              <div id="badges" className="w-full">
                {props.endorsed && (
                  <div className="w-fit">
                    <span className="group relative flex inline-flex items-center rounded bg-indigo-800 px-2 py-0.5 text-xs font-medium text-indigo-300 mr-2">
                      Endorsed by Topic Staff
                      <span className="absolute bottom-8 left-0 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 w-max">
                        This post has been endorsed by a Topic Staff member.
                      </span>
                    </span>
                  </div>
                )}
                {props.answered && (
                  <div className="w-fit">
                    <span className="group relative flex inline-flex items-center rounded bg-blue-500 px-2 py-0.5 text-xs font-medium text-blue-200 mr-2">
                      Marked as Answer
                      <span className="absolute bottom-8 left-0 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 w-max">
                        This post has been marked as an answer by the Original
                        Poster of the Thread.
                      </span>
                    </span>
                  </div>
                )}
              </div>

              <ReactMarkdown
                className="prose prose-sm max-w-none"
                children={props.content}
                remarkPlugins={[remarkGfm, remarkToc, remarkMath]}
                rehypePlugins={[rehypeHighlight, rehypeKatex]}
              />
              {replyOpen ? (
                <div>
                  <hr className="m-3" />
                  <PostReply
                    key={props.id}
                    parentId={props.id}
                    threadId={props.threadId}
                    cancelCallback={() => {
                      setReplyOpen(false);
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
              <div>
                {isLoading && <div>Loading...</div>}
                {isSuccess &&
                  topLevelPosts.map((post: PostType) => (
                    <Post
                      id={post.id}
                      threadId={post.thread_id}
                      author={post.author}
                      thread_id={post.thread_id}
                      time={post.time}
                      content={post.content}
                      upvotes={post.upvotes}
                      replies={post.replies}
                      key={post.id}
                      topicId={props.topicId}
                      topLevel={false}
                      permissions={props.permissions}
                      reported={post.reported}
                      viewerId={props.viewerId}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
