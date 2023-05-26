// Modal to show topic information, outcomes, and edit/delete/archive options when topics are selected in the global pathway

import { Fragment, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import {
  PencilIcon,
  TrashIcon as TrashIconOutline,
  ArchiveBoxIcon as ArchiveBoxIconOutline,
  BookOpenIcon,
  PaperAirplaneIcon as PaperAirplaneIconOutline
} from '@heroicons/react/24/outline';

import {
  PlusIcon as PlusIconMini,
  ArchiveBoxIcon,
  TrashIcon,
  PencilSquareIcon,
  PaperAirplaneIcon
} from '@heroicons/react/20/solid';

import { ErrorAlert, WarningAlert } from '../common/Alert';
import { getButtonGroupStyles } from './topicTreeHelpers';
import Select from 'react-select';
import { Switch } from '@headlessui/react';

import {
  useEditTopicMutation,
  useArchiveTopicMutation,
  useDeleteTopicMutation,
  useGetPathwayQuery,
  useGetTopicGroupsQuery,
  useGetTopicInfoQuery,
  useIsSuperuserQuery
} from '../features/api/apiSlice';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function TopicModal({
  open,
  setOpen,
  topicId
}: {
  open: boolean;
  setOpen: any;
  topicId: number;
}) {
  const navigate = useNavigate();

  const {
    data: topicInfoData,
    error: topicInfoError,
    isLoading: topicInfoIsLoading,
    isSuccess: topicInfoIsSuccess,
    isFetching: topicInfoIsFetching
  } = useGetTopicInfoQuery({
    topic_id: topicId
  });

  const { data: superuserData, error: superuserError } =
    useIsSuperuserQuery(null);

  const cancelButtonRef = useRef(null);

  const [editMode, setEditMode] = useState(false);
  const [archiveMode, setArchiveMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    if (superuserData && superuserData['is_superuser']) {
      setIsSuperuser(true);
    }
  }, [superuserData]);

  useEffect(() => {
    setEditMode(false);
    setArchiveMode(false);
    setDeleteMode(false);
  }, [open]);

  ///////////////
  // Edit form //
  ///////////////

  // topic details
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [prereqSets, setPrereqSets] = useState<
    { amount: number; choices: Array<{ id: number; name: string }> }[]
  >([]);
  const [topicGroup, setTopicGroup] = useState<{
    label: string;
    value: string;
  }>();

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

  const [editTopic, { data: topicEditData, isSuccess: isSuccessEditTopic }] =
    useEditTopicMutation();

  const [archiveTopic, { isSuccess: isSuccessArchiveTopic }] =
    useArchiveTopicMutation();

  const [deleteTopic, { isSuccess: isSuccessTopicDelete }] =
    useDeleteTopicMutation();

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
    if (topicInfoData) {
      setName(topicInfoData.title);
      setImageUrl(topicInfoData.image_url);
      setDescription(topicInfoData.description);

      if (topicInfoData.topic_group) {
        setTopicGroup({
          label: topicInfoData.topic_group.name,
          value: topicInfoData.topic_group.id
        });
      } else {
        setTopicGroup(undefined);
      }

      setPrereqSets(topicInfoData.sets);
    }
  }, [topicInfoData]);

  ///////////////

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
                {topicInfoIsLoading && (
                  <p className="mt-3 text-sm text-gray-700">
                    Loading topic information...
                  </p>
                )}
                {topicInfoError && (
                  <ErrorAlert
                    message="Something went wrong when fetching topic information"
                    description={
                      'error' in topicInfoError ? topicInfoError.error : ''
                    }
                    className="px-3"
                  />
                )}
                {!topicInfoIsLoading && topicInfoIsSuccess && topicInfoData && (
                  <div>
                    <div className="mb-10">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                        {deleteMode && (
                          <TrashIconOutline
                            className="h-6 w-6 text-indigo-600"
                            aria-hidden="true"
                          />
                        )}
                        {archiveMode &&
                          (topicInfoData.archived ? (
                            <PaperAirplaneIconOutline
                              className="h-6 w-6 text-indigo-600"
                              aria-hidden="true"
                            />
                          ) : (
                            <ArchiveBoxIconOutline
                              className="h-6 w-6 text-indigo-600"
                              aria-hidden="true"
                            />
                          ))}
                        {editMode && (
                          <PencilIcon
                            className="h-6 w-6 text-indigo-600"
                            aria-hidden="true"
                          />
                        )}
                        {!(deleteMode || archiveMode || editMode) && (
                          <BookOpenIcon
                            className="h-6 w-6 text-indigo-600"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          {isSuperuser ? (
                            <a
                              title="View topic"
                              className="hover:cursor-pointer"
                              onClick={() => {
                                navigate(`/topic/${topicId}/preparation`);
                              }}
                            >
                              {topicInfoData.title}
                            </a>
                          ) : (
                            topicInfoData.title
                          )}
                        </Dialog.Title>
                        {/* Topic information */}
                        {!editMode && (
                          <div>
                            <p className="mt-4 text-sm text-gray-900">
                              {topicInfoData.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Edit/delete/archive button group */}
                    {isSuperuser && (
                      <div className="w-full mt-5">
                        <div className="w-full flex rounded-md shadow-sm">
                          <button
                            type="button"
                            className={
                              getButtonGroupStyles({
                                active: editMode,
                                leftCorner: true
                              }) + ' grow'
                            }
                            onClick={() => {
                              setEditMode(true);
                              setDeleteMode(false);
                              setArchiveMode(false);
                            }}
                          >
                            <PencilSquareIcon className="w-4 h-4 mr-2" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className={
                              getButtonGroupStyles({
                                active: archiveMode
                              }) + ' grow'
                            }
                            onClick={() => {
                              setArchiveMode(true);
                              setDeleteMode(false);
                              setEditMode(false);
                            }}
                          >
                            {topicInfoData.archived ? (
                              <>
                                <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                                <span>Publish</span>
                              </>
                            ) : (
                              <>
                                <ArchiveBoxIcon className="w-4 h-4 mr-2" />
                                <span>Archive</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            className={
                              getButtonGroupStyles({
                                active: deleteMode,
                                rightCorner: true
                              }) + ' grow'
                            }
                            onClick={() => {
                              setDeleteMode(true);
                              setArchiveMode(false);
                              setEditMode(false);
                            }}
                          >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Edit/delete/archive content */}
                    <div className="w-full mt-5">
                      {deleteMode && (
                        <WarningAlert
                          message="Delete topic"
                          description="This action will permanently delete this topic along with all its resources. Are you sure you want to proceed?"
                          noSpace
                        />
                      )}
                      {archiveMode &&
                        (topicInfoData.archived ? (
                          <WarningAlert
                            message="Publish topic"
                            description="This action will make this topic accessible to all students. Are you sure you want to proceed?"
                            noSpace
                          />
                        ) : (
                          <WarningAlert
                            message="Archive topic"
                            description="This action will make this topic inaccessible to students. Are you sure you want to proceed?"
                            noSpace
                          />
                        ))}
                      {editMode && (
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
                              value={topicGroup}
                              onChange={(e) => {
                                if (e) {
                                  const group = formattedGroups.filter(
                                    (group) => group.value === e.value
                                  )[0];
                                  setTopicGroup(group);
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
                      )}
                    </div>
                    {/* Submit/cancel buttons */}
                    {(deleteMode || archiveMode || editMode) && (
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:col-start-2 sm:text-sm"
                          onClick={() => {
                            if (editMode) {
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
                                    choices: prereqSet.choices.map(
                                      (choice) => choice.id
                                    )
                                  });
                                }
                              });

                              editTopic({
                                id: topicId,
                                name,
                                topic_group_id: topicGroup
                                  ? Number(topicGroup.value)
                                  : null,
                                image_url: imageUrl,
                                description,
                                sets: verifiedPrereqSets
                              });
                            } else if (archiveMode) {
                              archiveTopic({
                                id: Number(topicId),
                                archive: !topicInfoData.archived
                              });
                            } else if (deleteMode) {
                              deleteTopic({ id: Number(topicId) });
                            }

                            setOpen(false);
                          }}
                        >
                          {deleteMode && <span>Delete Topic</span>}
                          {archiveMode &&
                            (topicInfoData.archived ? (
                              <span>Publish Topic</span>
                            ) : (
                              <span>Archive Topic</span>
                            ))}
                          {editMode && <span>Edit Topic</span>}
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
                    )}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
