import { Fragment, useEffect, useRef, useState } from 'react';
import { Listbox, Dialog, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PlusIcon as PlusIconMini, TrashIcon } from '@heroicons/react/20/solid';
import Select from 'react-select';
import { Switch } from '@headlessui/react';

import {
  useGetTopicGroupsQuery,
  useGetPathwayQuery,
  useCreateTopicMutation,
  useCreatePrerequisiteMutation,
  useCreatePrerequisiteSetsMutation
} from '../features/api/apiSlice';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function CreateTopicModal({
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
      setTopicGroup(null);
      setPrereqSets([{ amount: 1, choices: [] }]);
      setDescription('');
      setArchived(false);
      setImageUrl('');
    }
  }, [open]);

  // topic details
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [archived, setArchived] = useState(false);
  const [prereqSets, setPrereqSets] = useState<
    { amount: number; choices: Array<{ id: number; name: string }> }[]
  >([]);
  const [topicGroup, setTopicGroup] = useState<number | null>(null);

  // topic and group select data
  const [formattedGroups, setFormattedGroups] = useState<
    Array<{ value: string; label: string }>
  >([]);
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

  const {
    data: groupsData,
    error: errorGroups,
    isLoading: isLoadingGroups,
    isFetching: isFetchingGroups,
    isSuccess: isSuccessGroups
  } = useGetTopicGroupsQuery(null);

  const [
    createTopic,
    { data: topicCreateData, isSuccess: isSuccessTopicCreate }
  ] = useCreateTopicMutation();

  const [
    createPrerequisiteSets,
    { data: prereqCreateData, isSuccess: isSuccessPrereqCreate }
  ] = useCreatePrerequisiteSetsMutation();

  useEffect(() => {
    if (!isFetchingGroups && isSuccessGroups) {
      setFormattedGroups(
        groupsData.topic_groups.map((group: any) => {
          return {
            value: `${group.id}`,
            label: group.name
          };
        })
      );
    }
  }, [isFetchingGroups]);

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

  useEffect(() => {
    if (topicCreateData && 'topic_id' in topicCreateData) {
      // topic successfully added
      // create any prerequisites
      const verifiedPrereqSets: Array<{
        amount: number;
        choices: number[];
      }> = [];
      prereqSets.forEach((prereqSet) => {
        if (
          prereqSet.amount > 0 &&
          prereqSet.choices.length > 0 &&
          prereqSet.amount <= prereqSet.choices.length
        ) {
          verifiedPrereqSets.push({
            amount: prereqSet.amount,
            choices: prereqSet.choices.map((choice) => choice.id)
          });
        }
      });

      createPrerequisiteSets({
        topic_id: topicCreateData.topic_id,
        sets: verifiedPrereqSets
      });
    }
  }, [topicCreateData]);

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
                      Create Topic
                    </Dialog.Title>
                    {/* Create topic form */}
                    <div className="mt-2">
                      {/* Topic name */}
                      <div className="w-full flex flex-col items-start">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Title*
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
                      {/* Topic group */}
                      <div className="w-full flex flex-col items-start mt-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Topic group
                        </label>
                        <Select
                          name="group"
                          options={formattedGroups}
                          className="basic-multi-select mt-1 block w-full text-sm text-left"
                          classNamePrefix="select"
                          maxMenuHeight={100}
                          onChange={(e) => {
                            if (e) {
                              setTopicGroup(Number(e.value));
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
                      {/* Topic image */}
                      <div className="w-full flex flex-col items-start mt-4">
                        <label
                          htmlFor="image"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Image URL
                        </label>
                        <div className="mt-1 w-full">
                          <input
                            type="text"
                            name="image"
                            id="image"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                          />
                        </div>
                      </div>
                      {/* Topic description */}
                      <div className="w-full flex flex-col items-start mt-4">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <div className="mt-1 w-full">
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
                      {/* Archived */}
                      <div className="w-full flex flex-col items-start mt-4">
                        <div className="mt-1 w-full flex items-center">
                          <label
                            htmlFor="archived"
                            className="block text-sm font-medium text-gray-700 mr-3"
                          >
                            Archived
                          </label>
                          <Switch
                            checked={archived}
                            onChange={setArchived}
                            className={classNames(
                              archived ? 'bg-indigo-600' : 'bg-gray-200',
                              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2'
                            )}
                          >
                            <span className="sr-only">Archived</span>
                            <span
                              aria-hidden="true"
                              className={classNames(
                                archived ? 'translate-x-5' : 'translate-x-0',
                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                              )}
                            />
                          </Switch>
                        </div>
                      </div>
                      {/* Topic prerequisites */}
                      <div className="w-full flex flex-col items-start mt-5">
                        <div className="w-full flex items-center justify-between">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Prerequisites
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
                        {/* Prerequisites */}
                        {prereqSets.length > 0 && (
                          <div className="w-full flex">
                            <div className="flex items-center mr-3 w-1/4">
                              <label className="ml-8 mr-3 block text-sm text-gray-700 text-left">
                                Amount
                              </label>
                            </div>
                            <div className="w-3/4">
                              <label className="w-3/4 block text-sm text-gray-700 text-left">
                                Choices
                              </label>
                            </div>
                          </div>
                        )}
                        {prereqSets.map((set, indx) => {
                          return (
                            <div key={indx} className="w-full flex">
                              <div className="flex items-center mr-3 w-1/4 mt-1">
                                <button
                                  type="button"
                                  className="rounded-full mr-2 items-center justify-center bg-white p-1 text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  onClick={() => {
                                    setPrereqSets([
                                      ...prereqSets.slice(0, indx),
                                      ...prereqSets.slice(indx + 1)
                                    ]);
                                  }}
                                >
                                  <TrashIcon
                                    className="h-5 w-5 text-indigo-600"
                                    aria-hidden="true"
                                  />
                                </button>
                                <div>
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
                                    value={prereqSets[indx].amount}
                                    min={1}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                </div>
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
                                        choices: e.map((prereq: any) => {
                                          return {
                                            id: Number(prereq.value),
                                            name: prereq.label
                                          };
                                        })
                                      },
                                      ...prereqSets.slice(indx + 1)
                                    ]);
                                  }}
                                  value={prereqSets[indx].choices.map(
                                    (choice) => {
                                      return {
                                        value: '' + choice.id,
                                        label: choice.name
                                      };
                                    }
                                  )}
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
                      createTopic({
                        name,
                        topic_group_id: topicGroup,
                        image_url: imageUrl,
                        archived: archived,
                        description: description
                      });
                      setOpen(false);
                    }}
                  >
                    Create Topic
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
