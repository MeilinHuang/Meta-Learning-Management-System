import { Fragment, useEffect, useRef, useState } from 'react';
import { Listbox, Dialog, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { PlusIcon as PlusIconMini } from '@heroicons/react/20/solid';
import Select from 'react-select';

import {
  useGetTopicGroupsQuery,
  useGetPathwayQuery,
  useCreateTopicMutation,
  useCreatePrerequisiteMutation
} from '../../features/api/apiSlice';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function CreatePrerequisiteModal({
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
      setPrereqSets([{ amount: 1, choices: [] }]);
    }
  }, [open]);

  const [prereqSets, setPrereqSets] = useState<
    { amount: number; choices: Array<{ id: number; name: string }> }[]
  >([]);
  const [targetTopic, setTargetTopic] = useState<number | null>(null);

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
    createPrerequisite,
    { data: prereqCreateData, isSuccess: isSuccessPrereqCreate }
  ] = useCreatePrerequisiteMutation();

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
                      Create Prerequisites
                    </Dialog.Title>
                    {/* Create prerequisite form */}
                    <div className="mt-2">
                      {/* Target topic */}
                      <div className="w-full flex flex-col items-start mt-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Target topic
                        </label>
                        <Select
                          name="target"
                          options={formattedTopics}
                          className="basic-multi-select mt-1 block w-full text-sm text-left"
                          classNamePrefix="select"
                          maxMenuHeight={100}
                          onChange={(e) => {
                            if (e) {
                              setTargetTopic(Number(e.value));
                            }
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
                      {/* Topic prerequisites */}
                      <div className="w-full flex flex-col items-start mt-4">
                        <div className="w-full flex items-center justify-between">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Topic prerequisites
                          </label>
                          <button
                            type="button"
                            className="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => {
                              setPrereqSets([
                                ...prereqSets,
                                {
                                  amount: 1,
                                  choices: []
                                }
                              ]);
                            }}
                          >
                            <PlusIconMini
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                        {/* Labels - amount and choices */}
                        <div className="w-full flex mt-2">
                          <label className="mr-3 w-1/4 block text-sm text-gray-700 text-left">
                            Amount
                          </label>
                          <label className="w-3/4 block text-sm text-gray-700 text-left">
                            Choices
                          </label>
                        </div>
                        {prereqSets.map((set, indx) => {
                          return (
                            <div key={indx} className="w-full flex">
                              <div className="mr-3 w-1/4 mt-1">
                                <input
                                  onChange={(e) =>
                                    setPrereqSets([
                                      ...prereqSets.slice(0, indx),
                                      {
                                        ...prereqSets[indx],
                                        amount: e.target.value
                                          ? Number(e.target.value)
                                          : 1
                                      },
                                      ...prereqSets.slice(indx + 1)
                                    ])
                                  }
                                  type="number"
                                  min={1}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                              <div className="w-3/4">
                                <Select
                                  name="prerequisites"
                                  options={formattedTopics}
                                  isMulti
                                  className="basic-multi-select mt-1 block w-full text-sm text-left"
                                  classNamePrefix="select"
                                  maxMenuHeight={90}
                                  onChange={(e) => {
                                    setPrereqSets([
                                      ...prereqSets.slice(0, indx),
                                      {
                                        ...prereqSets[indx],
                                        choices: e.map((prereq) => {
                                          return {
                                            id: Number(prereq.value),
                                            name: prereq.label
                                          };
                                        })
                                      },
                                      ...prereqSets.slice(indx + 1)
                                    ]);
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:col-start-2 sm:text-sm"
                    onClick={() => {
                      if (targetTopic) {
                        prereqSets.forEach((prereqSet) => {
                          if (
                            prereqSet.amount > 0 &&
                            prereqSet.choices.length > 0 &&
                            prereqSet.amount <= prereqSet.choices.length
                          ) {
                            createPrerequisite({
                              topic_id: targetTopic,
                              amount: prereqSet.amount,
                              choices: prereqSet.choices.map(
                                (choice) => choice.id
                              )
                            });
                          }
                        });
                      }
                      setOpen(false);
                    }}
                  >
                    Add Prerequisites
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
