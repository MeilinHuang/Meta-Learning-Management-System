import React from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  ReactFlowProvider,
  Node,
  Edge,
  Background,
  useReactFlow
} from 'reactflow';

import 'reactflow/dist/style.css';

import { useState, useEffect } from 'react';

import {
  useGetPathwayQuery,
  useIsSuperuserQuery,
  useGetEnrolledTopicsQuery,
  useGetPrerequisiteInfoQuery,
  useGetTopicInfoQuery,
  useGetPathwaysQuery
} from '../features/api/apiSlice';

import {
  formatTopics,
  formatStylesEdges,
  formatStylesNodes,
  nodeWidth,
  nodeHeight,
  nodeColors,
  getGraphForDetectingCycles
} from './topicTreeHelpers';
import SideBar from './SideBar';
import TopicTreeControls from './TopicTreeControls';
import NodeStudentInProgressView from './NodeStudentInProgressView';
import NodeStudentCompletedView from './NodeStudentCompletedView';
import NodeAcademicView from './NodeAcademicView';
import { SearchTopics } from './types';
import NodeStudentAvailableView from './NodeStudentAvailableView';
import NodeStudentUnAvailableView from './NodeStudentUnAvailableView';
import { GenericGraphAdapter } from 'incremental-cycle-detect';
import dagre, { graphlib } from 'dagre';

const nodeTypes = {
  nodeStudentInProgressView: NodeStudentInProgressView,
  nodeStudentCompletedView: NodeStudentCompletedView,
  nodeStudentAvailableView: NodeStudentAvailableView,
  nodeStudentUnAvailableView: NodeStudentUnAvailableView,
  nodeAcademicView: NodeAcademicView
};

