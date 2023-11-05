import React, { useEffect, useState } from 'react';
import Select from 'react-select';

import { useCreatePathwayMutation } from '../features/api/apiSlice';
import { CoreAndElecTopicsT, currPathT, pathwayTopicInfo } from './types';
import { ErrorAlert } from 'common/Alert';
import { getButtonColors } from './topicTreeHelpers';

type AddPathwayProps = {
  globalPathData: {
    data: any;
    error: any;
    isLoading: boolean;
    isFetching: boolean;
    isSuccess: boolean;
  };
  setCurrPath: (currPath: currPathT) => void;
  setTabOpen: (
    tab: 'none' | 'help' | 'search' | 'details' | 'edit' | 'add' | 'delete'
  ) => void;
  setSelectedSubTab: (tab: 'Topic' | 'Pathway' | 'Pre-requisite') => void;
  pathwaysNames: Array<string>;
  pathwayId: number;
};

function checkForError(
  name: string,
  pathwaysNames: Array<string>,
  coreTopicIds: number[],
  elecTopicIds: number[]
): { [field: string]: string } | null {
  let retval: { [field: string]: string } | null = null;
  if (!name || !/\S/.test(name)) {
    if (!retval) {
      retval = {};
    }
    retval['name'] = 'Name required. Field cannot be empty';
  } else if (pathwaysNames.includes(name)) {
    if (!retval) {
      retval = {};
    }
    retval['name'] = `The name '${name}' is already in use.`;
  }
  const filteredArray = coreTopicIds.filter((value) =>
    elecTopicIds.includes(value)
  );
  if (filteredArray.length !== 0) {
    if (!retval) {
      retval = {};
    }
    retval['elec'] = 'A topic cannot be both an elective and a core.';
  }
  return retval;
}

export default function AddPathway(props: AddPathwayProps) {
  const [name, setName] = useState('');
  const [coreTopics, setCoreTopics] = useState<CoreAndElecTopicsT>([]);
  const [electiveTopics, setElectiveTopics] = useState<CoreAndElecTopicsT>([]);
  const [error, setError] = useState<{ [field: string]: string } | null>(null);
  const [formattedTopics, setFormattedTopics] = useState<CoreAndElecTopicsT>(
    []
  );

  const [
    createPathway,
    { data: pathwayCreateData, isSuccess: isSuccessCreatePathway }
  ] = useCreatePathwayMutation();

  const resetFormFn = () => {
    setName('');
    setCoreTopics([]);
    setElectiveTopics([]);
    setError(null);
  };

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
              ) as unknown as HTMLElement
            };
          })
      );
    }
  }, [props.globalPathData.isFetching]);

  useEffect(() => {
    const changeAndError = checkForError(
      name,
      props.pathwaysNames,
      coreTopics.map((c) => Number(c.value)),
      electiveTopics.map((e) => Number(e.value))
    );
    if (!changeAndError) {
      setError(null);
    } else {
      setError(changeAndError);
    }
  }, [name, coreTopics, electiveTopics, props.pathwaysNames]);

  useEffect(() => {
    resetFormFn();
  }, [props.pathwayId]);

  return (
    <form>
      <h2 className=" py-1 text-center text-medium font-medium text-gray-600">
        Add New Pathway
      </h2>
      <div className="relative transform overflow-hidden rounded-lg px-1 pt-1 pb-1 text-left shadow-xl transition-all">
        <div>
          <div className="mb-5">
            <div className="w-full flex flex-col items-start">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Pathway name<span className="text-red-600">*</span>
              </label>
              <div className="mt-1 w-full">
                <input
                  type="text"
                  name="name"
                  id="name"
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
          {error && (
            <ErrorAlert
              message="Error occured above, please fix before continuing"
              noSpace
              className="mt-4 px-3"
            />
          )}
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
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
                  const newCores = coreTopics.map((topic: any) =>
                    Number(topic.value)
                  );
                  const newElecs = electiveTopics.map((topic: any) =>
                    Number(topic.value)
                  );
                  const r = await createPathway({
                    name,
                    core: newCores,
                    electives: newElecs
                  });
                  props.setCurrPath({
                    id: Number(r['data']['pathway_id']),
                    name,
                    user: true
                  });
                  props.setSelectedSubTab('Pathway');
                  props.setTabOpen('details');
                }
              }}
            >
              Create Pathway
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
