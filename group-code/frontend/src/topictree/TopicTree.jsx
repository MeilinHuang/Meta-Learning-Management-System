import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Select, { components, DropdownIndicatorProps } from 'react-select';

//Need to replace cytoscape with reactflow! - SIM TO DO
import Cytoscape from 'cytoscape';
import ReactDOM from 'react-dom';
import CytoscapeComponent from 'react-cytoscapejs';

// Cytoscape.js packages
import dagre from 'cytoscape-dagre';
import undoRedo from 'cytoscape-undo-redo';
import expandCollapse from 'cytoscape-expand-collapse';

import PathwayDropdown from './PathwayDropdown';
import CreateDropdown from './CreateDropdown';

import CreateTopicModal from './CreateTopicModal';
import CreateTopicImportModal from './CreateTopicImportModal';
import CreateGroupModal from './CreateGroupModal';
import CreatePrerequisiteModal from './CreatePrerequisiteModal';
import CreatePathwayModal from './CreatePathwayModal';
import EditPathwayModal from './EditPathwayModal';
import TopicModal from './TopicModal';
import PrerequisiteModal from './PrerequisiteModal';
import TopicEnrolModal from './TopicEnrolModal';
import GroupModal from './GroupModal';

import ViewToggle from './TopicGroupToggle';

import {
  useEnrolInPathwayMutation,
  useGetPathwayQuery,
  useIsSuperuserQuery
} from '../features/api/apiSlice';

Cytoscape.use(dagre);
Cytoscape.use(undoRedo);
expandCollapse(Cytoscape);

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <MagnifyingGlassIcon className="text-gray-800 w-5 h-5" />
    </components.DropdownIndicator>
  );
};

// Format topics data from db for display on graph
const formatTopics = (topics) => {
  let groups = [];
  let nodes = [];
  let edges = [];
  let searchTopics = [];

  topics.forEach((topic) => {
    // add formatted topic for search
    searchTopics.push({
      label: topic.name,
      value: `${topic.id}`
    });

    // add topic node
    let group = topic.topic_group;
    if (group.id != null) {
      nodes.push({
        data: {
          id: topic.id,
          label: topic.name,
          parent: `g${group.id}`,
          status: topic.status,
          isTopic: 'true',
          archived: `${topic.archived}`
        }
      });
    } else {
      nodes.push({
        data: {
          id: topic.id,
          label: topic.name,
          status: topic.status,
          isTopic: 'true',
          archived: `${topic.archived}`
        }
      });
    }

    // add topic_group node (if not created)
    if (group.id != null && !groups.some((g) => g.id === group.id)) {
      groups.push({
        data: {
          id: `g${group.id}`,
          label: group.name,
          isTopic: 'false'
        }
      });
    }

    // Add incoming edges where both edge vertices are topics in the pathway
    // Prerequisite sets that are not fully contained in the pathway are ignored
    topic.needs.forEach((prereqSet) => {
      let setContained = true;
      prereqSet.choices.forEach((prereq) => {
        if (!topics.find((topic) => topic.id === prereq.id)) {
          setContained = false;
        }
      });

      if (setContained) {
        prereqSet.choices.forEach((prereq) => {
          let choices = prereqSet.choices.length;
          edges.push({
            data: {
              prereqId: prereqSet.id,
              source: prereq.id,
              target: topic.id,
              sourceName: prereq.name,
              targetName: topic.name,
              amount: prereqSet.amount,
              choices: choices,
              status: prereq.status
            }
          });
        });
      }
    });
  });

  return [groups.concat(nodes, edges), searchTopics];
};

let expanded = true;

