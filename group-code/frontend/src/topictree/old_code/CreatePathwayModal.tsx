import { Fragment, useEffect, useRef, useState } from 'react';
import { Listbox, Dialog, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { PlusIcon as PlusIconMini } from '@heroicons/react/20/solid';
import Select from 'react-select';

import {
  useCreatePathwayMutation,
  useGetPathwayQuery
} from '../../features/api/apiSlice';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function CreatePathwayModal({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: any;
}) {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (open) {
      // reset form fields
      setName('');
      setCoreTopics([]);
      setElectiveTopics([]);
    }
  }, [open]);

  const [name, setName] = useState('');
  const [coreTopics, setCoreTopics] = useState<Array<number>>([]);
  const [electiveTopics, setElectiveTopics] = useState<Array<number>>([]);

  const [formattedTopics, setFormattedTopics] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const {
    data: globalPathData,
    error: errorPath,
    isLoading: isLoadingPath,
    isFetching: isFetchingPath,
    isSuccess: isSuccessPath
  } = useGetPathwayQuery({
    pathway_id: 0,
    user: false
  });

  const [
    createPathway,
    { data: pathwayCreateData, isSuccess: isSuccessCreatePathway }
  ] = useCreatePathwayMutation();

  useEffect(() => {
    if (!isFetchingPath && isSuccessPath) {
      setFormattedTopics(
        globalPathData.electives.map((topic: any) => {
          return {
            value: `${topic.id}`,
            label: topic.name
          };
        })
      );
    }
  }, [isFetchingPath]);

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
                <div className="mb-5">
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
                      Create Pathway
                    </Dialog.Title>
                    {/* Create topic form */}
                    <div className="mt-2">
                      {/* Pathway name */}
                      <div className="w-full flex flex-col items-start">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Pathway name*
                        </label>
                        <div className="mt-1 w-full">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>
                      {/* Core topics */}
                      <div className="w-full flex flex-col items-start mt-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Core topics
                        </label>
                        <Select
                          name="prerequisites"
                          options={formattedTopics}
                          isMulti
                          className="basic-multi-select mt-1 block w-full text-sm text-left"
                          classNamePrefix="select"
                          maxMenuHeight={90}
                          onChange={(e) => {
                            setCoreTopics(
                              e.map((topic) => Number(topic.value))
                            );
                          }}
                          theme={(theme) => ({
                            ...theme,
                            borderRadius: 5,
                            colors: {
                              ...theme.colors,
                              primary25: '#eef2ff',
                              primary: '#818cf8'
                            }
                          })}
                        />
                      </div>
                      {/* Elective topics */}
                      <div className="w-full flex flex-col items-start mt-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Elective topics
                        </label>
                        <Select
                          name="prerequisites"
                          options={formattedTopics}
                          isMulti
                          className="basic-multi-select mt-1 block w-full text-sm text-left"
                          classNamePrefix="select"
                          maxMenuHeight={90}
                          onChange={(e) => {
                            setElectiveTopics(
                              e.map((topic) => Number(topic.value))
                            );
                          }}
                          theme={(theme) => ({
                            ...theme,
                            borderRadius: 5,
                            colors: {
                              ...theme.colors,
                              primary25: '#eef2ff',
                              primary: '#818cf8'
                            }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:col-start-2 sm:text-sm"
                    onClick={() => {
                      createPathway({
                        name,
                        core: coreTopics,
                        electives: electiveTopics
                      });
                      setOpen(false);
                    }}
                  >
                    Create Pathway
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    onClick={() => {
                      setOpen(false);
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
