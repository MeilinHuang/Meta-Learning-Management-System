import { Fragment, useState, useRef, useEffect } from 'react';
import { Transition, Menu, Dialog } from '@headlessui/react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import 'katex/dist/katex.css';
import MarkdownEditor2 from 'common/MarkdownEditor2';

import {
  ResourceIcon,
  capitalise,
  getPermittedFormats,
  isPermittedFormat
} from './contentHelpers';
import { getButtonGroupStyles } from 'topictree/topicTreeHelpers';

import { useParams } from 'react-router-dom';

import { ConfirmAlert, WarningAlert, ErrorAlert } from '../common/Alert';

import {
  useUploadResourceMutation,
  useUploadMarkdownMutation,
  useCreateResourceMutation
} from '../features/api/apiSlice';

function classNames(...classes: Array<string>) {
  return classes.filter(Boolean).join(' ');
}

export default function CreateResForm({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: any;
}) {
  const mdKaTeX = `This is to display the 
  \`$$c = \\pm\\sqrt{a^2 + b^2}$$\`
  in one line
  `;

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [MDLoading, setMDLoading] = useState(false);
  const [update, forceUpdate] = useState(0);
  const cancelButtonRef = useRef(null);

  const topicId = useParams()['topicId'];
  const currSection = useParams()['section'] || 'preparation';

  const [typeError, setTypeError] = useState(false);

  // Form data //
  const [isUpload, setIsUpload] = useState(false); // whether the resource is to be uploaded from user's device
  const [isMD, setIsMD] = useState(true); // whether a document type resource is a markdown document
  const [isLink, setIsLink] = useState(true);

  const [type, setType] = useState<
    'Video' | 'Document' | 'Slides' | 'Audio' | 'Link' | 'File'
  >('Video');
  const [section, setSection] = useState(capitalise(currSection));
  const [title, setTitle] = useState('');
  const [uploadTitle, setUploadTitle] = useState({ title: '' }); // Note: dictionary is used here so useEffect for uploadTitle is triggered even if the new filename is the same
  const [byteArray, setByteArray] = useState<number[]>([]);
  const [duration, setDuration] = useState('');
  const [serverPath, setServerPath] = useState('');
  const [url, setUrl] = useState('');

  const [markdown, setMarkdown] = useState('');
  const [MDfullscreen, setMDFullscreen] = useState(false);
  const [description, setDescription] = useState('');

  // Rerender component to reset topicId and currSection when modal is opened
  useEffect(() => {
    forceUpdate(update + 1);
    setSection(capitalise(currSection));
  }, [open]);

  useEffect(() => {
    // New file has been selected
    // Upload file

    if (byteArray && uploadTitle.title) {
      uploadResource({
        topic_id: topicId,
        section: currSection,
        title: uploadTitle.title,
        file_data: byteArray
      });
    }
  }, [uploadTitle]);

  // File drag and drop
  function handleFileDrag(e: any) {
    e.preventDefault();
    e.stopPropagation();
  }

  const [
    uploadResource,
    {
      data: uploadResData,
      isSuccess: uploadResIsSuccess,
      isLoading: uploadResIsLoading
    }
  ] = useUploadResourceMutation();

  const [
    uploadMarkdown,
    {
      data: uploadMDData,
      isSuccess: uploadMDIsSuccess,
      isLoading: uploadMDIsLoading
    }
  ] = useUploadMarkdownMutation();

  const [
    createResource,
    {
      data: createResData,
      isSuccess: createResIsSuccess,
      isLoading: createResIsLoading
    }
  ] = useCreateResourceMutation();

  // Reset form fields after submission
  useEffect(() => {
    if (!createResIsLoading && createResIsSuccess) {
      setIsUpload(false);
      setTitle('');
      setUploadTitle({ title: '' });
      setByteArray([]);
      setDuration('');
      setServerPath('');
      setUrl('');
      setDescription('');
    }
  }, [createResIsLoading, createResIsSuccess]);

  function handleFileDrop(e: any) {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();

    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...e.dataTransfer.items].forEach((item, i) => {
        // Only handle use first file
        if (i === 0) {
          // If dropped items aren't files, reject them
          if (item.kind === 'file') {
            const file = item.getAsFile();

            file.arrayBuffer().then((data: any) => {
              const bytes = new Uint8Array(data);
              setByteArray(Array.from(bytes));
              // Set title to file name if not already defined
              if (title == '') {
                setTitle(file.name.split('.')[0]);
              }

              setUploadTitle({ title: file.name });

              if (
                !isPermittedFormat(type.toLowerCase(), file.type.split('/')[1])
              ) {
                setTypeError(true);
              } else {
                setTypeError(false);
              }
            });
          }
        }
      });
    }
  }

  function handleFileSelect(e: any) {
    const file = e.target.files.item(0);
    file.arrayBuffer().then((data: any) => {
      const bytes = new Uint8Array(data);
      setByteArray(Array.from(bytes));
      // Set title to file name if not already defined
      if (title == '') {
        setTitle(file.name.split('.')[0]);
      }

      setUploadTitle({ title: file.name });

      if (!isPermittedFormat(type.toLowerCase(), file.type.split('/')[1])) {
        setTypeError(true);
      } else {
        setTypeError(false);
      }
    });
  }

  // After file upload, update serverPath
  useEffect(() => {
    if (uploadResData) {
      setServerPath(uploadResData.server_path);
    }
  }, [uploadResIsSuccess]);

  useEffect(() => {
    if (uploadMDData) {
      setServerPath(uploadMDData.server_path);
      createResource({
        resource_type: type.toLowerCase(),
        title,
        server_path: uploadMDData.server_path,
        url: url ? 'https://' + url : '',
        duration,
        section: section?.toLowerCase() || 'preparation',
        description,
        topic_id: topicId,
        creator_id: Number(localStorage.getItem('user_id'))
      });
      setMDLoading(false);
      setOpen(false);
    }
  }, [uploadMDIsSuccess]);

  useEffect(() => {
    if (uploadResIsSuccess && !uploadResIsLoading) {
      setShowSuccessAlert(true);
    }
  }, [uploadResIsSuccess, uploadResIsLoading]);

  useEffect(() => {
    if (!open) {
      setShowSuccessAlert(false);
      setTypeError(false);
    }
  }, [open]);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed bottom-0 right-0 left-0 top-16 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={
                  MDfullscreen
                    ? 'absolute transform overflow-hidden w-full h-full'
                    : 'relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6'
                }
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <PlusIcon
                    className="h-6 w-6 text-indigo-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create Resource
                  </Dialog.Title>
                </div>
                <div>
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Form content */}
                  <form className="space-y-8 divide-y divide-gray-200">
                    <div className="space-y-8 divide-y divide-gray-200">
                      <div className="space-y-6">
                        {/* Section */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Section
                          </label>
                          <Menu
                            id="resource-section"
                            as="div"
                            className="relative inline-block text-left"
                          >
                            <div>
                              <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100">
                                <span className="group flex items-center text-sm">
                                  {section}
                                </span>
                                <ChevronDownIcon
                                  className="-mr-1 ml-2 h-5 w-5"
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
                              <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right divide-y rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        className={classNames(
                                          active
                                            ? 'bg-gray-100 text-gray-900 hover:cursor-pointer'
                                            : 'text-gray-700',
                                          'group flex items-center px-4 py-2 text-sm'
                                        )}
                                        onClick={() =>
                                          setSection('Preparation')
                                        }
                                      >
                                        Preparation
                                      </a>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        className={classNames(
                                          active
                                            ? 'bg-gray-100 text-gray-900 hover:cursor-pointer'
                                            : 'text-gray-700',
                                          'group flex items-center px-4 py-2 text-sm'
                                        )}
                                        onClick={() => setSection('Content')}
                                      >
                                        Content
                                      </a>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>

                        {/* Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <Menu
                            id="resource-type"
                            as="div"
                            className="relative inline-block text-left"
                          >
                            <div>
                              <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100">
                                <span className="group flex items-center text-sm">
                                  <ResourceIcon
                                    type={type}
                                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                  />
                                  {type}
                                </span>
                                <ChevronDownIcon
                                  className="-mr-1 ml-2 h-5 w-5"
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
                              <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right divide-y rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        className={classNames(
                                          active
                                            ? 'bg-gray-100 text-gray-900 hover:cursor-pointer'
                                            : 'text-gray-700',
                                          'group flex items-center px-4 py-2 text-sm'
                                        )}
                                        onClick={() => setType('Video')}
                                      >
                                        <ResourceIcon
                                          type="video"
                                          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                        />
                                        Video
                                      </a>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        className={classNames(
                                          active
                                            ? 'bg-gray-100 text-gray-900 hover:cursor-pointer'
                                            : 'text-gray-700',
                                          'group flex items-center px-4 py-2 text-sm'
                                        )}
                                        onClick={() => setType('Document')}
                                      >
                                        <ResourceIcon
                                          type="document"
                                          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                        />
                                        Document
                                      </a>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        className={classNames(
                                          active
                                            ? 'bg-gray-100 text-gray-900 hover:cursor-pointer'
                                            : 'text-gray-700',
                                          'group flex items-center px-4 py-2 text-sm'
                                        )}
                                        onClick={() => setType('Slides')}
                                      >
                                        <ResourceIcon
                                          type="slides"
                                          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                        />
                                        Slides
                                      </a>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        className={classNames(
                                          active
                                            ? 'bg-gray-100 text-gray-900 hover:cursor-pointer'
                                            : 'text-gray-700',
                                          'group flex items-center px-4 py-2 text-sm'
                                        )}
                                        onClick={() => setType('Audio')}
                                      >
                                        <ResourceIcon
                                          type="audio"
                                          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                        />
                                        Audio
                                      </a>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        className={classNames(
                                          active
                                            ? 'bg-gray-100 text-gray-900 hover:cursor-pointer'
                                            : 'text-gray-700',
                                          'group flex items-center px-4 py-2 text-sm'
                                        )}
                                        onClick={() => setType('File')}
                                      >
                                        <ResourceIcon
                                          type="file"
                                          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                        />
                                        File
                                      </a>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        className={classNames(
                                          active
                                            ? 'bg-gray-100 text-gray-900 hover:cursor-pointer'
                                            : 'text-gray-700',
                                          'group flex items-center px-4 py-2 text-sm'
                                        )}
                                        onClick={() => setType('Link')}
                                      >
                                        <ResourceIcon
                                          type="link"
                                          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                        />
                                        Link
                                      </a>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>

                        {/* Title */}
                        <div>
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Title
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="title"
                              id="title"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="sm:col-span-6">
                          <label
                            htmlFor="about"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Description (optional)
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="description"
                              name="description"
                              rows={3}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* MD and upload toggle */}
                        {type === 'Document' && (
                          <div>
                            <span className="isolate inline-flex rounded-md shadow-sm">
                              <button
                                type="button"
                                className={getButtonGroupStyles({
                                  active: isMD,
                                  leftCorner: true
                                })}
                                onClick={() => {
                                  setIsMD(true);
                                  setIsUpload(false);
                                  setIsLink(false);
                                }}
                              >
                                Markdown
                              </button>

                              <button
                                type="button"
                                className={getButtonGroupStyles({
                                  active: isUpload,
                                  rightCorner: true
                                })}
                                onClick={() => {
                                  setIsUpload(true);
                                  setIsMD(false);
                                  setIsLink(false);
                                }}
                              >
                                Upload
                              </button>
                            </span>
                          </div>
                        )}

                        {/* URL */}
                        {(type === 'Video' || type === 'Link') && (
                          <div>
                            <label
                              htmlFor="url"
                              className="block text-sm font-medium text-gray-700"
                            >
                              URL
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                                https://
                              </span>
                              <input
                                type="text"
                                name="url"
                                id="url"
                                autoComplete="url"
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                              />
                            </div>
                          </div>
                        )}

                        {/* Markdown */}
                        {isMD && type === 'Document' && (
                          <div className="container">
                            {MDLoading && (
                              <WarningAlert
                                message={'Uploading markdown...'}
                                className="mb-1"
                                noSpace
                              />
                            )}
                            {/* The preview component can be changed: https://github.com/uiwjs/react-md-editor/issues/429 */}
                            <MarkdownEditor2
                              MDContent={markdown}
                              setMDContent={setMarkdown}
                            />
                          </div>
                        )}

                        {/* File upload */}
                        {((isUpload && type === 'Document') ||
                          type === 'Audio' ||
                          type === 'Video' ||
                          type === 'Slides' ||
                          type === 'File') && (
                          <div>
                            <label
                              htmlFor="file-upload"
                              className="block text-sm font-medium text-gray-700"
                            >
                              File
                            </label>
                            {showSuccessAlert && !typeError && (
                              <ConfirmAlert
                                message={`${uploadTitle.title} successfully uploaded`}
                                noSpace
                              />
                            )}
                            {typeError && (
                              <ErrorAlert
                                message="Incorrect file format"
                                noSpace
                              />
                            )}
                            <div
                              onDragOver={(e) => handleFileDrag(e)}
                              onDrop={(e) => handleFileDrop(e)}
                              className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6"
                            >
                              <div className="space-y-1 text-center">
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                  >
                                    <span>Upload a file</span>
                                    <input
                                      id="file-upload"
                                      name="file-upload"
                                      type="file"
                                      className="sr-only"
                                      onChange={(e) => {
                                        handleFileSelect(e);
                                      }}
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {getPermittedFormats(type.toLowerCase())}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Duration */}
                        <div>
                          <label
                            htmlFor="duration"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Duration (min)
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="duration"
                              id="duration"
                              className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                        onClick={() => {
                          if (type === 'Document' && isMD) {
                            uploadMarkdown({
                              title: title,
                              content: markdown,
                              topic_id: topicId,
                              section: currSection
                            });
                            setMDLoading(true);
                          } else {
                            createResource({
                              resource_type: type.toLowerCase(),
                              title,
                              server_path: serverPath,
                              url: url ? 'https://' + url : '',
                              duration,
                              section: section?.toLowerCase() || 'preparation',
                              description,
                              topic_id: topicId,
                              creator_id: Number(
                                localStorage.getItem('user_id')
                              )
                            });
                            setOpen(false);
                          }
                        }}
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
