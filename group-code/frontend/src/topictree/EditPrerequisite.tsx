import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { useEditPrerequisiteMutation } from 'features/api/apiSlice';
import { ErrorAlert } from 'common/Alert';
import { Edge, Node } from 'reactflow';
import { PencilIcon } from '@heroicons/react/24/outline';
import { checkForLoops, checkPrereqs, getLabel } from './topicTreeHelpers';

import { PrereqSetT, pathwayTopicInfo } from './types';
import { GenericGraphAdapter } from 'incremental-cycle-detect';

type EditPrerequisiteProps = {
  isSuperuser: boolean;
  selectedPrereq: Edge;
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
  graphForDetectingCycles: GenericGraphAdapter<any, any>;
};

export default function EditPrerequisite(props: EditPrerequisiteProps) {
  const [prereqSet, setPrereqSet] = useState<PrereqSetT>({
    amount: props.selectedPrereq.data.amount as number,
    choices: props.selectedPrereq.data.choices as Array<{
      id: number;
      name: string;
      archived: boolean;
      status: null | 'available' | 'unavailable' | 'complete' | 'in-progress';
    }>
  });

  const [origPrereqSet, setOrigPrereqSet] = useState<PrereqSetT>({
    amount: props.selectedPrereq.data.amount as number,
    choices: props.selectedPrereq.data.choices as Array<{
      id: number;
      name: string;
      archived: boolean;
      status: null | 'available' | 'unavailable' | 'complete' | 'in-progress';
    }>
  });

  const [formattedTopics, setFormattedTopics] = useState<
    Array<{
      value: string;
      label: any;
      archived: boolean;
      status: null | 'available' | 'unavailable' | 'complete' | 'in-progress';
    }>
  >([]);

  const [targetVal, setTargetVal] = useState<{ label: any; value: string }>({
    label: getLabel(
      props.selectedPrereq.data.statusTarget
        ? props.selectedPrereq.data.statusTarget
        : null,
      props.selectedPrereq.data.archivedTarget,
      props.selectedPrereq.data.targetName
    ),
    value: props.selectedPrereq.target
  });
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [error, setError] = useState<{ [key: string]: string } | null>(null);

  const [
    editPrerequisite,
    { data: prereqEditData, isSuccess: isSuccessEditPrerq }
  ] = useEditPrerequisiteMutation();

  const resetFormFn = (selectedPrereq: Edge) => {
    if (selectedPrereq) {
      const prerequisiteSet: PrereqSetT = {
        amount: selectedPrereq.data.amount as number,
        choices: selectedPrereq.data.choices.map((c: any) => {
          return {
            id: c.id,
            name: c.sourceName,
            archived: c.archivedSource,
            status: c.statusSource
          };
        })
      };
      setPrereqSet(prerequisiteSet);
      setOrigPrereqSet(prerequisiteSet);
      setTargetVal({
        label: getLabel(
          selectedPrereq.data.statusTarget
            ? props.selectedPrereq.data.statusTarget
            : null,
          selectedPrereq.data.archivedTarget,
          selectedPrereq.data.targetName
        ),
        value: selectedPrereq.target
      });
      setIsChanged(false);
      setError(null);
    }
  };

  const setDropDownListOfTopics = (globalPathData: any) => {
    setFormattedTopics(
      globalPathData.data.core
        .concat(globalPathData.data.electives)
        .map((topic: pathwayTopicInfo) => {
          return {
            value: `${topic.id}`,
            label: getLabel(
              topic.status ? topic.status : null,
              topic.archived,
              topic.name
            ),
            archived: topic.archived,
            status: topic.status
          };
        })
    );
  };

  useEffect(() => {
    if (!props.globalPathData.isFetching && props.globalPathData.isSuccess) {
      setDropDownListOfTopics(props.globalPathData);
    }
  }, [props.globalPathData.isFetching, props.globalPathData.data]);

  useEffect(() => {
    resetFormFn(props.selectedPrereq);
  }, [props.selectedPrereq, props.pathwayId]);

  useEffect(() => {
    if (props.selectedPrereq && props.selectedPrereq.data) {
      const origTargetValue = {
        label: getLabel(
          props.selectedPrereq.data.statusTarget
            ? props.selectedPrereq.data.statusTarget
            : null,
          props.selectedPrereq.data.archivedTarget,
          props.selectedPrereq.data.targetName
        ),
        value: props.selectedPrereq.target
      };
      let changedFlag = false;
      if (targetVal.value !== origTargetValue.value) {
        changedFlag = true;
      } else if (
        prereqSet.amount !== (props.selectedPrereq.data.amount as number)
      ) {
        changedFlag = true;
      }
      const prereqsCheck = checkPrereqs([origPrereqSet], [prereqSet], true);
      setIsChanged(prereqsCheck.change || changedFlag);
      if (prereqsCheck.error) {
        if ('0' in prereqsCheck.error && 'amount' in prereqsCheck.error['0']) {
          setError({ ...error, amount: prereqsCheck.error['0']['amount'] });
        }
        if ('0' in prereqsCheck.error && 'choices' in prereqsCheck.error['0']) {
          setError({ ...error, choices: prereqsCheck.error['0']['choices'] });
        }
      } else {
        setError(null);
      }
    } else {
      setIsChanged(false);
      setError(null);
    }
  }, [targetVal, prereqSet]);

  return (
    <form>
      <h2 className=" py-1 text-center text-medium font-medium text-gray-600">
        Currently Editing Prerequsite: <b>{props.selectedPrereq.data.label}</b>
      </h2>
      <div className="relative transform overflow-hidden rounded-lg px-1 pt-1 pb-1 text-left shadow-xl transition-all">
        <div>
          <div className="mb-5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
              <PencilIcon
                className="h-6 w-6 text-indigo-600"
                aria-hidden="true"
              />
            </div>
            <div className="text-center sm:mt-5">
              {/* Edit prerequisite form */}
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
                    value={targetVal}
                    onChange={(e: any) => {
                      setTargetVal(e);
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
                  <div className="w-full flex flex-col mt-2">
                    <div>
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
                        className={`block w-full rounded-md ${
                          error && 'amount' in error
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } focus:border-indigo-500 focus:ring-indigo-500 shadow-sm sm:text-sm`}
                      />
                      {error && 'amount' in error && (
                        <ErrorAlert
                          message={error['amount']}
                          noSpace
                          className="px-3 text-left"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block my-1 text-sm text-gray-700 text-left">
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
                            choices: e.map((prereq: any) => {
                              return {
                                id: Number(prereq.value),
                                name: prereq.label.props.title,
                                archived: prereq.archived,
                                status: prereq.status
                              };
                            })
                          });
                        }}
                        value={prereqSet.choices.map((choice) => {
                          return {
                            value: choice.id.toString(),
                            label: getLabel(
                              choice.status ? choice.status : null,
                              choice.archived,
                              choice.name
                            ),
                            archived: choice.archived,
                            status: choice.status
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
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderColor:
                              error && 'choices' in error
                                ? 'rgb(239 68 68)'
                                : state.isFocused
                                ? 'blue'
                                : 'auto'
                          })
                        }}
                      />
                      {error && 'choices' in error && (
                        <ErrorAlert
                          message={error['choices']}
                          noSpace
                          className="my-2 px-3 text-left"
                        />
                      )}
                    </div>
                  </div>
                </div>
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
              onClick={async (e) => {
                e.preventDefault();
                const graphForDetectingCycles =
                  props.graphForDetectingCycles.clone();
                for (const choice of origPrereqSet.choices) {
                  checkForLoops(graphForDetectingCycles, 'remove', {
                    source: choice.id.toString(),
                    target: props.selectedPrereq.target.toString()
                  });
                }
                let loopError = false;
                for (const choice of prereqSet.choices) {
                  if (
                    !checkForLoops(graphForDetectingCycles, 'add', {
                      source: choice.id.toString(),
                      target: targetVal.value
                    })
                  ) {
                    setError({
                      ...error,
                      choices: `Adding prerequisite '${choice.name}' to '${targetVal.label.props.title}' causes a unfulfillable loop to be created.`
                    });
                    loopError = true;
                  }
                }
                if (!error && !loopError) {
                  const newPrereqSet = prereqSet.choices.map((choice) =>
                    Number(choice.id)
                  );
                  const r = await editPrerequisite({
                    prerequisite_id: parseInt(
                      props.selectedPrereq.data.prereqSetId
                    ),
                    topic: Number(targetVal.value),
                    amount: prereqSet.amount,
                    choices: newPrereqSet
                  });
                }
              }}
            >
              Edit Prerequisite
            </button>
            <button
              type="reset"
              className="mt-3 inline-flex w-full justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
              onClick={() => {
                resetFormFn(props.selectedPrereq);
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
