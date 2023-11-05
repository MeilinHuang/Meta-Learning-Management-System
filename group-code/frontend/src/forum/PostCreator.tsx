import { useState } from 'react';
import { useCreateThreadMutation } from 'features/api/apiSlice';
import PostCreatorError from './PostCreatorError';
import MarkdownEditor2 from 'common/MarkdownEditor2';

/*
 Clarification: I know this is called 'PostCreator' but it actually creates Threads, not Posts.
 This was named before terms for forum object were decided on, and I'm not particularily 
 keen on refactoring all the places this is called.

 If you are instead looking for where posts are created, look at the PostReply.tsx file.
 Sorry!

*/

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
                <MarkdownEditor2 MDContent={content} setMDContent={setContent} />
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
