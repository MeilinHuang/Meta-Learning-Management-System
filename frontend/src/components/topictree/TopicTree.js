import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './TopicTree.css';
import TopicTreeHeader from "./TopicTreeHeader.js"
import TopicTreeViewResource from "./TopicTreeViewResource.js"
import { useDisclosure } from '@chakra-ui/hooks';

var g;
var svg

function zoomed() {
    g.attr("transform", d3.event.transform);
}

export default function TopicTree() {
    const ref = useRef();
    const dataset = [100, 200, 300, 400, 500];
    const [data, setData] = useState([]);
    const [listPrereqs, setListPrereqs] = useState([]);
    const [selectedNode, setSelectedNode] = useState({
        "id": 0,
        "title": "",
        "prerequisite_strings": [],
        "description": "",
        "materials_strings": {
            "preparation": [],
            "content": [],
            "practice": [],
            "assessment": []
        },
        "group": "",
        "discipline": "",
        "creator": ""
    });
    const links = [
        {
            name: 'Home',
            url: '/',
        },
        {
            name: 'Course Outline',
            url: '/course-outline',
        },
        {
            name: 'Content',
            url: '/content',
        },
        {
            name: 'Forums',
            url: '/forums',
        },
        {
            name: 'Support',
            url: '/support',
        },
        {
            name: 'Topic Tree',
            url: '/topictree'
        }
    ];
    const [isOpen, setOpen] = useState(false);
    const { 
        isOpen: isOpenModal, 
        onOpen: onOpenModal, 
        onClose: onCloseModal 
    } = useDisclosure();


    const getListOfPrerequisites = (id, data) => {
        console.log('id', id);
        console.log('data', data);
        let linksArray = [];
        for (let i = 0; i < data.links.length; i++) {
            if (data.links[i].target.id === id) {
                linksArray.push(data.links[i].source.id);
            }
        }
        console.log(linksArray);
        let prereqs = [];
        for (let i = 0; i < data.nodes.length; i++) {
            for (let j = 0; j < linksArray.length; j++) {
                if (data.nodes[i].id == linksArray[j]) {
                    prereqs.push(data.nodes[i].title);
                    break;
                }
            }
        }
        console.log('prereqs', prereqs);
        setListPrereqs(prereqs);
    }

    // Runs on start, used for testing mainly
    useEffect(() => {

        
        console.log('running');
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

        
        // https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json
        fetch('/topic-tree-example.json')
        .then((res) => res.json())
        .then( function(data) {
            
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
                    console.log("node clicked", d3.select(this).text());
                    let nodeData = data.nodes.filter(function (dataValue) {
                        console.log(dataValue);
                        return dataValue.title === topicName;
                    });
                    console.log('nodeData', nodeData);

                    setSelectedNode(nodeData[0]);
                    getListOfPrerequisites(nodeData[0].id, data);
                    onOpenModal();


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
                
        
            simulation
                .nodes(data.nodes)
                .on("tick", ticked);
            simulation.force("link")
                .links(data.links);

    
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
    }, [data]);

    return (
        <div>
            <TopicTreeHeader id="topic-tree-header"></TopicTreeHeader>
            <div id="graph" ref={ref} />
            <TopicTreeViewResource data={selectedNode} isOpen={isOpenModal} onClose={onCloseModal} prereqs={listPrereqs} />
        </div>

    )
}