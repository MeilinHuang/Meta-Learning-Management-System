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
import { Tab } from '@headlessui/react';
import {
  AtSymbolIcon,
  CodeBracketIcon,
  LinkIcon
} from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';

import { useCreatePostMutation } from '../features/api/apiSlice';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

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
      <Tab.Group>
        {({ selectedIndex }) => (
          <>
            <Tab.List className="flex items-center">
              <Tab
                className={({ selected }) =>
                  classNames(
                    selected
                      ? 'text-gray-900 bg-gray-100 hover:bg-gray-200'
                      : 'text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100',
                    'rounded-md border border-transparent px-3 py-1.5 text-sm font-medium'
                  )
                }
              >
                Write
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    selected
                      ? 'text-gray-900 bg-gray-100 hover:bg-gray-200'
                      : 'text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100',
                    'ml-2 rounded-md border border-transparent px-3 py-1.5 text-sm font-medium'
                  )
                }
              >
                Preview
              </Tab>

              {/* These buttons are here simply as examples and don't actually do anything. */}
              {selectedIndex === 0 ? (
                <div className="ml-auto flex items-center space-x-5">
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Insert link</span>
                      <LinkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Insert code</span>
                      <CodeBracketIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Mention someone</span>
                      <AtSymbolIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : null}
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                <label htmlFor="comment" className="sr-only">
                  Comment
                </label>
                <div>
                  <textarea
                    rows={5}
                    name="comment"
                    id="comment"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Add your comment..."
                    defaultValue={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                </div>
              </Tab.Panel>
              <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                <div className="border-b prose prose-sm">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkToc, remarkMath]}
                    rehypePlugins={[rehypeHighlight, rehypeKatex]}
                  >
                    {reply}
                  </ReactMarkdown>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </>
        )}
      </Tab.Group>
      <div className="mt-2 flex justify-end">
        <button
          className="m-2 infline=flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray:700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          type="button"
          onClick={() => {
            setCancel(true);
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
