/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { useEffect, useState } from 'react';

import { useCreatePostMutation } from '../features/api/apiSlice';
import MarkdownEditor2 from 'common/MarkdownEditor2';

export default function PostReply(props: any) {
  const [cancel, setCancel] = useState(false);
  const [reply, setReply] = useState('');

  const [createPost, { isLoading }] = useCreatePostMutation();

  const onSubmitButtonClicked = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      await createPost({
        thread_id: props.threadId,
        parent_id: props.parentId,
        content: reply
      });
      setReply('');
      setCancel(true);
    } catch (err) {
      console.error('Failed to create post: ' + err);
    }
  };

  useEffect(() => {
    if (cancel) props.cancelCallback();
  }, [cancel]);

  return (
    <form action="#">
      <MarkdownEditor2 MDContent={reply} setMDContent={setReply} />
      <div className="mt-2 flex justify-end">
        <button
          className="m-2 infline=flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray:700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          type="button"
          onClick={() => {
            setCancel(true);
            setReply('');
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`m-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isLoading ? 'disabled cursor-wait' : ''
          }`}
          onClick={onSubmitButtonClicked}
        >
          Post
        </button>
      </div>
    </form>
  );
}
