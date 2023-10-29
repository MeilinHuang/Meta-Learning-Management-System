import { Fragment, useEffect, useRef, useState } from 'react';
import { Listbox, Dialog, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import AccountService from '../account/AccountService';
import { delay } from 'lodash';

export default function CreateTopicImportModal({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: any;
}) {
  
  const cancelButtonRef = useRef(null);
  const maxSize = 5 * 10**6;
  const [errorMessage, setErrorMessage] = useState('');
  const [dataUrl, setDataUrl] = useState('');
  const successMsg = 'New topic created. Please Wait.';
  const red = "py-2 text-center text-sm font-medium text-red-500";
  const green = "py-2 text-center text-sm font-medium text-green-500";
  const [errClass, setErrClass] = useState(red)

  function handleFileSelect(e: any) {
    try {  
      const file = e.target.files.item(0);
      if (file.size <= maxSize && file.type == 'text/plain') {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener("load", () => {
        const dataUrl = reader.result as string;
        setDataUrl(dataUrl);
        });
        setErrClass(green);
        setErrorMessage(file.name + ' selected.');
      } else if (file.size <= maxSize) {
        setErrClass(red);
        setErrorMessage('File type not supported.');
      } else {
        setErrClass(red);
        setErrorMessage('File greater than 200KB.');
      }
    } catch {
      setErrClass(red);
      setErrorMessage('File type not supported.');
    }
  };

  const uploadTopic = () => {
    if (dataUrl != '') {
      const param = {
        file: dataUrl
      }
      AccountService.importTopic(param)
        .then((response: any) => {
          console.log(response)
          if (response.data.message == 'failure') {
            setErrClass(red);
            setErrorMessage('File corrupt, upload denied.');
          } else {
            setErrorMessage('');
            setOpen(false)
          }
        })
        .catch((error) => {
          setErrClass(red);
          setErrorMessage('Topic failed to upload.')
          console.log(error);
        });
    } else {
      setErrClass(red);
      setErrorMessage('Select file.')
    }
    setDataUrl('')
  };

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="mb-10">
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
                      Upload Topic File
                    </Dialog.Title>
                    {/* Create topic form */}
                    <div className="mt-4">
                      {/* Topic name */}
                      <div className="w-full flex flex-col items-start justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Select Topic File</span>
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
                      </div>
                      <div className={errClass}>
                        {errorMessage}
                      </div>
                    </div>

                  </div>
                </div>
                <div className="mt-4 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:col-start-2 sm:text-sm"
                    onClick={() => uploadTopic()}
                  >
                    Upload and Create Topic
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    onClick={() => {
                      setOpen(false);
                      setErrorMessage('');
                      setDataUrl('')
                    }}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
