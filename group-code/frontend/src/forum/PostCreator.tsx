import { Tab } from '@headlessui/react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useState } from 'react';
import { useCreateThreadMutation } from 'features/api/apiSlice';
import PostCreatorError from './PostCreatorError';

/*
 Clarification: I know this is called 'PostCreator' but it actually creates Threads, not Posts.
 This was named before terms for forum object were decided on, and I'm not particularily 
 keen on refactoring all the places this is called.

 If you are instead looking for where posts are created, look at the PostReply.tsx file.
 Sorry!

*/

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

type PostCreatorProps = {
  closeCallback: () => void;
  sectionId: number;
};

export default function PostCreator(props: PostCreatorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showError, setShowError] = useState(false);

  const [createThread, { isLoading }] = useCreateThreadMutation();

  const onSubmitButtonClicked = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      if (props.sectionId !== 0) {
        await createThread({
          section_id: props.sectionId,
          title,
          content
        });
        props.closeCallback();
        if (showError) setShowError(false);
      } else {
        setShowError(true);
      }
    } catch (err) {
      console.error('Failed to create post: ' + err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <form className="space-y-8 divide-y divide-gray-200">
        {showError && (
          <PostCreatorError
            error="Please select a forum section on the left to create a thread in."
            dismissCallback={() => {
              setShowError(false);
            }}
          />
        )}
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div className="mt-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Create new thread
              </h3>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    autoComplete="title"
                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    defaultValue={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-6">
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
                      </Tab.List>
                      <Tab.Panels className="mt-2">
                        <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                          <label htmlFor="comment" className="sr-only">
                            Thread Content
                          </label>
                          <div>
                            <textarea
                              rows={25}
                              name="comment"
                              id="comment"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder="Add your thread content..."
                              defaultValue={content}
                              onChange={(e) => setContent(e.target.value)}
                            />
                          </div>
                        </Tab.Panel>
                        <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                          <div className="border-b prose">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkToc, remarkMath]}
                              rehypePlugins={[rehypeHighlight, rehypeKatex]}
                            >
                              {content}
                            </ReactMarkdown>
                          </div>
                        </Tab.Panel>
                      </Tab.Panels>
                    </>
                  )}
                </Tab.Group>
              </div>
            </div>
            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={props.closeCallback}
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
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
