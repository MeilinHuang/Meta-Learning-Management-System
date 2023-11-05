import React, { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { Node, Edge } from 'reactflow';
import { classNames } from './topicTreeHelpers';
import DeletePathway from './DeletePathway';
import { currPathT } from './types';
import DeleteTopic from './DeleteTopic';
import DeletePrerequisite from './DeletePrerequisite';
import { GenericGraphAdapter } from 'incremental-cycle-detect';

type DeleteProps = {
  selectedTopic: Node | null;
  selectedPrereq: Edge | null;
  selectedSubTab: 'Topic' | 'Pathway' | 'Pre-requisite';
  setSelectedSubTab: (tab: 'Topic' | 'Pathway' | 'Pre-requisite') => void;
  pathwayId: number;
  pathwayName: string;
  currPathData: {
    data: any;
    error: any;
    isLoading: boolean;
    isFetching: boolean;
    isSuccess: boolean;
  };
  globalPathData: {
    data: any;
    error: any;
    isLoading: boolean;
    isFetching: boolean;
    isSuccess: boolean;
  };
  setTabOpen: (
    tab: 'none' | 'help' | 'search' | 'details' | 'edit' | 'add' | 'delete'
  ) => void;
  setCurrPath: (currPath: currPathT) => void;
  setSelection: (
    node: Node | string | null,
    edge: Edge | string | null
  ) => void;
  globalNodes: Node[];
  graphForDetectingCycles: GenericGraphAdapter<any, any>;
};

const setIndexOfSelectedTab = (
  selectedTab: 'Topic' | 'Pathway' | 'Pre-requisite'
) => {
  if (selectedTab === 'Pathway') {
    return 0;
  } else if (selectedTab === 'Topic') {
    return 1;
  } else {
    return 2;
  }
};

const setNameOfTab = (selectedTab: number) => {
  if (selectedTab === 0) {
    return 'Pathway';
  } else if (selectedTab === 1) {
    return 'Topic';
  } else {
    return 'Pre-requisite';
  }
};

export default function Delete(props: DeleteProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(
    setIndexOfSelectedTab(props.selectedSubTab)
  );

  useEffect(() => {
    if (setIndexOfSelectedTab(props.selectedSubTab) !== selectedIndex) {
      setSelectedIndex(setIndexOfSelectedTab(props.selectedSubTab));
    }
  }, [props.selectedSubTab]);

  return (
    <div className="pb-1 px-5 overflow-y-auto w-full">
      <Tab.Group
        selectedIndex={selectedIndex}
        onChange={(ind) => props.setSelectedSubTab(setNameOfTab(ind))}
      >
        <div
          className="bg-gray-900 h-auto fixed py-4 z-10 rounded-md"
          style={{ width: '17.5rem' }}
        >
          <h1 className=" pb-1 text-lg font-medium text-white">Delete:</h1>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-300/20 p-1 text-blue-100">
            <Tab
              aria-label="Topic"
              title="Topic"
              className={({ selected }) =>
                classNames(
                  'flex flex-col justify-around items-center w-full rounded-lg py-1 flex justify-center text-xs font-medium leading-none h-12',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow stroke-black text-black'
                    : 'stroke-blue-100 fill-blue-100 hover:bg-white/[0.12] hover:stroke-white hover:fill-white'
                )
              }
            >
              <svg
                height="100%"
                viewBox="-2.88 -2.88 37.76 37.76"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                strokeWidth="0"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {' '}
                  <path d="M29.5 7c-1.381 0-2.5 1.12-2.5 2.5 0 0.284 0.058 0.551 0.144 0.805l-6.094 5.247c-0.427-0.341-0.961-0.553-1.55-0.553-0.68 0-1.294 0.273-1.744 0.713l-4.774-2.39c-0.093-1.296-1.162-2.323-2.482-2.323-1.38 0-2.5 1.12-2.5 2.5 0 0.378 0.090 0.732 0.24 1.053l-4.867 5.612c-0.273-0.102-0.564-0.166-0.873-0.166-1.381 0-2.5 1.119-2.5 2.5s1.119 2.5 2.5 2.5c1.381 0 2.5-1.119 2.5-2.5 0-0.332-0.068-0.649-0.186-0.939l4.946-5.685c0.236 0.073 0.48 0.124 0.74 0.124 0.727 0 1.377-0.316 1.834-0.813l4.669 2.341c0.017 1.367 1.127 2.471 2.497 2.471 1.381 0 2.5-1.119 2.5-2.5 0-0.044-0.011-0.086-0.013-0.13l6.503-5.587c0.309 0.137 0.649 0.216 1.010 0.216 1.381 0 2.5-1.119 2.5-2.5s-1.119-2.5-2.5-2.5z"></path>{' '}
                </g>
              </svg>
              <p>Pathway</p>
            </Tab>
            <Tab
              aria-label="Pathway"
              title="Pathway"
              className={({ selected }) =>
                classNames(
                  'flex flex-col justify-around items-center w-full rounded-lg py-1 flex justify-center text-xs font-medium leading-none h-12',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow stroke-black text-black'
                    : 'stroke-blue-100 fill-blue-100 hover:bg-white/[0.12] hover:stroke-white hover:fill-white'
                )
              }
            >
              <svg
                height="100%"
                viewBox="-2.4 -2.4 28.80 28.80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="inherit"
                  strokeWidth="2.256"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {' '}
                  <path
                    d="M3 10H21M6 7.5H6.01M9 7.5H18M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z"
                    strokeWidth="0.8399999999999999"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{' '}
                </g>
              </svg>
              <p>Topic</p>
            </Tab>
            <Tab
              aria-label="Pre-requisite Relationship"
              title="Pre-requisite Relationship"
              className={({ selected }) =>
                classNames(
                  'flex flex-col justify-around items-center w-full rounded-lg py-1 flex justify-center text-xs font-medium leading-none h-12',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow stroke-black text-black'
                    : 'stroke-blue-100 fill-blue-100 hover:bg-white/[0.12] hover:stroke-white hover:fill-white'
                )
              }
            >
              <svg
                height="100%"
                viewBox="-2.4 -2.4 28.80 28.80"
                xmlns="http://www.w3.org/2000/svg"
                strokeWidth="0.00024000000000000003"
                transform="rotate(90)"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {' '}
                  <path d="M12.7071 2.29289C12.3166 1.90237 11.6834 1.90237 11.2929 2.29289L5.29289 8.29289C4.90237 8.68342 4.90237 9.31658 5.29289 9.70711C5.68342 10.0976 6.31658 10.0976 6.70711 9.70711L11 5.41421L11 21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21L13 5.41421L17.2929 9.70711C17.6834 10.0976 18.3166 10.0976 18.7071 9.70711C19.0976 9.31658 19.0976 8.68342 18.7071 8.29289L12.7071 2.29289Z"></path>{' '}
                </g>
              </svg>
              <p>Prerequisite</p>
            </Tab>
          </Tab.List>
        </div>
        <Tab.Panels className="mt-32">
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            <DeletePathway
              pathwayId={props.pathwayId}
              pathwayName={props.pathwayName}
              currPathData={props.currPathData}
              globalPathData={props.globalPathData}
              setCurrPath={props.setCurrPath}
              setSelectedSubTab={props.setSelectedSubTab}
              setTabOpen={props.setTabOpen}
            />
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            {props.selectedTopic ? (
              <DeleteTopic
                selectedTopic={props.selectedTopic}
                globalNodes={props.globalNodes}
                graphForDetectingCycles={props.graphForDetectingCycles}
                setSelection={props.setSelection}
                currPathTopicNames={props.currPathData.data.core
                  .concat(props.currPathData.data.electives)
                  .map((t: any) => t.name)}
              />
            ) : (
              <h2 className=" py-1 text-center text-medium font-medium text-gray-600">
                Please select a Topic from the Topic Tree to delete
              </h2>
            )}
          </Tab.Panel>
          <Tab.Panel
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            {props.selectedPrereq ? (
              <DeletePrerequisite
                selectedPrereq={props.selectedPrereq}
                setSelection={props.setSelection}
                currPathTopicNames={props.currPathData.data.core
                  .concat(props.currPathData.data.electives)
                  .map((t: any) => t.name)}
              />
            ) : (
              <h2 className=" py-1 text-center text-medium font-medium text-gray-600">
                Please select a Prerequisite from the Topic Tree to delete
              </h2>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