export default function TopicTree() {
  const navigate = useNavigate();
  const [cy, setCy] = useState(null);
  const [expandCollapseApi, setExpandCollapseApi] = useState(null);

  const [currPath, setCurrPath] = useState({
    id: 0,
    name: 'Global Pathway',
    user: false
  });

  // Modals
  const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showCreateTopicImportModal, setShowCreateTopicImportModal] = useState(false);
  const [showTopicImportModal, setShowTopicImportModal] = useState(false);
  const [showCreatePrereqModal, setShowCreatePrereqModal] = useState(false);
  const [showPrereqModal, setShowPrereqModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showPathwayModal, setShowPathwayModal] = useState(false);
  const [showEnrolModal, setShowEnrolModal] = useState(false);
  const [showEditPathwayModal, setShowEditPathwayModal] = useState(false);

  const [searchTopics, setSearchTopics] = useState([]);
  const [selectedSearchTopic, setSelectedSearchTopic] = useState({});

  const [isSuperuser, setIsSuperuser] = useState(false);

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
    user: currPath.user
  });

  const [selectedTopic, setSelectedTopic] = useState({ id: 0, label: '' });
  const [selectedPrereq, setSelectedPrereq] = useState({
    prereqId: 0,
    sourceName: '',
    targetName: ''
  });

  const [selectedGroup, setSelectedGroup] = useState({ id: 0, label: '' });

  const [enrolInPath, { data: pathEnrolData, isSuccess: isSuccessPathEnrol }] =
    useEnrolInPathwayMutation();

  useEffect(() => {
    console.log(superuserData);
    if (superuserData && superuserData['is_superuser']) {
      setIsSuperuser(true);
    }
  }, [superuserData]);

  useEffect(() => {
    if (!isFetching && isSuccess && cy && layout) {
      cy.layout(layout).run();
    }
  }, [isFetching, currPath]);

  useEffect(() => {
    if (cy) {
      cy.expandCollapse({
        fisheye: false,
        layoutBy: layout,
        cueEnabled: false
      });
      setExpandCollapseApi(cy.expandCollapse('get'));
    }
  }, [cy]);

  useEffect(() => {
    if (isSuccessPathEnrol) {
      setCurrPath({ id: currPath.id, name: currPath.name, user: true });
    }
  }, [pathEnrolData]);

  useEffect(() => {
    if (pathwayData && isSuccess) {
      setSearchTopics(
        formatTopics(pathwayData.core.concat(pathwayData.electives))[1]
      );
    }
  }, [pathwayData]);

  useEffect(() => {
    if (selectedSearchTopic && cy) {
      const node = cy.getElementById(selectedSearchTopic.value);
      if (node) {
        cy.fit(node, 200);
      }
    }
  }, [selectedSearchTopic]);

  const layout = {
    name: 'dagre',
    rankDir: 'LR',
    spacingFactor: 1.25,
    fit: true,
    padding: 100,
    infinite: true
  };

  const stylesheet = [
    {
      selector: 'node',
      style: {
        content: 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        'background-color': '#21262d',
        shape: 'round-rectangle',
        width: 150,
        height: 28,
        'font-size': 11,
        'border-width': 1,
        'border-color': '#6b7280',
        color: '#c8d0d8'
      }
    },
    {
      selector: '$node > node', // expanded group
      style: {
        'text-valign': 'top',
        'text-margin-y': '-10',
        'font-size': 12,
        'background-color': '#e2e8f0',
        color: '#21262d'
      }
    },
    {
      selector: 'node.hover',
      style: {
        backgroundColor: 'green'
      }
    },
    {
      selector: '.cy-expand-collapse-collapsed-node', // collapsed group
      style: {
        label: 'data(label)',
        'font-size': 12
      }
    },
    {
      selector: 'node[status="not-started"]',
      style: {
        'background-color': '#e2e8f0', // slate-200
        'border-color': '#64748b', // slate-500
        color: '#475569' // slate-600
      }
    },
    {
      selector: 'node[status="in-progress"]',
      style: {
        'background-color': '#fed7aa', // orange-200
        'border-color': '#f97316', // orange-500
        color: '#ea580c' // organe-600
      }
    },
    {
      selector: 'node[status="complete"]',
      style: {
        'background-color': '#bbf7d0', // green-200
        'border-color': '#22c55e', // green-500
        color: '#16a34a' // green-600
      }
    },
    {
      selector: 'node[archived="true"]',
      style: {
        'background-color': '#cbd5e1', // slate-300
        'border-color': '#94a3b8', // slate-400
        color: '#475569' // slate-600
      }
    },
    {
      selector: 'edge',
      style: {
        content: (edge) =>
          edge.data('amount') < edge.data('choices')
            ? ` Pick ${edge.data('amount')} of ${edge.data('choices')} `
            : '',
        'font-size': 11,
        'text-background-color': '#e2e8f0',
        'text-background-opacity': 1,
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'line-color': '#000',
        'line-opacity': (edge) => edge.data('amount') / edge.data('choices'),
        'target-arrow-color': '#838c95',
        'arrow-scale': 1.2,
        'target-endpoint': '-75 0',
        'source-endpoint': '75 0',
        width: 2
      }
    },
    {
      selector: 'edge[status="in-progress"]',
      style: {
        'line-color': '#f97316', // orange-500
        'line-opacity': (edge) => edge.data('amount') / edge.data('choices'),
        'target-arrow-color': '#ea580c' // orange-600
      }
    },
    {
      selector: 'edge[status="complete"]',
      style: {
        'line-color': '#22c55e', // green-500
        'line-opacity': (edge) => edge.data('amount') / edge.data('choices'),
        'target-arrow-color': '#16a34a' // green-600
      }
    }
  ];

  return (
    <div>
      {/* Modals */}
      <CreateTopicModal
        open={showCreateTopicModal}
        setOpen={setShowCreateTopicModal}
      />
      <CreateTopicImportModal
        open={showCreateTopicImportModal}
        setOpen={setShowCreateTopicImportModal}
      />
      <CreateGroupModal
        open={showCreateGroupModal}
        setOpen={setShowCreateGroupModal}
      />
      <CreatePrerequisiteModal
        open={showCreatePrereqModal}
        setOpen={setShowCreatePrereqModal}
      />
      <CreatePathwayModal
        open={showPathwayModal}
        setOpen={setShowPathwayModal}
      />
      <TopicEnrolModal
        open={showEnrolModal}
        setOpen={setShowEnrolModal}
        topicId={selectedTopic.id}
        topicName={selectedTopic.name}
      />
      <EditPathwayModal
        open={showEditPathwayModal}
        setOpen={setShowEditPathwayModal}
        pathwayId={currPath.id}
        pathwayName={currPath.name}
      />
      <TopicModal
        open={showTopicModal}
        setOpen={setShowTopicModal}
        topicId={selectedTopic.id}
      />
      <GroupModal
        open={showGroupModal}
        setOpen={setShowGroupModal}
        groupId={selectedGroup.id}
      />
      <PrerequisiteModal
        open={showPrereqModal}
        setOpen={setShowPrereqModal}
        prereqId={selectedPrereq.prereqId}
        sourceName={selectedPrereq.sourceName}
        targetName={selectedPrereq.targetName}
      />
      {/* Tree view controls */}
      <div className="w-full h-14 px-4 flex items-center flex-row-reverse justify-between">
        {/* Edit path, path dropdown, create options */}
        <div className="flex md:flex-row flex-col items-end mt-11 md:mt-0">
          {isSuperuser && (
            <div>
              {currPath.id == 0 ? (
                <CreateDropdown
                  setShowTopicModal={setShowCreateTopicModal}
                  setShowTopicImportModal={setShowCreateTopicImportModal}
                  setShowGroupModal={setShowCreateGroupModal}
                  setShowPrereqModal={setShowCreatePrereqModal}
                  setShowPathwayModal={setShowPathwayModal}
                />
              ) : (
                <div className="md:mr-3 relative inline-block text-left">
                  <button
                    className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100"
                    onClick={() => {
                      setShowEditPathwayModal(true);
                    }}
                  >
                    Edit Path
                    <PencilIcon
                      className="-mr-1 ml-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              )}
            </div>
          )}
          <PathwayDropdown currPath={currPath} setCurrPath={setCurrPath} />
        </div>
        {/* Start path, search, topic/group toggle */}
        <div className="flex items-center">
          {/* Start pathway */}
          {!currPath.user && currPath.id != 0 && !isSuperuser && (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
              onClick={() => {
                enrolInPath({
                  user_id: localStorage.getItem('user_id'),
                  pathway_id: currPath.id
                });
              }}
            >
              Enrol in Path
            </button>
          )}
          {/* Search */}
          <Select
            name="search"
            options={searchTopics}
            className="hidden sm:block basic-multi-select w-64 w-text-sm text-sm text-left ml-4"
            classNamePrefix="select"
            theme={(theme) => ({
              ...theme,
              borderRadius: 5,
              colors: {
                ...theme.colors,
                primary25: '#eef2ff',
                primary: '#818cf8'
              }
            })}
            maxMenuHeight={400}
            value={selectedSearchTopic}
            placeholder="Search..."
            components={{ DropdownIndicator }}
            onChange={(e) => {
              if (e) {
                const topic = searchTopics.filter(
                  (topic) => topic.value === e.value
                )[0];
                setSelectedSearchTopic({ ...topic });
              }
            }}
            aria-label="Topic Tree Search bar"
          />
          {/* Topic / group toggle */}
          <ViewToggle cy={cy} expandCollapseApi={expandCollapseApi} />
        </div>
      </div>
      {/* Topic tree */}
      <CytoscapeComponent
        cy={(cy) => {
          setCy(cy);
          // Remove previous event listeners as this causes multiple triggers of the event
          cy.off('tap');

          // Handle clicks on edges
          cy.on('tap', 'edge', (e) => {
            setSelectedPrereq({
              prereqId: e.target.data().prereqId,
              sourceName: e.target.data().sourceName,
              targetName: e.target.data().targetName
            });
            if (currPath.id == 0) setShowPrereqModal(true);
          });

          // Handle clicks on nodes
          cy.on('tap', 'node[isTopic="true"]', (e) => {
            let status = e.target.data().status;

            setSelectedTopic({
              id: e.target.data().id,
              name: e.target.data().label
            });

            // Tap on topics in global pathway
            if (currPath.id === 0) {
              setShowTopicModal(true);
            }

            // Tap on topics in pathways user is enrolled in
            else if (status === 'not-started') {
              // prompt user to enrol in topic
              setShowEnrolModal(true);
            } else if (status === 'in-progress' || status === 'complete') {
              // redirect to topic page
              navigate(`/topic/${e.target.data().id}/preparation`);
            }
          });

          cy.on('tap', 'node[isTopic="false"]', (e) => {
            if (isSuperuser) {
              setSelectedGroup({
                id: Number(e.target.data().id.slice(1)),
                name: e.target.data().label
              });
              if (currPath.id == 0) setShowGroupModal(true);
            }
          });

          // highlight paths to node on hover (mouseover)
          // cy.on('mouseover', 'node', (e) => {
          //   cy.nodes(e.target).addClass('hover');
          // });
          // // remove path highlights after hover (mouseout)
          // cy.on('mouseout', 'node', (e) => {
          //   cy.nodes(e.target).removeClass('hover');
          // });
        }}
        elements={
          pathwayData
            ? formatTopics(pathwayData.core.concat(pathwayData.electives))[0]
            : []
        }
        className="absolute text-left left-0 top-0 right-0 bottom-0 bg-slate-50 z-[-1]"
        layout={layout}
        stylesheet={stylesheet}
      />
    </div>
  );
}
