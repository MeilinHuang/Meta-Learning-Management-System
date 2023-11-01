import React from 'react';
import dagre from 'dagre';
// import dagre, { graphlib } from 'dagre';
import { GenericGraphAdapter } from 'incremental-cycle-detect';
import { Node, Edge, Position, MarkerType } from 'reactflow';
import {
  CoreAndElecTopicsT,
  PrereqSetT,
  SearchTopics,
  option,
  prereqSetNodeT
} from './types';

export function getLabel(
  status: string | null,
  archived: boolean,
  title: string
): string {
  const color = getButtonColors(
    status as null | 'available' | 'unavailable' | 'complete' | 'in-progress',
    archived
  );
  return (
    <p
      title={title}
      style={{
        backgroundColor: `${color.backgroundColor}`,
        color: `${color.textColor}`,
        borderRadius: '2px',
        padding: '5px',
        overflowX: 'hidden',
        overflowY: 'hidden'
      }}
    >
      {title}
    </p>
  ) as unknown as string;
}

const containsAll = (arr1: number[], arr2: number[]) =>
  arr2.every((arr2Item) => arr1.includes(arr2Item));
const sameMembers = (arr1: number[], arr2: number[]) =>
  containsAll(arr1, arr2) && containsAll(arr2, arr1);

export function checkPrereqs(
  originalPrereqSets: PrereqSetT[],
  prereqSets: PrereqSetT[],
  checkChange: boolean
): {
  change: boolean;
  error: { [index: string]: { [field: string]: string } } | null;
} {
  const retval: {
    change: boolean;
    error: { [index: string]: { [field: string]: string } } | null;
  } = {
    change: false,
    error: null
  };
  if (checkChange && prereqSets.length !== originalPrereqSets.length) {
    retval.change = true;
  }
  const choices: Set<number> = new Set();
  for (const [ind, prereqSet] of prereqSets.entries()) {
    //create a set of choices
    const prereqChoices: Array<number> = [];
    for (const choice of prereqSet.choices) {
      prereqChoices.push(choice.id);
      if (choices.has(choice.id)) {
        if (!retval.error) {
          retval.error = {};
        }
        if (!(ind.toString() in retval.error)) {
          retval.error[ind] = {};
        }
        retval.error[ind][
          'choices'
        ] = `${choice.name} is already in an above prereq for this topic`;
      } else {
        choices.add(choice.id);
      }
    }

    //check if current set of prereqs has changed
    if (checkChange) {
      const matchesToOriginal = originalPrereqSets.filter((k: PrereqSetT) => {
        let amountCheck = true;
        if (k.amount !== prereqSet.amount) {
          amountCheck = false;
        }
        let lengthCheck = true;
        if (prereqSet.choices.length !== k.choices.length) {
          lengthCheck = false;
        }
        const origPrereqChoices = k.choices.map((c) => c.id);
        const prereqCheck: boolean = sameMembers(
          prereqChoices,
          origPrereqChoices
        );
        return amountCheck && lengthCheck && prereqCheck;
      });
      if (matchesToOriginal.length !== 1) {
        retval.change = true;
      }
    }

    if (prereqSet.amount <= 0) {
      if (!retval.error) {
        retval.error = {};
      }
      if (!(ind.toString() in retval.error)) {
        retval.error[ind] = {};
      }
      retval.error[ind]['amount'] = 'Amount cannot be less than or equal to 0';
    } else if (
      prereqSet.amount >
      prereqSet.choices.filter((c: any) => !c.archived).length
    ) {
      if (!retval.error) {
        retval.error = {};
      }
      if (!(ind.toString() in retval.error)) {
        retval.error[ind] = {};
      }
      retval.error[ind]['amount'] =
        "Number of active topics in 'Choices' (i.e.: topics that are not archived) need to be greater than 'Amount'";
    } else if (prereqSet.choices.length <= 0) {
      if (!retval.error) {
        retval.error = {};
      }
      if (!(ind.toString() in retval.error)) {
        retval.error[ind] = {};
      }
      retval.error[ind]['choices'] =
        'Please select topics for this prerequisite';
    }
  }
  return retval;
}

