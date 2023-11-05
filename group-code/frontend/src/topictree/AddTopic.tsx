import React, { useEffect, useState } from 'react';
import { Node, Edge } from 'reactflow';
import { checkPrereqs, classNames, getLabel } from './topicTreeHelpers';
import Select from 'react-select';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PlusIcon as PlusIconMini, TrashIcon } from '@heroicons/react/20/solid';
import { ErrorAlert, WarningAlert } from '../common/Alert';

import {
  useCreateTopicMutation,
  useCreatePrerequisiteSetsMutation,
  useEditTopicMutation,
  useEditPathwayMutation
} from '../features/api/apiSlice';
import { PrereqSetT, currPathT, pathwayTopicInfo } from './types';
import { Switch } from '@headlessui/react';

type AddTopicProps = {
  globalPathData: {
    data: any;
    error: any;
    isLoading: boolean;
    isFetching: boolean;
    isSuccess: boolean;
  };
  currPathData: {
    data: any;
    error: any;
    isLoading: boolean;
    isFetching: boolean;
    isSuccess: boolean;
  };
  pathwayId: number;
  setSelection: (
    node: Node | string | null,
    edge: Edge | string | null
  ) => void;
  setSelectedSubTab: (tab: 'Topic' | 'Pathway' | 'Pre-requisite') => void;
  setTabOpen: (
    tab: 'none' | 'help' | 'search' | 'details' | 'edit' | 'add' | 'delete'
  ) => void;
};

function checkForError(
  name: string,
  prereqSets: PrereqSetT[],
  topicNames: Array<string>
): {
  [field: string]: { [index: string]: { [prereq_field: string]: string } };
} | null {
  let retval: {
    [field: string]: { [index: string]: { [prereq_field: string]: string } };
  } | null = null;
  if (!name || !/\S/.test(name)) {
    if (!retval) {
      retval = {};
    }
    retval['title'] = {
      error: { message: 'Title is required. Field cannot be empty' }
    };
  } else if (topicNames.includes(name)) {
    if (!retval) {
      retval = {};
    }
    retval['title'] = {
      error: { message: `The title '${name}' is already in use.` }
    };
  }
  const prereqCheck = checkPrereqs([], prereqSets, false);
  if (prereqCheck.error) {
    if (!retval) {
      retval = {};
    }
    retval['prereqs'] = prereqCheck.error;
  }

  return retval;
}

