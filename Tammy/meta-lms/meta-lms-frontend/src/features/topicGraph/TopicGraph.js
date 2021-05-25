import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Graph } from "react-d3-graph";
import {
    focusNode,
    blurNode,
    selectFocusedNode,
    selectNodes,
    selectLinks,
    loadAllTopics,
} from './topicGraphSlice';
import { config } from './config';

import { NewTopicDialog } from '../newTopicDialog/NewTopicDialog';
import { TopicDetails } from '../topicDetails/TopicDetails';
import { LearningMaterialViewer } from '../learningMaterialViewer/LearningMaterialViewer';
import { SearchBar } from '../searchBar/SearchBar';


import { NetworkGraph } from '../network/Network';
import './TopicGraph.css';
import { selectValue } from '../disciplineDropdown/disciplineDropdownSlice';

// TODO: make sure you are fetching from the right URL + cross origin settings are right for locally

// TODO: track mouse clicks when when mousecclick and a node is focused - expand the divs
// add
// remove
// edit
// search
// basics from last term^

export const TopicGraph = () => {
    const focusedNodeId = useSelector(selectFocusedNode);
    const nodes = useSelector(selectNodes);
    const links = useSelector(selectLinks);
    const dispatch = useDispatch();

    const disciplineVal = useSelector(selectValue);

    useEffect(() => {
        console.log('topic graph remounted!')
        dispatch(loadAllTopics({ disciplineVal }));
    }, [dispatch]);

    // useEffect(() => {
    //     console.log('topic graph remounted!')
    //     dispatch(loadAllTopics());
    // });

    const data = {
        'nodes': nodes,
        'links': links
    }
    console.log('DATA: ', data)
    return <>

        <div className="graph-container">
            {/* <SearchBar className="graph-part" id='search' /> */}
            {focusedNodeId !== "" && <TopicDetails className="graph-part" id="topic-details" />}
            {/* <LearningMaterialViewer /> */}
            <div className="graph-part" id="graph">

                <NetworkGraph data={data} />
                {/* <Graph

                    id='graph'
                    data={{
                        nodes: nodes,
                        links: links,
                        focusedNodeId: focusedNodeId
                    }}
                    config={config}
                    onClickNode={(nodeId) => dispatch(focusNode(nodeId))}
                    onClickGraph={() => { console.log('graph clicked'); dispatch(blurNode()) }}
                // onDoubleClickNode={onDoubleClickNode}
                // onRightClickNode={this.onRightClickNode}

                // onClickLink={onClickLink}
                // onRightClickLink={onRightClickLink}
                // onMouseOverNode={onMouseOverNode}
                // onMouseOutNode={onMouseOutNode}
                // onMouseOverLink={onMouseOverLink}
                // onMouseOutLink={onMouseOutLink}
                // onNodePositionChange={onNodePositionChange}
                /> */}
            </div>
        </div>
    </>
}