export function findChangesAndErrorsPathway(
  name: string,
  origName: string,
  isGlobalPath: boolean,
  coreTopics: CoreAndElecTopicsT,
  elecTopics: CoreAndElecTopicsT,
  initialCore: CoreAndElecTopicsT,
  initialElecs: CoreAndElecTopicsT,
  pathwaysNames: Array<string>
): { change: boolean; error: { [field: string]: string } | null } {
  const retval: { change: boolean; error: { [field: string]: string } | null } =
    {
      change: false,
      error: null
    };
  const coreTopicIds: number[] = coreTopics.map((c) => Number(c.value));
  const initialCoreTopicIds: number[] = initialCore.map((c) => Number(c.value));
  const elecTopicIds: number[] = elecTopics.map((c) => Number(c.value));
  const initialElecTopicIds: number[] = initialElecs.map((c) =>
    Number(c.value)
  );

  if (origName !== name) {
    retval.change = true;
  } else if (coreTopics.length !== initialCore.length) {
    retval.change = true;
  } else if (elecTopics.length !== initialElecs.length) {
    retval.change = true;
  } else if (!sameMembers(coreTopicIds, initialCoreTopicIds)) {
    retval.change = true;
  } else if (!sameMembers(elecTopicIds, initialElecTopicIds)) {
    retval.change = true;
  }
  if (!name || !/\S/.test(name)) {
    if (!retval.error) {
      retval.error = {};
    }
    retval.error['name'] = 'Name required. Field cannot be empty';
  } else if (origName !== name && pathwaysNames.includes(name)) {
    if (!retval.error) {
      retval.error = {};
    }
    retval.error['name'] = `The name '${name}' is already in use.`;
  }
  const filteredArray = coreTopicIds.filter((value) =>
    elecTopicIds.includes(value)
  );
  if (filteredArray.length !== 0) {
    if (!retval.error) {
      retval.error = {};
    }
    retval.error['elec'] = 'A topic cannot be both an elective and a core.';
  }
  if (isGlobalPath) {
    //check that all topics are covered
    if (
      !sameMembers(
        [...coreTopicIds, ...elecTopicIds],
        [...initialCoreTopicIds, ...initialElecTopicIds]
      )
    ) {
      if (!retval.error) {
        retval.error = {};
      }
      retval.error['GlobalPath'] =
        'The global pathway must contain all the topics in the system as either electives or core topics.';
    }
  }

  return retval;
}

export function findChangesAndErrorsTopic(
  name: string,
  imageUrl: string,
  description: string,
  originalPrereqSets: PrereqSetT[],
  prereqSets: PrereqSetT[],
  currTopicData: any,
  globalPathData: any
): {
  change: boolean;
  error: {
    [key: string]: { [index: string]: { [field: string]: string } };
  } | null;
} {
  const retval: {
    change: boolean;
    error: {
      [key: string]: { [index: string]: { [field: string]: string } };
    } | null;
  } = {
    change: false,
    error: null
  };
  if ('title' in currTopicData && name !== currTopicData.title) {
    retval.change = true;
  } else if (
    'image_url' in currTopicData &&
    imageUrl !== currTopicData.image_url
  ) {
    retval.change = true;
  } else if (
    'description' in currTopicData &&
    description !== currTopicData.description
  ) {
    retval.change = true;
  }
  const prereqsCheck = checkPrereqs(originalPrereqSets, prereqSets, true);
  retval.change = retval.change || prereqsCheck.change;
  if (prereqsCheck.error) {
    if (!retval.error) {
      retval.error = {};
    }
    retval.error['prereqs'] = prereqsCheck.error;
  }
  if (!name || !/\S/.test(name)) {
    if (!retval.error) {
      retval.error = {};
    }
    retval.error['title'] = {
      error: { message: 'Title required. Field cannot be empty' }
    };
  }
  const currentNames: string[] = [];
  currentNames.push(...globalPathData.core.map((c: any) => c.name));
  currentNames.push(...globalPathData.electives.map((e: any) => e.name));
  if (currTopicData.title !== name && currentNames.includes(name)) {
    if (!retval.error) {
      retval.error = {};
    }
    retval.error['title'] = {
      error: { message: `The title '${name}' is already in use.` }
    };
  }
  return retval;
}

