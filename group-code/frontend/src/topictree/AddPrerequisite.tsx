import React, { useEffect, useState } from 'react';
import { Node, Edge } from 'reactflow';
import {
  checkForLoops,
  checkPrereqs,
  classNames,
  getButtonColors,
  getLabel
} from './topicTreeHelpers';
import Select from 'react-select';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PlusIcon as PlusIconMini, TrashIcon } from '@heroicons/react/20/solid';

import { useCreatePrerequisiteSetsMutation } from '../features/api/apiSlice';
import { PrereqSetT, currPathT, pathwayTopicInfo } from './types';
import { ErrorAlert } from 'common/Alert';
import { GenericGraphAdapter } from 'incremental-cycle-detect';

type AddPrerequisiteProps = {
  globalPathData: {
    data: any;
    error: any;
    isLoading: boolean;
    isFetching: boolean;
    isSuccess: boolean;
  };
  selectedTopic: Node | null;
  pathwayId: number;
  graphForDetectingCycles: GenericGraphAdapter<any, any>;
};

type errorT = {
  [field: string]: { [index: string]: { [prereq_field: string]: string } };
};

export default function AddPrerequisite(props: AddPrerequisiteProps) {
  const [prereqSets, setPrereqSets] = useState<PrereqSetT[]>([]);

  const [targetTopic, setTargetTopic] = useState<{
    value: string;
    label: string;
    archived: boolean;
  } | null>(
    props.selectedTopic
      ? {
          value: props.selectedTopic.id,
          label: getLabel(
            props.selectedTopic.data.status
              ? props.selectedTopic.data.status
              : null,
            props.selectedTopic.data.archived,
            props.selectedTopic.data.label
          ),
          archived: props.selectedTopic.data.archived
        }
      : null
  );

  const [formattedTopics, setFormattedTopics] = useState<
    Array<{ value: string; label: string; archived: boolean }>
  >([]);

  const [error, setError] = useState<errorT | null>(null);

  const [
    createPrerequisiteSets,
    { data: prereqCreateData, isSuccess: isSuccessPrereqCreate }
  ] = useCreatePrerequisiteSetsMutation();

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
  }, [
    props.globalPathData.isFetching,
    props.globalPathData.isSuccess,
    props.globalPathData.data
  ]);

  useEffect(() => {
    if (props.selectedTopic) {
      setTargetTopic({
        value: props.selectedTopic.id,
        label: getLabel(
          props.selectedTopic.data.status
            ? props.selectedTopic.data.status
            : null,
          props.selectedTopic.data.archived,
          props.selectedTopic.data.label
        ),
        archived: props.selectedTopic.data.archived
      });
    } else {
      setTargetTopic(null);
    }
  }, [props.selectedTopic]);

  const resetFormFn = () => {
    setPrereqSets([]);
    setTargetTopic(null);
    setError(null);
  };

  useEffect(() => {
    resetFormFn();
  }, [props.pathwayId]);

  useEffect(() => {
    if (!targetTopic) {
      const newErrorDict: errorT = {
        targetTopic: {
          error: {
            message: 'Target Topic cannot be empty, please select a topic'
          }
        }
      };
      setError((e) => (e ? { ...e, ...newErrorDict } : { ...newErrorDict }));
    } else {
      setError((e) => {
        const currErrorDict = { ...e };
        delete currErrorDict['targetTopic'];
        if (Object.keys(currErrorDict).length === 0) {
          return null;
        } else {
          return { ...currErrorDict };
        }
      });
    }
    if (prereqSets.length === 0) {
      const newErrorDict: errorT = {
        prereqSet: {
          error: {
            message: 'No prerequisite set defined'
          }
        }
      };
      setError((e) => (e ? { ...e, ...newErrorDict } : { ...newErrorDict }));
    } else {
      const prereqCheck = checkPrereqs([], prereqSets, false);
      if (prereqCheck.error) {
        const newErrorDict: errorT = { prereqs: prereqCheck.error };
        setError((e) => {
          const currErrorDict = { ...e, ...newErrorDict };
          delete currErrorDict['prereqSet'];
          return currErrorDict;
        });
      } else {
        setError((e) => {
          const currErrorDict = { ...e };
          delete currErrorDict['prereqs'];
          delete currErrorDict['prereqSet'];
          if (Object.keys(currErrorDict).length === 0) {
            return null;
          } else {
            return { ...currErrorDict };
          }
        });
      }
    }
  }, [targetTopic, prereqSets]);

  return (
    <form>
      <h2 className=" py-1 text-center text-medium font-medium text-gray-600">
        Add New Prerequisite
      </h2>
      <div className="relative transform overflow-hidden rounded-lg px-1 pt-1 pb-1 text-left shadow-xl transition-all">
        <div>
          <div className="mb-5">
            {/* Target topic */}
            <div className="w-full flex flex-col items-start mt-4">
              <label
                htmlFor="target"
                className="block text-sm font-medium text-gray-700"
              >
                Target topic<span className="text-red-600">*</span>
              </label>
              <Select
                name="target"
                options={formattedTopics}
                className="basic-multi-select mt-1 block w-full text-sm text-left"
                classNamePrefix="select"
                maxMenuHeight={100}
                value={targetTopic}
                onChange={(e) => {
                  if (e) {
                    setTargetTopic(e);
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
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor:
                      error && 'targetTopic' in error
                        ? 'rgb(239 68 68)'
                        : state.isFocused
                        ? 'blue'
                        : 'auto'
                  })
                }}
              />
              {error && 'targetTopic' in error && (
                <ErrorAlert
                  message={error['targetTopic']['error']['message']}
                  noSpace
                  className="my-2 px-3 text-left"
                />
              )}
            </div>
            {/* Topic prerequisites */}
            <div className="w-full flex flex-col items-start mt-5">
              <div className="w-full flex items-center justify-between">
                <h3 className="block text-sm font-medium text-gray-700">
                  Prerequisites<span className="text-red-600">*</span>
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
              {error && 'prereqSet' in error && (
                <ErrorAlert
                  message={error['prereqSet']['error']['message']}
                  noSpace
                  className="my-2 px-3 text-left"
                />
              )}
            </div>
          </div>
          {error && (
            <ErrorAlert
              message="Error occured above, please fix before continuing"
              noSpace
              className="mt-4 px-3"
            />
          )}
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
              onClick={(e) => {
                e.preventDefault();
                let loopError = false;
                const setsFinal: Array<{
                  amount: number;
                  choices: number[];
                }> = [];
                if (targetTopic) {
                  const graphForDetectingCycles =
                    props.graphForDetectingCycles.clone();
                  for (const [ind, prereqSet] of prereqSets.entries()) {
                    for (const choice of prereqSet.choices) {
                      if (
                        !checkForLoops(graphForDetectingCycles, 'add', {
                          source: choice.id.toString(),
                          target: targetTopic.value
                        })
                      ) {
                        const prereqs: {
                          prereqs: { [key: string]: { [key: string]: string } };
                        } = { prereqs: {} };
                        prereqs['prereqs'][ind.toString()] = {
                          choices: `Adding prerequisite '${choice.name}' to current topic causes a unfulfillable loop to be created.`
                        };
                        setError(prereqs);
                        loopError = true;
                      }
                    }
                    const setChoices = prereqSet.choices.map(
                      (choice) => choice.id
                    );
                    setsFinal.push({
                      amount: prereqSet.amount,
                      choices: setChoices
                    });
                  }
                }
                if (!error && !loopError && targetTopic) {
                  createPrerequisiteSets({
                    topic_id: Number(targetTopic.value),
                    sets: setsFinal
                  });
                }
              }}
            >
              Add Prerequisites
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
        </div>
      </div>
    </form>
  );
}
