import React from 'react';
import Post from './Post';
import Thread from './Thread';

import jwt_decode from 'jwt-decode';

import { Thread as ThreadType, Post as PostType, ResultParams } from './forum.types';

import {
  useGetPostsQuery,
  useGetTopicPermissionQuery
} from '../features/api/apiSlice';

type ThreadViewerProps = {
  thread: ThreadType;
  createNewThreadCallback: () => void;
  topicId: number;
  reloadProps: object;
  selectedThreadCallback: (thread: ThreadType) => void;
};

export default function ThreadViewer(props: ThreadViewerProps) {
  const {
    data: topLevelPosts = [],
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPostsQuery({ postIds: props.thread.posts });

  const [canMarkAnswer, setCanMarkAnswer] = React.useState(false);

  const userId = localStorage.getItem('user_id');
  React.useEffect(() => {
    if (userId !== null) {
      setCanMarkAnswer(parseInt(userId) == props.thread.author.id);
    }
  }, [props.thread.author.id, userId]);

  const { data: permissions } = useGetTopicPermissionQuery({
    topic_id: props.topicId,
    permission:
      'can_endorse_forum_posts&flags=can_sticky_forum_posts&flags=can_delete_any_forum_posts&flags=can_appear_as_forum_staff&flags=can_view_forum_flagged_posts'
  });

  let postsToRender;

  if (isLoading) {
    postsToRender = <div>Loading...</div>;
  } else if (isError) {
    console.error(error);
    postsToRender = <div>Error...</div>;
  } else if (isSuccess) {
    postsToRender = (
      <div>
        {topLevelPosts.map((post: PostType) => (
          <Post
            id={post.id}
            threadId={props.thread.id}
            author={post.author}
            thread_id={post.thread_id}
            time={post.time}
            content={post.content}
            upvotes={post.upvotes}
            replies={post.replies}
            key={post.id}
            endorsed={post.endorsed}
            answered={post.answered}
            viewerIsAuthor={canMarkAnswer}
            topicId={props.topicId}
            topLevel={true}
            permissions={permissions}
            reported={post.reported}
            viewerId={userId}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`h-full overflow-y-scroll max-w-8xl ${
        props.thread.id === -1 ? '' : 'px-4 sm:px-3 lg:px-5 xl:px-8 2xl:px-14'
      }`}
    >
      <Thread
        title={props.thread.title}
        time={props.thread.time}
        id={props.thread.id}
        key={props.thread.id}
        author={props.thread.author}
        content={props.thread.content}
        numReplies={props.thread.posts.length}
        upvotes={props.thread.upvotes}
        createNewThreadCallback={props.createNewThreadCallback}
        topicId={props.topicId}
        stickied={props.thread.stickied}
        permissions={permissions}
        reported={props.thread.reported}
        viewerId={userId}
        reloadProps={props.reloadProps}
        selectedThreadCallback={props.selectedThreadCallback}
        thread={props.thread}
      />
      {postsToRender}
    </div>
  );
}