export function checkForLoops(
  currentGraph: GenericGraphAdapter<any, any>,
  action: 'add' | 'remove',
  edge: { source: string; target: string }
): boolean {
  if (action === 'add') {
    return currentGraph.addEdge(edge.source, edge.target);
  } else {
    currentGraph.deleteEdge(edge.source, edge.target);
    return true;
  }
}

export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export const getButtonColors = (
  status: null | 'available' | 'unavailable' | 'complete' | 'in-progress',
  archived: boolean
): {
  backgroundColor: string;
  textColor: string;
} => {
  if ((status && status === 'available') || (!status && !archived)) {
    return {
      backgroundColor: 'rgb(253, 224, 71)',
      textColor: 'black'
    };
  } else if (status && status === 'unavailable') {
    return {
      backgroundColor: 'rgb(17, 24, 39)',
      textColor: 'white'
    };
  } else if (status && status === 'complete') {
    return {
      backgroundColor: 'rgb(132, 204, 22)',
      textColor: 'black'
    };
  } else if (status && status === 'in-progress') {
    return {
      backgroundColor: 'rgb(251, 207, 232)',
      textColor: 'black'
    };
  }
  return {
    backgroundColor: 'rgb(30 41 59)',
    textColor: 'white'
  };
};

export function getButtonGroupStyles({
  active,
  leftCorner,
  rightCorner
}: {
  active: boolean;
  leftCorner?: boolean;
  rightCorner?: boolean;
}) {
  let classes =
    '-ml-px flex justify-center items-center border px-4 py-2 text-sm font-medium focus-visible:z-10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500';
  if (active) {
    classes +=
      ' z-10 border-indigo-300 bg-indigo-100 text-indigo-700 hover:bg-indigo-50';
  } else {
    classes += ' bg-white text-gray-700 hover:bg-gray-50';
  }

  if (leftCorner) {
    classes += ' rounded-l-md';
  }

  if (rightCorner) {
    classes += ' rounded-r-md';
  }

  return classes;
}

export const nodeWidth = 250;
export const nodeHeight = 36;

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph({ directed: true });
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: 'LR' });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = Position.Left;
    node.sourcePosition = Position.Right;
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2
    };

    return node;
  });
  return { nodes, edges };
};

export const getGraphForDetectingCycles = (
  topics: any,
  isSuperUser: boolean
): {
  graphForDetectingCycles: GenericGraphAdapter<any, any>;
  globalNodes: Node[];
} => {
  // const dagreGraph = new dagre.graphlib.Graph({ directed: true });
  // dagreGraph.setDefaultEdgeLabel(() => ({}));
  // dagreGraph.setGraph({ rankdir: 'LR' });

  const graphForDetectingCycles = GenericGraphAdapter.create();
  topics.forEach((topic: any) => {
    // if (!dagreGraph.hasNode(topic.id.toString())) {
    //   dagreGraph.setNode(topic.id.toString(), { label: topic.id.toString() });
    // }
    topic.needs.forEach((prereqSet: any) => {
      prereqSet.choices.forEach((prereq: any) => {
        // if (!dagreGraph.hasNode(prereq.id.toString())) {
        //   dagreGraph.setNode(prereq.id.toString(), {
        //     label: prereq.id.toString()
        //   });
        // }
        if (
          !graphForDetectingCycles.hasEdge(
            prereq.id.toString(),
            topic.id.toString()
          )
        ) {
          // dagreGraph.setEdge(prereq.id.toString(), topic.id.toString());
          graphForDetectingCycles.addEdge(
            prereq.id.toString(),
            topic.id.toString()
          );
        }
      });
    });
  });
  const globalNodes: Node[] = formatTopics(topics, isSuperUser, false).nodes;
  return { graphForDetectingCycles, globalNodes };
};