function TopicTree() {
  const { setCenter } = useReactFlow();

  const [isSuperuser, setIsSuperuser] = useState<boolean>(false);

  const [accessCode, setAccessCode] = useState<string | null>(
    localStorage.getItem('access_token')
  );
  const [forceUpdate, setForceUpdate] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(100);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [selectedTopic, setSelectedTopic] = useState<Node | null>(null);
  const [selectedPrereq, setSelectedPrereq] = useState<Edge | null>(null);
  const [searchTopics, setSearchTopics] = useState<SearchTopics>([]);
  const [tabOpen, setTabOpen] = useState<
    'none' | 'help' | 'search' | 'details' | 'edit' | 'add' | 'delete'
  >('none');
  const [selectedSubTab, setSelectedSubTab] = useState<
    'Topic' | 'Pathway' | 'Pre-requisite'
  >('Pathway');
  const [graphForDetectingCycles, setGraphForDetectingCycles] = useState<
    GenericGraphAdapter<any, any>
  >(GenericGraphAdapter.create());
  // const [graphForFindingCycles, setGraphForFindingCycles] =
  //   useState<graphlib.Graph>(new dagre.graphlib.Graph({ directed: true }));
  const [globalNodes, setGlobalNodes] = useState<Node[]>([]);

  const [currPath, setCurrPath] = useState({
    id: 0,
    name: 'Global Pathway',
    user: false
  });

  const { data: superuserData, error: superuserError } =
    useIsSuperuserQuery(null);

  const {
    data: pathwayData,
    error,
    isLoading,
    isFetching,
    isSuccess
  } = useGetPathwayQuery({
    pathway_id: currPath.id,
    user: !isSuperuser
  });

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

  const {
    data: userPathsData,
    error: errorUserPaths,
    isLoading: isLoadingUserPaths,
    isSuccess: isSuccessUserPaths
  } = useGetPathwaysQuery(true);

  const {
    data: allPathsData,
    error: errorAllPaths,
    isLoading: isLoadingAllPaths,
    isSuccess: isSuccessAllPaths
  } = useGetPathwaysQuery(false);

  const findNode = (nodeId: string | null): Node | null => {
    if (!nodeId) return null;
    const foundNode = nodes.find((n) => n.id === nodeId);
    if (foundNode) {
      return foundNode;
    } else {
      return null;
    }
  };

  const findEdge = (edgeId: string | null): Edge | null => {
    if (!edgeId) return null;
    const foundEdge = edges.find((e) => e.id === edgeId);
    if (foundEdge) {
      return foundEdge;
    } else {
      return null;
    }
  };

  const {
    data: topicInfoData,
    error: topicInfoError,
    isLoading: topicInfoIsLoading,
    isSuccess: topicInfoIsSuccess,
    isFetching: topicInfoIsFetching
  } = useGetTopicInfoQuery({
    topic_id: selectedTopic ? Number(selectedTopic.id) : -1
  });

  useEffect(() => {
    if (localStorage.getItem('access_token') !== accessCode) {
      setAccessCode(localStorage.getItem('access_token'));
    }
  }, [localStorage.getItem('access_token')]);

  useEffect(() => {
    if (superuserData && superuserData['is_superuser']) {
      setIsSuperuser(true);
      setCurrPath({
        id: currPath.id,
        name: currPath.name,
        user: false
      });
    } else if (superuserData) {
      setIsSuperuser(false);
      setCurrPath({
        id: currPath.id,
        name: currPath.name,
        user: true
      });
    }
  }, [superuserData]);

  useEffect(() => {
    if (selectedTopic) {
      if (tabOpen === 'none') setTabOpen('details');
      setSelectedSubTab('Topic');
      const x = selectedTopic.position.x + nodeWidth / 2;
      const y = selectedTopic.position.y + nodeHeight / 2;
      const zoom = 1.5;
      setCenter(x, y, { zoom, duration: 1000 });
    } else if (selectedPrereq) {
      if (tabOpen === 'none') setTabOpen('details');
      setSelectedSubTab('Pre-requisite');
      const foundEdgeSource = nodes.find((n) => n.id === selectedPrereq.source);
      const foundEdgeTarget = nodes.find((n) => n.id === selectedPrereq.target);
      if (foundEdgeSource && foundEdgeTarget) {
        const x =
          (foundEdgeSource.position.x +
            nodeWidth +
            foundEdgeTarget.position.x) /
          2;
        const y =
          (foundEdgeSource.position.y +
            nodeHeight +
            nodeHeight +
            foundEdgeTarget.position.y) /
          2;
        const zoom = 1.5;
        setCenter(x, y, { zoom, duration: 1000 });
      }
    } else {
      if (tabOpen === 'none') setTabOpen('details');
      setSelectedSubTab('Pathway');
    }
  }, [selectedTopic, selectedPrereq]);

  const setSelection = (
    node: Node | string | null,
    edge: Edge | string | null
  ): void => {
    if (typeof node === 'string') {
      const foundNode = findNode(node);
      if (foundNode) {
        setSelectedTopic(foundNode);
        setSelectedPrereq(null);
      } else {
        setSelectedTopic(null);
        setSelectedPrereq(null);
      }
    } else if (typeof edge === 'string') {
      const foundEdge = findEdge(edge);
      if (foundEdge) {
        setSelectedTopic(null);
        setSelectedPrereq(foundEdge);
      } else {
        setSelectedTopic(null);
        setSelectedPrereq(null);
      }
    } else {
      setSelectedTopic(node);
      setSelectedPrereq(edge);
    }
  };

  useEffect(() => {
    if (pathwayData && !superuserError) {
      const allTopics = pathwayData.core.concat(pathwayData.electives);
      const formatedTopics = formatTopics(allTopics, isSuperuser, true);
      setProgress(formatedTopics.progress);
      setNodes(formatedTopics.nodes);
      setEdges(formatedTopics.edges);
      setSearchTopics(formatedTopics.searchTopics);
      setSelection(null, null);
    } else {
      setNodes([]);
      setEdges([]);
      setProgress(100);
      setSearchTopics([]);
      setSelection(null, null);
    }
  }, [pathwayData, isSuperuser, superuserError]);

  useEffect(() => {
    if (globalPathData) {
      const graphs = getGraphForDetectingCycles(
        globalPathData.core.concat(globalPathData.electives),
        isSuperuser
      );
      setGraphForDetectingCycles(graphs.graphForDetectingCycles);
      // setGraphForFindingCycles(graphs.dagreGraph);
      setGlobalNodes(graphs.globalNodes);
    } else {
      setGraphForDetectingCycles(GenericGraphAdapter.create());
      // setGraphForFindingCycles(new dagre.graphlib.Graph({ directed: true }));
      setGlobalNodes([]);
    }
  }, [globalPathData, isSuperuser]);

  return (
    <div
      style={{ width: '100vw', height: `calc(100vh - 4rem)`, display: 'flex' }}
    >
      {error ? (
        <h1> An error has occured, please contact the site admin </h1>
      ) : (
        <>
          {isFetching ? (
            <h1>Loading...</h1>
          ) : (
            <>
              <SideBar
                tabOpen={tabOpen}
                setTabOpen={setTabOpen}
                pathwayId={currPath.id}
                pathwayName={pathwayData.name}
                selectedTopic={selectedTopic}
                selectedPrereq={selectedPrereq}
                searchTopics={searchTopics}
                setSelection={setSelection}
                selectedSubTab={selectedSubTab}
                setSelectedSubTab={setSelectedSubTab}
                isSuperuser={isSuperuser}
                forceUpdate={forceUpdate}
                setForceUpdate={setForceUpdate}
                globalPathData={{
                  data: globalPathData,
                  error: errorPath,
                  isLoading: isLoadingPath,
                  isFetching: isFetchingPath,
                  isSuccess: isSuccessPath
                }}
                currPathData={{
                  data: pathwayData,
                  error,
                  isLoading,
                  isFetching,
                  isSuccess
                }}
                currTopicData={{
                  data: topicInfoData,
                  error: topicInfoError,
                  isLoading: topicInfoIsLoading,
                  isSuccess: topicInfoIsSuccess,
                  isFetching: topicInfoIsFetching
                }}
                setCurrPath={setCurrPath}
                graphForDetectingCycles={graphForDetectingCycles}
                pathwaysData={{
                  userPathsData: {
                    pathways:
                      userPathsData && 'pathways' in userPathsData
                        ? userPathsData.pathways
                        : [],
                    error: errorUserPaths,
                    isLoading: isLoadingUserPaths,
                    isSuccess: isSuccessUserPaths
                  },
                  allPathsData: {
                    pathways:
                      allPathsData && 'pathways' in allPathsData
                        ? allPathsData.pathways
                        : [],
                    error: errorAllPaths,
                    isLoading: isLoadingAllPaths,
                    isSuccess: isSuccessAllPaths
                  }
                }}
                globalNodes={globalNodes}
              />
              <div
                style={{
                  width: '100%',
                  height: `calc(100vh - 4rem)`,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <TopicTreeControls
                  currPath={pathwayData}
                  setCurrPath={setCurrPath}
                  progress={progress}
                  isSuperuser={isSuperuser}
                  pathwaysData={{
                    userPathsData: {
                      pathways:
                        userPathsData && 'pathways' in userPathsData
                          ? userPathsData.pathways
                          : [],
                      error: errorUserPaths,
                      isLoading: isLoadingUserPaths,
                      isSuccess: isSuccessUserPaths
                    },
                    allPathsData: {
                      pathways:
                        allPathsData && 'pathways' in allPathsData
                          ? allPathsData.pathways
                          : [],
                      error: errorAllPaths,
                      isLoading: isLoadingAllPaths,
                      isSuccess: isSuccessAllPaths
                    }
                  }}
                />
                <ReactFlow
                  fitView
                  elevateEdgesOnSelect={true}
                  panOnScroll={true}
                  nodes={formatStylesNodes(nodes, selectedTopic)}
                  edges={formatStylesEdges(edges, selectedPrereq)}
                  elementsSelectable={false}
                  onNodeClick={(e, node) => {
                    e.preventDefault();
                    setSelection(node, null);
                  }}
                  onEdgeClick={(e, edge) => {
                    e.preventDefault();
                    setSelection(null, edge);
                  }}
                  nodesConnectable={false}
                  nodeTypes={nodeTypes}
                >
                  <Background color="#ccc" />
                  <Controls showInteractive={false} />
                  <MiniMap
                    nodeStrokeWidth={3}
                    zoomable
                    pannable
                    nodeColor={(n) => nodeColors(n, selectedTopic)}
                  />
                </ReactFlow>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default function TopicTreeWithProvider() {
  return (
    <ReactFlowProvider>
      <TopicTree />
    </ReactFlowProvider>
  );
}
