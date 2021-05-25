import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Button } from '@material-ui/core';

import GetAppIcon from '@material-ui/icons/GetApp';
import EditIcon from '@material-ui/icons/Edit';
import RemoveIcon from '@material-ui/icons/Remove';

import { DetailsCard } from '../detailsCard/DetailsCard'
import { EditTopicDialog } from '../editTopicDialog/EditTopicDialog'
import { openEditDialog, selectIsDialogOpen } from '../editTopicDialog/editTopicDialogSlice'
import {
    focusNode,
    blurNode,
    selectFocusedNode,
    selectNodes,
    selectLinks,
    removeTopic,
    loadAllTopics
} from '../topicGraph/topicGraphSlice';

import { DocumentViewer } from '../documentViewer/DocumentViewer'


// todo match the colour of the node!

import './TopicDetails.css'

import arrow from './assets/arrow.svg';
import { MarkdownEditor } from '../markdownEditor/MarkdownEditor';

import { ExportMenu } from '../exportMenu/ExportMenu';
import { setAnchorEl, openExportMenu } from '../exportMenu/exportMenuSlice';
import { selectValue } from '../disciplineDropdown/disciplineDropdownSlice';

// TODO adjust so it cannot import ui components across?
// TODO enforce character limits when getting user input to add node
// TODO 4 detailsCards in a grid 
export const TopicDetails = () => {
    const isOpenEditDialog = useSelector(selectIsDialogOpen)

    const focusedNodeId = useSelector(selectFocusedNode);
    const nodes = useSelector(selectNodes);
    const links = useSelector(selectLinks);

    const disciplineVal = useSelector(selectValue);
    const dispatch = useDispatch();
    // console.log('NODES!!! ', nodes);
    const topicNode = nodes.find((node) => { return node.id === focusedNodeId });
    // finds current prereq objects
    const findCurrPrereqObjs = (ts, ps) => {
        let curr = [];
        ts.forEach(t => {
            if (ps.includes(t.title)) {
                curr.push(t);
            }
        });
        return curr;
    }
    const { id, title, description, group, discipline, prerequisite_strings, materials_strings } = topicNode;
    // console.log(materials_strings);
    console.log('TOPIC NODE: ', id, title, description, group, discipline, prerequisite_strings, materials_strings)
    return (
        <div className="backdrop">

            {/* viewing documents online */}
            <DocumentViewer />
            {/* editing markdown online */}
            <MarkdownEditor />
            <div className="details-grid">
                <div className="arrow" id="arrow-1"><img src={arrow} width="100" alt="arrow" ></img></div>
                <DetailsCard topicId={topicNode.id} stage="Content" materials={materials_strings.content}></DetailsCard>
                <div className="arrow" id="arrow-2"><img src={arrow} width="100" alt="arrow" ></img></div>
                <DetailsCard topicId={topicNode.id} stage="Preparation" materials={materials_strings.preparation}></DetailsCard>

                {/* <div id="circle"> */}
                {/* <div id="circle">
                    <div >
                        <Typography variant="h4">{topicNode.title}</Typography>
                        <Typography variant="subtitle1"> {topicNode.description}</Typography>
                        <Button className="button">Export All</Button>
                        <Button className="button">Remove Topic</Button>
                    </div>
                </div> */}
                <div style={{ zIndex: "1000" }}>

                    <svg width="100%" height="100%">
                        <circle cx="225" cy="120" r="115" fill="grey" />
                        <text x="50%" y="30%" textAnchor="middle" fill="#fff" dy=".3em">
                            {/* <tspan x="20%" dy=".6em">Text In</tspan>
                        <tspan x="20%" dy="1.2em">Two Lines</tspan> */}
                            <tspan x="50%" dy=".0em" style={{ fontSize: "30px", fontWeight: "bold" }}>
                                {topicNode.title}
                            </tspan>
                            <tspan x="50%" dy="2.4em" style={{ fontSize: "18px" }}>
                                {topicNode.description}
                            </tspan>
                            <tspan x="50%" dy="1.8em" style={{ fontSize: "15px" }}>
                                Prerequisites: {topicNode.prerequisite_strings}
                            </tspan>
                            <tspan x="50%" dy="2.8em" style={{ fontSize: "12px" }}>
                                {topicNode.group} in {topicNode.discipline}
                            </tspan>
                        </text>
                    </svg>

                    <ExportMenu />

                    <div>

                        <Button
                            className="button"
                            style={{
                                background: "grey",
                                marginRight: "5px",
                                float: "inherit",
                                color: "white",
                                // position: "relative",
                                left: "15%",
                            }}
                            startIcon={<GetAppIcon />}
                            onClick={(e) => {
                                console.log('target: ', e)
                                dispatch(setAnchorEl({ x: e.clientX, y: e.clientY }))

                                // TODO: 
                                dispatch(openExportMenu())
                            }}
                        >Export All</Button>

                        <Button
                            className="button"
                            style={{
                                background: "grey",
                                marginLeft: "5px",
                                float: "inherit",
                                color: "white",
                                left: "15%",
                            }}
                            startIcon={<EditIcon />}
                            onClick={
                                () => {
                                    console.log('open edit dialog!', topicNode);
                                    const ps = findCurrPrereqObjs(nodes, prerequisite_strings);

                                    console.log('disptaching: ', topicNode.id, topicNode.title, topicNode.description,
                                        topicNode.group, topicNode.discipline, ps)
                                    dispatch(openEditDialog({
                                        id: topicNode.id, title: topicNode.title, descript: topicNode.description,
                                        group: topicNode.group, discipline: topicNode.discipline, ps: ps
                                    }));// IMPORTANT THIS MIGHT BE CAUSING EDIT BUG - TODO edit this so that the material string passed in is actually ids?
                                    console.log('ahhh')
                                }
                            }
                        >Edit</Button>


                        {isOpenEditDialog && <EditTopicDialog />}

                        <Button
                            className="button"
                            style={{
                                background: "grey",
                                marginLeft: "5px",
                                float: "inherit",
                                color: "white",
                                left: "15%",
                            }}
                            startIcon={<RemoveIcon />}
                            onClick={
                                () => {
                                    dispatch(removeTopic({ topicNode, disciplineVal }))
                                        && dispatch(blurNode(topicNode.id))
                                }
                            }
                        >Remove</Button>
                    </div>

                </div>

                <DetailsCard topicId={topicNode.id} stage="Practice" materials={materials_strings.practice}></DetailsCard>
                <div></div>
                <DetailsCard topicId={topicNode.id} stage="Assessment" materials={materials_strings.assessment}></DetailsCard>
                <div className="arrow" id="arrow-3"><img src={arrow} width="100" alt="arrow" ></img></div>
            </div>
        </div >
    );
}