const findType = (
  topic: any
):
  | 'nodeStudentCompletedView'
  | 'nodeAcademicView'
  | 'nodeStudentInProgressView'
  | 'nodeStudentAvailableView'
  | 'nodeStudentUnAvailableView' => {
  if (!topic.status) {
    return 'nodeAcademicView';
  } else if (topic.status === 'complete') {
    return 'nodeStudentCompletedView';
  } else if (topic.status === 'in-progress') {
    return 'nodeStudentInProgressView';
  } else if (topic.status === 'available') {
    return 'nodeStudentAvailableView';
  } else {
    return 'nodeStudentUnAvailableView';
  }
};

// Format topics data from db for display on graph
export const formatTopics = (
  topics: any,
  isSuperuser: boolean,
  layout: boolean
) => {
  const groups: { id: string; label: string; isTopic: boolean }[] = [];
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const searchTopicOptions: option[] = [];
  const searchPreReqOptions: option[] = [];

  let allTopics: Set<number>;
  if (isSuperuser) {
    allTopics = new Set(topics.map((t: any) => t.id));
  } else {
    allTopics = new Set(
      topics.filter((t: any) => !t.archived).map((t: any) => t.id)
    );
  }
  let completed = 0;

  topics.forEach((topic: any) => {
    if (isSuperuser || !topic.archived) {
      // add formatted topic for search
      searchTopicOptions.push({
        label: topic.name,
        value: `${topic.id}`,
        group: 'Topic'
      });
      if (topic.status === 'complete') completed += 1;
      // add topic node
      const group = topic.topic_group;
      const newNode: Node = {
        id: topic.id.toString(),
        position: { x: 0, y: 0 },
        type: findType(topic),
        data: {
          label: topic.name,
          status: topic.status,
          isTopic: true,
          archived: topic.archived,
          year: topic.year ? topic.year : null,
          term: topic.term ? topic.term : null,
          prereqSets: []
        },
        style: {
          border: '1px solid black',
          borderRadius: '5px',
          cursor: 'pointer',
          overflow: 'hidden'
        }
      };
      if (group.id != null) newNode.data.parent = `g${group.id}`;

      // add topic_group node (if not created)
      if (group.id != null && !groups.some((g) => g.id === group.id)) {
        groups.push({
          id: `g${group.id}`,
          label: group.name,
          isTopic: false
        });
      }

      // Add incoming edges where both edge vertices are topics in the pathway
      // Prerequisite sets that are not fully contained in the pathway are ignored
      topic.needs.forEach((prereqSet: any) => {
        const newPrereqSet: prereqSetNodeT = {
          id: prereqSet.id,
          amount: prereqSet.amount,
          targetName: topic.name,
          choices: []
        };
        prereqSet.choices.forEach((prereq: any) => {
          newPrereqSet.choices.push({
            id: prereq.id,
            sourceName: prereq.name,
            targetName: topic.name,
            amount: prereqSet.amount,
            statusSource: prereq.status,
            statusTarget: topic.status,
            archivedSource: prereq.archived,
            archivedTarget: topic.archived
          });
        });
        newNode.data.prereqSets.push(newPrereqSet);
        prereqSet.choices.forEach((prereq: any) => {
          if (
            prereq.name &&
            topic.name &&
            allTopics.has(prereq.id) &&
            allTopics.has(topic.id) &&
            edges.findIndex((e) => e.id === `${prereq.id}-to→${topic.id}`) ===
              -1
          ) {
            edges.push({
              id: `${prereq.id}-to→${topic.id}`,
              source: prereq.id.toString(),
              target: topic.id.toString(),
              type: 'default',
              data: {
                label: `${prereq.name}-to→${topic.name}`,
                sourceName: prereq.name,
                targetName: topic.name,
                prereqSetId: prereqSet.id,
                amount: prereqSet.amount,
                choices: newPrereqSet.choices,
                statusSource: prereq.status,
                statusTarget: topic.status,
                archivedSource: prereq.archived,
                archivedTarget: topic.archived
              },
              style: {
                stroke: 'black',
                cursor: 'pointer'
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: 'black'
              }
            });
            searchPreReqOptions.push({
              label: `${prereq.name}-to→${topic.name}`,
              value: `${prereq.id}-to→${topic.id}`,
              group: 'Pre-req relationship'
            });
          }
        });
      });
      nodes.push(newNode);
    }
  });
  const searchTopics: SearchTopics = [
    { label: 'Topic', options: searchTopicOptions },
    { label: 'Pre-req relationship', options: searchPreReqOptions }
  ];

  if (layout) {
    const layoutElements = getLayoutedElements(nodes, edges);

    return {
      nodes: layoutElements.nodes,
      edges: layoutElements.edges,
      groups,
      searchTopics,
      progress:
        allTopics.size > 0
          ? Math.round((completed / allTopics.size) * 100)
          : 100
    };
  } else {
    return {
      nodes: nodes,
      edges: edges,
      groups,
      searchTopics,
      progress:
        allTopics.size > 0
          ? Math.round((completed / allTopics.size) * 100)
          : 100
    };
  }
};

