import { Tab } from '@headlessui/react';
import {
  AtSymbolIcon,
  CodeBracketIcon,
  LinkIcon
} from '@heroicons/react/20/solid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const MarkdownEditor2: React.FC<any> = ({MDContent, setMDContent}) => {

  return (
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
                value={MDContent}
                onChange={(e) => setMDContent(e.target.value)}
              />
            </div>
          </Tab.Panel>
          <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
            <div className="border-b prose prose-sm">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkToc, remarkMath]}
                rehypePlugins={[rehypeHighlight, rehypeKatex]}
              >
                {MDContent}
              </ReactMarkdown>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </>
    )}
  </Tab.Group>
  );
};

export default MarkdownEditor2;
