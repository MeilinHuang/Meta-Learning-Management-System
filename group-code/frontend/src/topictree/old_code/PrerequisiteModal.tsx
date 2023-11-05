import { Fragment, useEffect, useRef, useState } from 'react';
import { Listbox, Dialog, Transition } from '@headlessui/react';
import {
  BookOpenIcon,
  PencilIcon,
  TrashIcon as TrashIconOutline
} from '@heroicons/react/24/outline';

import { TrashIcon, PencilSquareIcon } from '@heroicons/react/20/solid';

import Select from 'react-select';
import { ErrorAlert, WarningAlert } from '../../common/Alert';

import {
  useGetPathwayQuery,
  useGetPrerequisiteInfoQuery,
  useEditPrerequisiteMutation,
  useDeletePrerequisiteMutation,
  useIsSuperuserQuery
} from '../../features/api/apiSlice';
import { getButtonGroupStyles } from '../topicTreeHelpers';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function PrerequisiteModal({
  open,
  setOpen,
  prereqId,
  sourceName,
  targetName
}: {
  open: boolean;
  setOpen: any;
  prereqId: number;
  sourceName: string;
  targetName: string;
}) {
  const cancelButtonRef = useRef(null);

  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);

  const [prereqSet, setPrereqSet] = useState<{
    amount: number;
    choices: Array<{ id: number; name: string }>;
  }>({ amount: 1, choices: [] });

  const [targetTopic, setTargetTopic] = useState<{
    value: string;
    label: string;
  }>();

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

  const { data: superuserData, error: superuserError } =
    useIsSuperuserQuery(null);

  const [
    editPrerequisite,
    { data: prereqEditData, isSuccess: isSuccessEditPrerq }
  ] = useEditPrerequisiteMutation();

  const [
    deletePrerequisite,
    { data: prereqDeleteData, isSuccess: isSuccessDeletePrereq }
  ] = useDeletePrerequisiteMutation();

  useEffect(() => {
    if (superuserData && superuserData['is_superuser']) {
      setIsSuperuser(true);
    }
  }, [superuserData]);

  useEffect(() => {
    setEditMode(false);
    setDeleteMode(false);
  }, [open]);

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

  const {
    data: prereqInfoData,
    error: prereqInfoError,
    isLoading: prereqInfoIsLoading,
    isSuccess: prereqInfoIsSuccess
  } = useGetPrerequisiteInfoQuery({ prerequisite_id: prereqId });

  useEffect(() => {
    if (prereqInfoData) {
      setTargetTopic({
        label: prereqInfoData.target_name,
        value: '' + prereqInfoData.target_id
      });
      setPrereqSet({
        amount: prereqInfoData.amount,
        choices: prereqInfoData.choices
      });
    }
  }, [prereqInfoData]);

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
                {prereqInfoIsLoading && (
                  <p className="mt-3 text-sm text-gray-700">
                    Loading prerequisite information...
                  </p>
                )}
                {prereqInfoError && (
                  <ErrorAlert
                    message="Something went wrong when fetching prerequisite information"
                    description={
                      'error' in prereqInfoError ? prereqInfoError.error : ''
                    }
                    className="px-3"
                  />
                )}
                {!prereqInfoIsLoading && prereqInfoIsSuccess && prereqInfoData && (
                  <div>
                    <div className="mb-5">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                        {editMode && (
                          <PencilIcon
                            className="h-6 w-6 text-indigo-600"
                            aria-hidden="true"
                          />
                        )}
                        {deleteMode && (
                          <TrashIconOutline
                            className="h-6 w-6 text-indigo-600"
                            aria-hidden="true"
                          />
                        )}
                        {!editMode && !deleteMode && (
                          <BookOpenIcon
                            className="h-6 w-6 text-indigo-600"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className="text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          {sourceName} → {targetName}
                        </Dialog.Title>
                        {/* Prerequisite information */}
                        {!editMode && (
                          <div className="mt-3 w-full flex justify-center">
                            <div className="w-1/2">
                              {prereqSet.choices.length > 1 && (
                                <div className="text-left text-sm text-gray-700 leading-6">
                                  Choose {prereqSet.amount} from the following
                                  topics:
                                  <ul className="list-disc">
                                    {prereqSet.choices.map((choice) => {
                                      return <li>{choice.name}</li>;
                                    })}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {/* Edit / delete toggle */}
                        {isSuperuser && (
                          <div className="w-full flex mt-5">
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
                              }}
                            >
                              <PencilSquareIcon className="w-4 h-4 mr-2" />
                              <span>Edit</span>
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
                                setEditMode(false);
                              }}
                            >
                              <TrashIcon className="w-4 h-4 mr-2" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}

                        {/* Edit prerequisite form */}
                        {editMode && (
                          <div className="mt-5">
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
                                value={targetTopic}
                                onChange={(e: any) => {
                                  setTargetTopic(e);
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
                                  Prerequisite set
                                </label>
                              </div>
                              {/* Labels - amount and choices */}
                              <div className="w-full flex mt-2">
                                <div className="mr-3 w-1/4">
                                  <label className="block mb-1 text-sm text-gray-700 text-left">
                                    Amount
                                  </label>
                                  <input
                                    onChange={(e) =>
                                      setPrereqSet({
                                        ...prereqSet,
                                        amount: Number(e.target.value)
                                      })
                                    }
                                    value={prereqSet.amount}
                                    type="number"
                                    min={1}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div className="w-3/4">
                                  <label className="block mb-1 text-sm text-gray-700 text-left">
                                    Choices
                                  </label>
                                  <Select
                                    name="prerequisites"
                                    options={formattedTopics}
                                    isMulti
                                    className="basic-multi-select block w-full text-sm text-left"
                                    classNamePrefix="select"
                                    maxMenuHeight={90}
                                    onChange={(e) => {
                                      setPrereqSet({
                                        amount: prereqSet.amount,
                                        choices: e.map(
                                          (prereq: {
                                            label: string;
                                            value: string;
                                          }) => {
                                            return {
                                              id: Number(prereq.value),
                                              name: prereq.label
                                            };
                                          }
                                        )
                                      });
                                    }}
                                    value={prereqSet.choices.map((choice) => {
                                      return {
                                        value: '' + choice.id,
                                        label: choice.name
                                      };
                                    })}
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
                        )}

                        {/* Delete prerequisite form */}
                        {deleteMode && (
                          <WarningAlert
                            message="Delete prerequisite"
                            description="This action will permanently delete this prerequisite set. Are you sure you want to proceed?"
                            className="text-left mt-5"
                            noSpace
                          />
                        )}
                      </div>
                    </div>
                    {(editMode || deleteMode) && (
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:col-start-2 sm:text-sm"
                          onClick={() => {
                            if (editMode) {
                              if (
                                prereqSet.amount > 0 &&
                                prereqSet.choices.length > 0 &&
                                prereqSet.amount <= prereqSet.choices.length
                              ) {
                                editPrerequisite({
                                  prerequisite_id: prereqId,
                                  topic:
                                    targetTopic && Number(targetTopic.value),
                                  amount: prereqSet.amount,
                                  choices: prereqSet.choices.map(
                                    (choice) => choice.id
                                  )
                                });
                              }
                            } else if (deleteMode) {
                              deletePrerequisite({ id: prereqId });
                            }

                            setOpen(false);
                          }}
                        >
                          {editMode
                            ? 'Edit Prerequisite'
                            : 'Delete Prerequisite'}
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
