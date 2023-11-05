import React from 'react';
import Edit from './Edit';
import Add from './Add';
import Delete from './Delete';
import Details from './Details';
import { Node, Edge } from 'reactflow';
import Search from './Search';
import { SearchTopics, currPathT } from './types';
import { GenericGraphAdapter } from 'incremental-cycle-detect';

type SideBarContentProps = {
  tabOpen: 'none' | 'help' | 'search' | 'details' | 'edit' | 'add' | 'delete';
  pathwayId: number;
  pathwayName: string;
  selectedTopic: Node | null;
  selectedPrereq: Edge | null;
  searchTopics: SearchTopics;
  setSelection: (
    node: Node | string | null,
    edge: Edge | string | null
  ) => void;
  selectedSubTab: 'Topic' | 'Pathway' | 'Pre-requisite';
  setSelectedSubTab: (tab: 'Topic' | 'Pathway' | 'Pre-requisite') => void;
  isSuperuser: boolean;
  forceUpdate: boolean;
  setForceUpdate: (update: boolean) => void;
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
  setCurrPath: (currPath: currPathT) => void;
  setTabOpen: (
    tab: 'none' | 'help' | 'search' | 'details' | 'edit' | 'add' | 'delete'
  ) => void;
  pathwaysData: {
    userPathsData: {
      pathways: Array<any>;
      error: any;
      isLoading: boolean;
      isSuccess: boolean;
    };
    allPathsData: {
      pathways: Array<any>;
      error: any;
      isLoading: boolean;
      isSuccess: boolean;
    };
  };
  graphForDetectingCycles: GenericGraphAdapter<any, any>;
  pathwaysNames: Array<string>;
  globalNodes: Node[];
};

export default function SideBarContent(props: SideBarContentProps) {
  return (
    <>
      {props.tabOpen === 'help' && (
        <div className="py-4 overflow-y-auto border-l border-r w-80 bg-gray-900 border-gray-700">
          <h2 className="px-5 text-lg font-medium text-white">
            Help and Documentation
          </h2>
        </div>
      )}
      {props.tabOpen === 'search' && (
        <div className="py-4 overflow-y-auto border-l border-r w-80 bg-gray-900 border-gray-700">
          <Search
            searchTopics={props.searchTopics}
            selectedTopic={props.selectedTopic}
            selectedPrereq={props.selectedPrereq}
            setSelection={props.setSelection}
          />
        </div>
      )}
      {props.tabOpen === 'details' && (
        <div className="pb-4 overflow-y-auto border-l border-r w-80 bg-gray-900 border-gray-700">
          <Details
            pathwayId={props.pathwayId}
            pathwayName={props.pathwayName}
            selectedSubTab={props.selectedSubTab}
            setSelectedSubTab={props.setSelectedSubTab}
            selectedTopic={props.selectedTopic}
            selectedPrereq={props.selectedPrereq}
            setSelection={props.setSelection}
            forceUpdate={props.forceUpdate}
            setForceUpdate={props.setForceUpdate}
            currPathData={props.currPathData}
            currTopicData={props.currTopicData}
            isSuperuser={props.isSuperuser}
            pathwaysData={props.pathwaysData}
            globalPathData={props.globalPathData}
            setCurrPath={props.setCurrPath}
          />
        </div>
      )}
      {props.tabOpen === 'edit' && (
        <div className="pb-4 overflow-y-auto border-l border-r w-80 bg-gray-900 border-gray-700">
          <Edit
            pathwayId={props.pathwayId}
            pathwayName={props.pathwayName}
            selectedSubTab={props.selectedSubTab}
            setSelectedSubTab={props.setSelectedSubTab}
            selectedTopic={props.selectedTopic}
            selectedPrereq={props.selectedPrereq}
            isSuperuser={props.isSuperuser}
            globalPathData={props.globalPathData}
            currPathData={props.currPathData}
            currTopicData={props.currTopicData}
            graphForDetectingCycles={props.graphForDetectingCycles}
            pathwaysNames={props.pathwaysNames}
          />
        </div>
      )}
      {props.tabOpen === 'add' && (
        <div className="pb-4 overflow-y-auto border-l border-r w-80 bg-gray-900 border-gray-700">
          <Add
            selectedSubTab={props.selectedSubTab}
            setSelectedSubTab={props.setSelectedSubTab}
            selectedTopic={props.selectedTopic}
            selectedPrereq={props.selectedPrereq}
            globalPathData={props.globalPathData}
            setCurrPath={props.setCurrPath}
            setTabOpen={props.setTabOpen}
            currPathData={props.currPathData}
            pathwaysNames={props.pathwaysNames}
            pathwayId={props.pathwayId}
            setSelection={props.setSelection}
            graphForDetectingCycles={props.graphForDetectingCycles}
          />
        </div>
      )}
      {props.tabOpen === 'delete' && (
        <div className="pb-4 overflow-y-auto border-l border-r w-80 bg-gray-900 border-gray-700">
          <Delete
            selectedSubTab={props.selectedSubTab}
            setSelectedSubTab={props.setSelectedSubTab}
            selectedTopic={props.selectedTopic}
            selectedPrereq={props.selectedPrereq}
            pathwayId={props.pathwayId}
            pathwayName={props.pathwayName}
            currPathData={props.currPathData}
            globalPathData={props.globalPathData}
            setCurrPath={props.setCurrPath}
            setTabOpen={props.setTabOpen}
            setSelection={props.setSelection}
            graphForDetectingCycles={props.graphForDetectingCycles}
            globalNodes={props.globalNodes}
          />
        </div>
      )}
    </>
  );
}