export const formatStylesNodes = (
  nodes: Node[],
  selectedNode: Node | null
): Node[] => {
  const styledNodes = nodes.map((node) => {
    if (selectedNode && node.id === selectedNode.id) {
      const newNode = {
        ...node,
        style: {
          ...node.style,
          border: '3px solid #6366F1',
          borderRadius: '7px'
        }
      };
      return newNode;
    } else {
      return node;
    }
  });
  return styledNodes;
};

export const formatStylesEdges = (
  edges: Edge[],
  selectedPrereq: Edge | null
): Edge[] => {
  const styledEdges = edges.map((edge) => {
    if (selectedPrereq && edge.id === selectedPrereq.id) {
      const markerEndSelected = {
        type: MarkerType.ArrowClosed,
        color: '#6366F1'
      };
      return {
        ...edge,
        style: {
          ...edge.style,
          stroke: '#6366F1',
          strokeWidth: '3px'
        },
        markerEnd: {
          ...markerEndSelected
        },
        zIndex: 3,
        label: `Required ${edge.data.amount} of ${edge.data.choices.length}`
      };
    } else if (
      selectedPrereq &&
      selectedPrereq.data.prereqSetId === edge.data.prereqSetId
    ) {
      return {
        ...edge,
        style: {
          ...edge.style,
          stroke: '#6366F1',
          strokeWidth: '3px'
        },
        animated: true,
        zIndex: 2,
        label: `Required ${edge.data.amount} of ${edge.data.choices.length}`
      };
    } else {
      return edge;
    }
  });
  return styledEdges;
};

export const nodeColors = (node: Node, selectedTopic: Node | null): string => {
  if (selectedTopic && node.id === selectedTopic.id) {
    return 'rgb(99, 102, 241)';
  } else if (node.type === 'nodeStudentCompletedView') {
    return 'rgb(132 204 22)';
  } else if (node.type === 'nodeStudentInProgressView') {
    return 'rgb(251 207 232)';
  } else if (node.type === 'nodeStudentAvailableView') {
    return 'rgb(253 224 71)';
  } else if (node.type === 'nodeStudentUnAvailableView') {
    return 'rgb(17 24 39)';
  } else if (node.type === 'nodeAcademicView') {
    if (node.data.archived) {
      return 'rgb(17 24 39)';
    } else {
      return 'rgb(253 224 71)';
    }
  } else {
    return 'grey';
  }
};

export const topicStatus = (node: Node): string | null => {
  if (node.type === 'nodeStudentCompletedView') {
    if (node.data.year && node.data.term) {
      return `Completed in ${node.data.term} ${node.data.year}`;
    }
    return 'Completed';
  } else if (node.type === 'nodeStudentInProgressView') {
    return 'Currently enrolled';
  } else if (node.type === 'nodeStudentAvailableView') {
    return 'Available to enrol';
  } else if (node.type === 'nodeStudentUnAvailableView') {
    return 'Unavailable to enrol. Please complete prerequisites';
  } else {
    return null;
  }
};
