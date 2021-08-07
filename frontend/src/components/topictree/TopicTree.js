import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './TopicTree.css';
import TopicTreeHeader from "./TopicTreeHeader.js"
import { Button, Text, Heading, Box, Input, Flex, InputGroup, InputLeftElement, Stack, Divider } from '@chakra-ui/react';
import { SearchIcon, ArrowRightIcon } from '@chakra-ui/icons'
import TopicTreeViewResource from "./TopicTreeViewResource.js"
import { useDisclosure } from '@chakra-ui/hooks';
import { backend_url, get_topics_url, get_topic_groups } from '../../Constants.js';

var g;
var svg

function zoomed() {
    g.attr("transform", d3.event.transform);
}

export default function TopicTree({ match: { params: { topicGroup }}}) {
    const ref = useRef();
    const [data, setData] = useState([]);
    const [listPrereqs, setListPrereqs] = useState([]);
    const [notListPrereqs, setNotListPrereqs] = useState([]);
    const [selectedNode, setSelectedNode] = useState({
        "id": 0,
        "title": "",
        "prerequisite_strings": [],
        "description": "",
        "materials_strings": {
            "preparation": [],
            "content": [],
            "practice": [],
            "assessments": []
        },
        "group": "",
        "discipline": "",
        "creator": ""
    });
    const { 
        isOpen: isOpenModal, 
        onOpen: onOpenModal, 
        onClose: onCloseModal 
    } = useDisclosure();

    const treeStructure = (jsonData) => {
        let newJson = {
            "nodes": [{}],
            "links": []
        };
        for (let topic of jsonData.topics_list) {
            let node = {};
            node["id"] = topic.id;
            node["title"] = topic.name;
            node["materials_strings"] = {};
            node.materials_strings["content"] = [];
            node.materials_strings['preparation'] = [];
            node.materials_strings['practice'] = [];
            node.materials_strings['assessments'] = [];
            for (let course_material of topic.course_materials) {
                if (course_material.type === 'preparation') {
                    node.materials_strings.preparation.push(course_material.name);
                } else if (course_material.type === 'assessment') {
                    node.materials_strings.assessments.push(course_material.name);
                } else if (course_material.type === 'practice') {
                    node.materials_strings.practice.push(course_material.name);
                } else {
                    node.materials_strings.content.push(course_material.name);
                }
            }
            
            newJson.nodes.push(node);
            for (let prereq of topic.prereqs) {
                newJson.links.push({
                    'source': prereq.id,
                    'target': topic.id
                });
            }
        }
        
        return newJson;
    }


    const getListOfPrerequisites = (id, data) => {
        
        
        let linksArray = [];
        for (let i = 0; i < data.links.length; i++) {
            if (data.links[i].target.id === id) {
                linksArray.push(data.links[i].source.id);
            }
        }
        
        let prereqs = [];
        let nodes = [];
        console.log('data', data.nodes);
        for (let i = 0; i < data.nodes.length; i++) {
            let found = false;
            for (let j = 0; j < linksArray.length; j++) {
                if (data.nodes[i].id === linksArray[j]) {
                    prereqs.push({'name': data.nodes[i].title, 'id': data.nodes[i].id});
                    found = true;
                    break;
                }
            }
            if (!found && data.nodes[i].id !== undefined && data.nodes[i].title !== undefined && data.nodes[i].id !== id) {
                nodes.push({'value': data.nodes[i].id.toString(), 'label': data.nodes[i].title});
            }
        }
        console.log('nodes', nodes);
        setListPrereqs(prereqs);
        setNotListPrereqs(nodes);
        onOpenModal();
    }

    useEffect(() => {

        
        
        let size = 500;

        let width = window.innerWidth;
        let height = window.innerHeight - document.getElementById('topic-tree-header').getBoundingClientRect().height;
        let zoom = d3.zoom()
            .scaleExtent([0.3, 4])
            .on("zoom", zoomed);
        svg = d3.select(ref.current)
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .call(zoom);
        g = svg.append("g")
        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(400))
            .force("charge", d3.forceManyBody().strength(-70))
            .force("center", d3.forceCenter(width / 2, height / 2));

        //fetching topic groups
        //could be done in a promise all to improve performance
        fetch(get_topic_groups()).then(e => {
            return e.json()
        }).then(e => {
            setData(e)
        })

        // https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json
        fetch(get_topics_url(topicGroup))
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            
            return treeStructure(res);
        })
        .then( function(data) {
            let preprocessedData = {};
            // make it easier to access instead of having to traverse data.nodes each time
            for (let node of data.nodes) {
                if (node.hasOwnProperty('id')) {
                    preprocessedData[node.id.toString()] = node;
                }
            }
            
            // arrow heads
            svg.append("svg:defs").selectAll("marker")
                .data(["end"])
                .enter().append("svg:marker")
                .attr("id", String)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 43) // whereabouts it is on the line - TODO adjust this dependon if we are talking about distance of hull or topic nodes
                .attr("refY", 0)
                .attr("markerWidth", 10)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5");

            // Initialize the links
            var link = g.append('g')
                .attr('class', 'links')
                .selectAll('path')
                .data(data.links)
                .enter()
                .append('path')
                .attr('class', function (d) { return 'link'; })
                .attr("marker-end", (d) => { return "url(#end)" })
                .style("fill", 'none')
                .style("stroke", "#666")
                .style("stroke-width", "1.5px")
                .style("opacity", 0.8);
                
            
            // Initialize the nodes
            var node = g
                .attr("class", "nodes")
                .selectAll("g")
                .data(data.nodes)
                .enter().append("g")
                .on("click", function() {
                    let topicName = d3.select(this).text();
                    
                    let nodeData = data.nodes.filter(function (dataValue) {
                        
                        return dataValue.title === topicName;
                    });
                    

                    setSelectedNode(nodeData[0]);
                    getListOfPrerequisites(nodeData[0].id, data);



                });
            let radius = 30;
            var circles = node.append("circle")
            .attr("r", radius)
            .attr("fill",'#ADD8E6')
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
                
            var lables = node.append("text")
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .style("font-size", "8px")
                .append('tspan')
                .text(function(d) {
                  return d.title;
                })
            
            var linkNodes = [];
            data.links.forEach(function(link) {
                linkNodes.push({
                    source: preprocessedData[link.source],
                    target: preprocessedData[link.target]
                });
            });
            
            
            simulation
                .nodes(data.nodes.concat(linkNodes))
                .on("tick", ticked);
            simulation.force("link")
                .links(data.links.concat(linkNodes));

    
            // This function is run at each iteration of the force algorithm, updating the nodes position.
            function ticked() {
                link.attr('d', function (d) {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = Math.sqrt(dx * dx + dy * dy);
    
                    var val2 = 'M' + d.source.x + ',' + d.source.y + 'L' + (d.target.x) + ',' + (d.target.y);
                    return val2;
                });
            
                node.attr("transform", function(d) {
                      return "translate(" + d.x + "," + d.y + ")";
                    })
                    
            }

            function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }
              
            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }
              
            function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }
        });
    }, []);

    return (
        <div>
            <TopicTreeHeader id="topic-tree-header" topicGroupName={topicGroup} view={"Graph View"}></TopicTreeHeader>
            <div id="graph" ref={ref} />
            <TopicTreeViewResource data={selectedNode} isOpen={isOpenModal} onClose={onCloseModal} prereqs={listPrereqs} topicGroupName={topicGroup} nodes={notListPrereqs} />
        </div>
    );
    
}
