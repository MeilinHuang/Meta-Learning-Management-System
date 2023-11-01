import React from 'react';
import SideBarTabs from './SideBarTabs';
import SideBarContent from './SideBarContent';
import { Node, Edge } from 'reactflow';
import { SearchTopics, currPathT } from './types';
import { GenericGraphAdapter } from 'incremental-cycle-detect';

type SideBarProps = {
  tabOpen: 'none' | 'help' | 'search' | 'details' | 'edit' | 'add' | 'delete';
  setTabOpen: (
    tab: 'none' | 'help' | 'search' | 'details' | 'edit' | 'add' | 'delete'
  ) => void;
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
  setCurrPath: (currPath: currPathT) => void;
  globalNodes: Node[];
};

export default function SideBar(props: SideBarProps) {
  return (
    <nav style={{ height: `calc(100vh - 4rem)` }} className="flex">
      <SideBarTabs
        tabOpen={props.tabOpen}
        setTabOpen={props.setTabOpen}
        isSuperuser={props.isSuperuser}
      />
      <SideBarContent
        tabOpen={props.tabOpen}
        pathwayId={props.pathwayId}
        pathwayName={props.pathwayName}
        selectedTopic={props.selectedTopic}
        selectedPrereq={props.selectedPrereq}
        isSuperuser={props.isSuperuser}
        setSelection={props.setSelection}
        searchTopics={props.searchTopics}
        selectedSubTab={props.selectedSubTab}
        setSelectedSubTab={props.setSelectedSubTab}
        forceUpdate={props.forceUpdate}
        setForceUpdate={props.setForceUpdate}
        globalPathData={props.globalPathData}
        currPathData={props.currPathData}
        currTopicData={props.currTopicData}
        setCurrPath={props.setCurrPath}
        setTabOpen={props.setTabOpen}
        pathwaysData={props.pathwaysData}
        graphForDetectingCycles={props.graphForDetectingCycles}
        pathwaysNames={props.pathwaysData.allPathsData.pathways.map(
          (p) => p.name
        )}
        globalNodes={props.globalNodes}
      />
    </nav>
  );
}
