import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useEditPathwayMutation } from 'features/api/apiSlice';
import { CoreAndElecTopicsT, pathwayTopicInfo } from './types';
import {
  findChangesAndErrorsPathway,
  getButtonColors
} from './topicTreeHelpers';
import { ErrorAlert } from 'common/Alert';

type EditPathwayProps = {
  pathwayId: number;
  pathwayName: string;
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
  pathwaysNames: Array<string>;
};

export default function EditPathway(props: EditPathwayProps) {
  const [initialCore, setInitialCore] = useState<CoreAndElecTopicsT>([]);
  const [initialElectives, setInitialElectives] = useState<CoreAndElecTopicsT>(
    []
  );
  const [coreTopics, setCoreTopics] = useState<CoreAndElecTopicsT>([]);
  const [electiveTopics, setElectiveTopics] = useState<CoreAndElecTopicsT>([]);
  const [formattedTopics, setFormattedTopics] = useState<CoreAndElecTopicsT>(
    []
  );

  const [name, setName] = useState<string>(props.pathwayName);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [error, setError] = useState<{ [field: string]: string } | null>(null);

  const [
    editPathway,
    { data: pathwayEditData, isSuccess: isSuccessEditPathway }
  ] = useEditPathwayMutation();

  useEffect(() => {
    if (
      props.currPathData &&
      props.currPathData.data &&
      'id' in props.currPathData.data &&
      props.currPathData.data.id !== null &&
      props.currPathData.data.id !== undefined &&
      props.globalPathData &&
      props.globalPathData.data &&
      'id' in props.globalPathData.data &&
      props.globalPathData.data.id !== null &&
      props.globalPathData.data.id !== undefined
    ) {
      const changeAndError = findChangesAndErrorsPathway(
        name,
        props.pathwayName,
        Number(props.globalPathData.data.id) ===
          Number(props.currPathData.data.id),
        coreTopics,
        electiveTopics,
        initialCore,
        initialElectives,
        props.pathwaysNames
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
    props.pathwayName,
    props.currPathData.data,
    coreTopics,
    electiveTopics,
    initialCore,
    initialElectives,
    props.globalPathData,
    props.pathwaysNames
  ]);

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
              value: `${topic.id}`,
              label: (
                <p
                  title={topic.name}
                  style={{
                    backgroundColor: `${color.backgroundColor}`,
                    color: `${color.textColor}`,
                    borderRadius: '2px',
                    padding: '5px',
                    overflow: 'hidden'
                  }}
                >
                  {topic.name}
                </p>
              )
            };
          })
      );
    }
  }, [props.globalPathData.isFetching, props.globalPathData.data]);

  const resetFormFn = (currPathData: any, pathwayName: string) => {
    if (currPathData.data && pathwayName) {
      const core: any = currPathData.data.core.map(
        (topic: pathwayTopicInfo) => {
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
            value: `${topic.id}`,
            label: (
              <p
                title={topic.name}
                style={{
                  backgroundColor: `${color.backgroundColor}`,
                  color: `${color.textColor}`,
                  borderRadius: '2px',
                  padding: '5px',
                  overflow: 'hidden'
                }}
              >
                {topic.name}
              </p>
            )
          };
        }
      );
      const elec = currPathData.data.electives.map(
        (topic: pathwayTopicInfo) => {
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
            value: `${topic.id}`,
            label: (
              <p
                title={topic.name}
                style={{
                  backgroundColor: `${color.backgroundColor}`,
                  color: `${color.textColor}`,
                  borderRadius: '2px',
                  padding: '5px',
                  overflow: 'hidden'
                }}
              >
                {topic.name}
              </p>
            )
          };
        }
      );
      setName(pathwayName);
      setInitialCore(core);
      setInitialElectives(elec);
      setCoreTopics(core);
      setElectiveTopics(elec);
      setIsChanged(false);
      setError(null);
    }
  };

  useEffect(() => {
    resetFormFn(props.currPathData, props.pathwayName);
  }, [props.currPathData.data, props.pathwayName, props.pathwayId]);

  return (
    <>
      {props.globalPathData.data &&
      'id' in props.globalPathData.data &&
      props.globalPathData.data.id !== null &&
      props.globalPathData.data.id !== undefined ? (
        <>
          {props.pathwayId === Number(props.globalPathData.data.id) ? (
            <h2 className=" py-1 text-center text-medium font-medium text-gray-600">
              Cannot Edit <b>{props.globalPathData.data.name}</b>
            </h2>
          ) : (
            <form>
              <h2 className=" py-1 text-center text-medium font-medium text-gray-600">
                Currently Editing: <b>{props.pathwayName}</b>
              </h2>
              <div className="relative transform overflow-hidden rounded-lg px-1 pt-1 pb-1 text-left shadow-xl transition-all">
                <div className="mb-5">
                  <div className="mt-3 text-center sm:mt-5">
                    {/* Create topic form */}

                    <div className="mt-2">
                      {/* Name */}
                      <div className="w-full flex flex-col items-start mt-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-600"
                        >
                          Name<span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          className={`block w-full rounded-md ${
                            error && 'name' in error
                              ? 'border-red-500'
                              : 'border-gray-300'
                          } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                        {error && 'name' in error && (
                          <ErrorAlert
                            message={error['name']}
                            noSpace
                            className="my-2 px-3 text-left"
                          />
                        )}
                      </div>
                      {/* Core topics */}
                      <div className="w-full flex flex-col items-start mt-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-600"
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
                          value={coreTopics}
                          onChange={(e) => setCoreTopics(Array.from(e))}
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
                                error && 'core' in error
                                  ? 'rgb(239 68 68)'
                                  : state.isFocused
                                  ? 'blue'
                                  : 'auto'
                            })
                          }}
                        />
                        {error && 'core' in error && (
                          <ErrorAlert
                            message={error['core']}
                            noSpace
                            className="my-2 px-3 text-left"
                          />
                        )}
                      </div>
                      {/* Elective topics */}
                      <div className="w-full flex flex-col items-start mt-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-600"
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
                          value={electiveTopics}
                          onChange={(e) => setElectiveTopics(Array.from(e))}
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
                                error && 'elec' in error
                                  ? 'rgb(239 68 68)'
                                  : state.isFocused
                                  ? 'blue'
                                  : 'auto'
                            })
                          }}
                        />
                        {error && 'elec' in error && (
                          <ErrorAlert
                            message={error['elec']}
                            noSpace
                            className="my-2 px-3 text-left"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {error &&
                  ('GlobalPath' in error ? (
                    <ErrorAlert
                      message={error['GlobalPath']}
                      noSpace
                      className="mt-4 px-3"
                    />
                  ) : (
                    <ErrorAlert
                      message="Error occured above, please fix before continuing"
                      noSpace
                      className="mt-4 px-3"
                    />
                  ))}
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
                      if (!error && isChanged) {
                        editPathway({
                          pathway_name: name,
                          pathway_id: props.pathwayId,
                          core: coreTopics.map((c) => parseInt(c.value)),
                          electives: electiveTopics.map((e) =>
                            parseInt(e.value)
                          )
                        });
                      }
                    }}
                  >
                    Edit Pathway
                  </button>
                  <button
                    type="reset"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    onClick={() => {
                      resetFormFn(props.currPathData, props.pathwayName);
                    }}
                  >
                    Reset Form
                  </button>
                </div>
              </div>
            </form>
          )}
        </>
      ) : (
        <h2> Loading ... </h2>
      )}
    </>
  );
}
