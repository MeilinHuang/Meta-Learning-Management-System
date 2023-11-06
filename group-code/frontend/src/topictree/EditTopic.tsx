import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {
  checkForLoops,
  findChangesAndErrorsTopic,
  getButtonColors
} from './topicTreeHelpers';
import { Node } from 'reactflow';
import { ErrorAlert } from 'common/Alert';
import {
  PencilIcon,
  PlusIcon as PlusIconMini,
  TrashIcon
} from '@heroicons/react/24/outline';

import {
  useEditTopicMutation,
  useArchiveTopicMutation
} from '../features/api/apiSlice';
import { PrereqSetT, pathwayTopicInfo } from './types';
import { GenericGraphAdapter, GraphlibAdapter } from 'incremental-cycle-detect';

type EditTopicProps = {
  isSuperuser: boolean;
  selectedTopic: Node;
  pathwayId: number;
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
  currTopicData: {
    data: any;
    error: any;
    isLoading: boolean;
    isFetching: boolean;
    isSuccess: boolean;
  };
  graphForDetectingCycles: GenericGraphAdapter<any, any>;
};

export default function EditTopic(props: EditTopicProps) {
  // topic details
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [origPrereqSets, setOrigPrereqSets] = useState<PrereqSetT[]>([]);
  const [prereqSets, setPrereqSets] = useState<PrereqSetT[]>([]);
  const [formattedTopics, setFormattedTopics] = useState<
    Array<{ value: string; archived: boolean; label: string }>
  >([]);

  const [editTopic, { data: topicEditData, isSuccess: isSuccessEditTopic }] =
    useEditTopicMutation();

  const [archiveTopic, { isSuccess: isSuccessArchiveTopic }] =
    useArchiveTopicMutation();

  const [error, setError] = useState<{
    [key: string]: { [index: string]: { [field: string]: string } };
  } | null>(null);

  const [isChanged, setIsChanged] = useState<boolean>(false);

  const resetFormFn = (currTopicData: any) => {
    if (currTopicData.data) {
      setName(currTopicData.data.title);
      setImageUrl(currTopicData.data.image_url);
      setDescription(currTopicData.data.description);
      const newPrereqSets = props.selectedTopic.data.prereqSets.map(
        (s: any) => {
          return {
            amount: s.amount,
            choices: s.choices.map((c: any) => {
              return {
                id: c.id,
                name: c.sourceName,
                archived: c.archivedSource,
                status: c.statusSource
              };
            })
          };
        }
      );
      setPrereqSets(newPrereqSets);
      setOrigPrereqSets(newPrereqSets);
      setIsChanged(false);
      setError(null);
    }
  };

  useEffect(() => {
    if (
      props.currTopicData &&
      props.currTopicData.data &&
      props.globalPathData &&
      props.globalPathData.data
    ) {
      const changeAndError = findChangesAndErrorsTopic(
        name,
        imageUrl,
        description,
        origPrereqSets,
        prereqSets,
        props.currTopicData.data,
        props.globalPathData.data
      );
      setIsChanged(changeAndError.change);
      if (!changeAndError.error) {
        setError(null);
      } else {
        setError(changeAndError.error);
      }
    } else {
      setIsChanged(false);
      setError(null);
    }
  }, [
    name,
    imageUrl,
    description,
    origPrereqSets,
    prereqSets,
    props.currTopicData.data,
    props.globalPathData.data
  ]);

  useEffect(() => {
    resetFormFn(props.currTopicData);
  }, [props.pathwayId, props.currTopicData]);

  useEffect(() => {
    if (!props.globalPathData.isFetching && props.globalPathData.isSuccess) {
      setFormattedTopics(
        props.globalPathData.data.electives
          .concat(props.globalPathData.data.core)
          .map((topic: pathwayTopicInfo) => {
            const color = getButtonColors(
              topic.status as
                | null
                | 'available'
                | 'unavailable'
                | 'complete'
                | 'in-progress',
              topic.archived
            );
            return {
              value: topic.id.toString(),
              archived: topic.archived,
              label: (
                <p
                  title={topic.name}
                  style={{
                    backgroundColor: `${color.backgroundColor}`,
                    color: `${color.textColor}`,
                    borderRadius: '2px',
                    padding: '5px',
                    overflowX: 'hidden',
                    overflowY: 'hidden'
                  }}
                >
                  {topic.name}
                </p>
              )
            };
          })
      );
    }
  }, [props.globalPathData.isFetching]);

  return (
    <form>
      {props.currTopicData.isLoading && (
        <p className="mt-3 text-sm text-gray-700">
          Loading topic information...
        </p>
      )}
      {props.currTopicData.error && (
        <ErrorAlert
          message="Something went wrong when fetching prerequisite information"
          description={
            'error' in props.currTopicData.error
              ? props.currTopicData.error.error
              : ''
          }
          className="px-3"
        />
      )}
      {props.currTopicData && props.currTopicData.isSuccess && (
        <>
          <h2 className=" py-1 text-center text-medium font-medium text-gray-600">
            Currently Editing Topic: <b>{props.selectedTopic.data.label}</b>
          </h2>
          <div className="relative transform overflow-hidden rounded-lg px-1 pt-1 pb-1 text-left shadow-xl transition-all">
            <div>
              {/* Edit content */}
              <div className="w-full">
                <div className="mt-2">
                  {/* Topic name */}
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
                                  value={prereqSets[indx].choices.map(
                                    (choice) => {
                                      const color = getButtonColors(
                                        choice.status as
                                          | null
                                          | 'available'
                                          | 'unavailable'
                                          | 'complete'
                                          | 'in-progress',
                                        choice.archived
                                      );
                                      return {
                                        value: choice.id.toString(),
                                        label: (
                                          <p
                                            title={choice.name}
                                            style={{
                                              backgroundColor: `${color.backgroundColor}`,
                                              color: `${color.textColor}`,
                                              borderRadius: '2px'
                                            }}
                                          >
                                            {choice.name}
                                          </p>
                                        ) as unknown as string,
                                        archived: choice.archived
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
                          </div>
                          {error &&
                            'prereqs' in error &&
                            indx.toString() in error['prereqs'] &&
                            ('choices' in error['prereqs'][indx.toString()] ? (
                              <ErrorAlert
                                message={
                                  error['prereqs'][indx.toString()]['choices']
                                }
                                noSpace
                                className="px-3"
                              />
                            ) : (
                              <ErrorAlert
                                message={
                                  error['prereqs'][indx.toString()]['amount']
                                }
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
              </div>
              {error && (
                <ErrorAlert
                  message="Error occured above, please fix before continuing"
                  noSpace
                  className="mt-4 px-3"
                />
              )}
              {/* Submit/cancel buttons */}
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="submit"
                  className={`inline-flex w-full justify-center rounded-md border border-transparent ${
                    isChanged && (error ? false : true)
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-gray-800'
                  } px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:col-start-2 sm:text-sm`}
                  disabled={!isChanged || (error ? true : false)}
                  title={`${
                    error
                      ? 'Please fix error above before continuing'
                      : isChanged
                      ? 'submit changes'
                      : 'no changes to make'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    //check for loops
                    const graphForDetectingCycles =
                      props.graphForDetectingCycles.clone();
                    for (const prereq of origPrereqSets) {
                      for (const choice of prereq.choices) {
                        checkForLoops(graphForDetectingCycles, 'remove', {
                          source: choice.id.toString(),
                          target: props.selectedTopic.id.toString()
                        });
                      }
                    }
                    let loopError = false;
                    for (const [ind, prereqSet] of prereqSets.entries()) {
                      for (const choice of prereqSet.choices) {
                        if (
                          !checkForLoops(graphForDetectingCycles, 'add', {
                            source: choice.id.toString(),
                            target: props.selectedTopic.id.toString()
                          })
                        ) {
                          const prereqs: {
                            prereqs: {
                              [key: string]: { [key: string]: string };
                            };
                          } = { prereqs: {} };
                          prereqs['prereqs'][ind.toString()] = {
                            choices: `Adding prerequisite '${choice.name}' to current topic causes a unfulfillable loop to be created.`
                          };
                          const newError = {
                            ...error,
                            ...prereqs
                          };
                          setError(newError);
                          loopError = true;
                        }
                      }
                    }
                    if (!error && !loopError) {
                      const formattedPrereqSets: Array<{
                        amount: number;
                        choices: number[];
                      }> = prereqSets.map((prereqSet) => {
                        return {
                          amount: prereqSet.amount,
                          choices: prereqSet.choices.map((choice) => choice.id)
                        };
                      });
                      editTopic({
                        id: Number(props.selectedTopic.id),
                        name,
                        topic_group_id: null,
                        image_url: imageUrl,
                        description,
                        sets: formattedPrereqSets
                      });
                    }
                  }}
                >
                  Edit Topic
                </button>
                <button
                  type="reset"
                  className="mt-3 inline-flex w-full justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                  onClick={() => {
                    resetFormFn(props.currTopicData);
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </form>
  );
}
