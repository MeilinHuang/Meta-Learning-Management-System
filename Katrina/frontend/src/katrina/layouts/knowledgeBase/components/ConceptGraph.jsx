import React from 'react'
import { Graph } from "react-d3-graph";


const findNode = (array, type, id) => {
  if (type !== null)
    return array.find(e => e.type === type && e.id === id);
  else
    return array.find(e => e.id === id);
}

const ConceptGraph = ({ data, groupNodes }) => {
  const [nodeInfo, setNodeInfo] = React.useState('');
  // the graph configuration, just override the ones you need
  const myConfig = {
    highlightDegree: 2,
    highlightFontSize: 40,
    linkHighlightBehavior: true,
    nodeHighlightBehavior: true,
    highlightOpacity: 0.3,
    directed: true,
    staticGraphWithDragAndDrop: groupNodes,
    height: window.innerHeight,
    width: window.innerWidth,
    initialZoom: 1.2,
    node: {
      color: "lightgrey",
      highlightStrokeColor: "orange",
      labelPosition: 'center',
      highlightFontWeight: 'bold',
    },
    link: {
      highlightColor: "orange",
      highlightFontWeight: 'bold',
      markerWidth: 10,
      markerHeight: 10,
      strokeWidth: 1.5,
    },
    d3: {
      gravity: 0,
      linkLength: 180,
    },
  };

  // click node handler
  const onClickNode = function (nodeId) {
    const node = findNode(data.nodes, null, nodeId);
    switch (node.type) {
      case 'course':
        window.open(`/student/courses/${node.id}/${node.term}`);
        break;

      case 'lecture':
        window.open(`/student/courses/${node.course_code}/${node.course_term}/${node.lecture_id}`);
        break;

      case 'concept':
        window.open(`/student/knowledge-base/${node.id}`);
        break;

      default:
        alert("ERROR: Unknown type");
        break;
    }
  };

  const nodeProperties = ['color', 'type', 'size', 'x', 'y', 'symbolTypee', 'course_id', 'notes_id']
  return (
    <div style={{ overflow: 'hidden' }}>
      <ul style={{ height: '80px' }}>
        {
          Object.keys(nodeInfo).map((key, idx) =>
            nodeProperties.indexOf(key) === -1 &&
            <li key={idx}><strong>{key}</strong>: {nodeInfo[key]}</li>
          )
        }
      </ul>
      <Graph
        id="graph-id"
        data={data}
        config={myConfig}
        onClickNode={onClickNode}
      // onMouseOverNode={onMouseOverNode}
      // onMouseOutNode={onMouseOutNode}
      />
    </div>
  )
}

export default ConceptGraph;