export default function AddTopic(props: AddTopicProps) {
  // topic details
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [archived, setArchived] = useState(false);
  const [addToPathway, setAddToPathway] = useState(false);
  const [prereqSets, setPrereqSets] = useState<PrereqSetT[]>([]);
  const [error, setError] = useState<{
    [field: string]: { [index: string]: { [prereq_field: string]: string } };
  } | null>(null);

  // topic and group select data
  const [formattedTopics, setFormattedTopics] = useState<
    Array<{ value: string; archived: boolean; label: string }>
  >([]);

  const [editTopic, { data: topicEditData, isSuccess: isSuccessEditTopic }] =
    useEditTopicMutation();
  const [
    createTopic,
    { data: topicCreateData, isSuccess: isSuccessTopicCreate }
  ] = useCreateTopicMutation();

  const [
    createPrerequisiteSets,
    { data: prereqCreateData, isSuccess: isSuccessPrereqCreate }
  ] = useCreatePrerequisiteSetsMutation();

  const [
    editPathway,
    { data: pathwayEditData, isSuccess: isSuccessEditPathway }
  ] = useEditPathwayMutation();

  useEffect(() => {
    if (!props.globalPathData.isFetching && props.globalPathData.isSuccess) {
      setFormattedTopics(
        props.globalPathData.data.electives
          .concat(props.globalPathData.data.core)
          .map((topic: pathwayTopicInfo) => {
            return {
              value: topic.id.toString(),
              archived: topic.archived,
              label: getLabel(
                topic.status ? topic.status : null,
                topic.archived,
                topic.name
              )
            };
          })
      );
    }
  }, [props.globalPathData]);

  const resetFormFn = () => {
    setName('');
    setImageUrl('');
    setArchived(false);
    setAddToPathway(false);
    setDescription('');
    setPrereqSets([]);
  };

  useEffect(() => {
    if (props.globalPathData.data) {
      const currentNames: string[] = [];
      currentNames.push(
        ...props.globalPathData.data.core.map((c: any) => c.name)
      );
      currentNames.push(
        ...props.globalPathData.data.electives.map((e: any) => e.name)
      );
      const changeAndError = checkForError(name, prereqSets, currentNames);
      if (!changeAndError) {
        setError(null);
      } else {
        setError(changeAndError);
      }
    }
  }, [name, prereqSets, props.globalPathData]);

  useEffect(() => {
    resetFormFn();
  }, [props.pathwayId]);

  return (
    <form>
      <h2 className=" py-1 text-center text-medium font-medium text-gray-600">
        Add New Topic
      </h2>
      <div className="relative transform overflow-hidden rounded-lg px-1 pt-1 pb-1 text-left shadow-xl transition-all">
        <div>
          <div className="mb-5">
            <div className="w-full flex flex-col items-start">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Title<span className="text-red-600">*</span>
              </label>
              <div className="mt-1 w-full">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className={`block w-full rounded-md ${
                    error && 'title' in error
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                {error && 'title' in error && (
                  <ErrorAlert
                    message={error['title'].error.message}
                    noSpace
                    className="px-3"
                  />
                )}
              </div>
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
            {/* Add to this pathway */}
            {props.currPathData.data &&
              'id' in props.currPathData.data &&
              props.currPathData.data.id !== props.globalPathData.data.id && (
                <div className="w-full flex flex-col items-start mt-4">
                  <WarningAlert
                    message="Adding to Global Pathway"
                    description="If the below is not toggled on, this topic will be added to only the global pathway. Toggle to additionally add to current pathway"
                    className="mt-4"
                    noSpace
                  />
                  <div className="mt-1 w-full flex items-center">
                    <label
                      htmlFor="archived"
                      className="block text-sm font-medium text-gray-700 mr-3"
                    >
                      Add to this pathway
                    </label>
                    <Switch
                      checked={addToPathway}
                      onChange={setAddToPathway}
                      className={classNames(
                        addToPathway ? 'bg-indigo-600' : 'bg-gray-200',
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2'
                      )}
                    >
                      <span className="sr-only">Add To Pathway</span>
                      <span
                        aria-hidden="true"
                        className={classNames(
                          addToPathway ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                        )}
                      />
                    </Switch>
                  </div>
                </div>
              )}
            {/* Topic prerequisites */}
            <div className="w-full flex flex-col items-start mt-5">
              <div className="w-full flex items-center justify-between">
                <h3 className="block text-sm font-medium text-gray-700">
                  Prerequisites
                </h3>
              </div>
              {/* Prerequisites */}
              {prereqSets.map((set, indx) => {
                return (
                  <div key={indx}>
                    <div
                      className={`${
                        error &&
                        'prereqs' in error &&
                        indx.toString() in error['prereqs']
                          ? 'border-red-500'
                          : 'border-gray-300'
                      } w-full flex rounded border-2 p-2 items-stretch`}
                    >
                      <div className="mr-3 mt-1">
                        <button
                          type="button"
                          className="items-center justify-center bg-red-500 rounded-md p-1 text-gray-900 shadow-sm hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 h-full"
                          onClick={() => {
                            setPrereqSets([
                              ...prereqSets.slice(0, indx),
                              ...prereqSets.slice(indx + 1)
                            ]);
                          }}
                        >
                          <TrashIcon
                            className="h-5 w-5 text-white"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 text-left">
                          Amount
                        </label>
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
                        <label className="block text-sm text-gray-700 text-left">
                          Choices
                        </label>
                        <div>
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
                                      name: prereq.label.props.title,
                                      archived: prereq.archived,
                                      status: prereq.status
                                    };
                                  })
                                },
                                ...prereqSets.slice(indx + 1)
                              ]);
                            }}
                            value={prereqSets[indx].choices.map((choice) => {
                              return {
                                value: choice.id.toString(),
                                label: getLabel(
                                  choice.status ? choice.status : null,
                                  choice.archived,
                                  choice.name
                                ),
                                archived: choice.archived
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
                    {error &&
                      'prereqs' in error &&
                      indx.toString() in error['prereqs'] &&
                      ('choices' in error['prereqs'][indx.toString()] ? (
                        <ErrorAlert
                          message={error['prereqs'][indx.toString()]['choices']}
                          noSpace
                          className="px-3"
                        />
                      ) : (
                        <ErrorAlert
                          message={error['prereqs'][indx.toString()]['amount']}
                          noSpace
                          className="px-3"
                        />
                      ))}
                  </div>
                );
              })}
              <button
                type="button"
                className="inline-flex justify-center items-center rounded-md w-full border border-transparent bg-indigo-600 p-1 text-white text-sm mt-2 shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
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
                Add Prerequisite set
                <PlusIconMini className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          {error && (
            <ErrorAlert
              message="Error occured above, please fix before continuing"
              noSpace
              className="mt-4 px-3"
            />
          )}
          {props.currPathData.data && 'id' in props.currPathData.data && (
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="submit"
                className={`inline-flex w-full justify-center rounded-md border border-transparent ${
                  !error ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-800'
                } px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:col-start-2 sm:text-sm`}
                disabled={error ? true : false}
                title={`${
                  error
                    ? 'Please fix error above before continuing'
                    : 'submit changes'
                }`}
                onClick={async (e) => {
                  e.preventDefault();
                  if (!error) {
                    const r = await createTopic({
                      name,
                      topic_group_id: null,
                      image_url: imageUrl,
                      archived: archived,
                      description: description
                    });
                    if ('data' in r && 'topic_id' in r['data']) {
                      const formattedPrereqSets: Array<{
                        amount: number;
                        choices: number[];
                      }> = prereqSets.map((prereqSet) => {
                        return {
                          amount: prereqSet.amount,
                          choices: prereqSet.choices.map((choice) => choice.id)
                        };
                      });
                      await editTopic({
                        id: Number(r['data']['topic_id']),
                        name,
                        topic_group_id: null,
                        image_url: imageUrl,
                        description,
                        sets: formattedPrereqSets
                      });
                      if (addToPathway) {
                        const elecs: Array<number> =
                          props.currPathData.data.electives.map((e: any) =>
                            Number(e.id)
                          );
                        elecs.push(Number(r['data']['topic_id']));
                        await editPathway({
                          pathway_name: props.currPathData.data.name,
                          pathway_id: Number(props.currPathData.data.id),
                          core: props.currPathData.data.core.map((c: any) =>
                            Number(c.id)
                          ),
                          electives: elecs
                        });
                      }
                      props.setTabOpen('details');
                      props.setSelectedSubTab('Pathway');
                    }
                  }
                }}
              >
                Create Topic
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                onClick={() => {
                  resetFormFn();
                }}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
