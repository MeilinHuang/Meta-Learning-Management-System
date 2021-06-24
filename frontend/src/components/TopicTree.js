import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

var g;
function zoomed() {
    console.log('zoomed!');
    g.attr("transform", d3.event.transform);
}


export default function TopicTree() {
    const ref = useRef();
    const dataset = [100, 200, 300, 400, 500];
    const [data, setData] = useState([]);

 

    // Runs on start, used for testing mainly
    useEffect(() => {
        console.log('running');
        let size = 500;
        let width = 500;
        let height = 500;
        let zoom = d3.zoom()
            .scaleExtent([0.3, 2])
            .on("zoom", zoomed);
        const svg = d3.select(ref.current)
                        .append("svg")
                        .attr("width", size)
                        .attr("height", size)
                        .call(zoom)
        g = svg.append("g");
        let rect_width = 95;

        // svgElement.selectAll('rect')
        //    .data(dataset)
        //    .enter()
        //    .append('rect')
        //    .attr('x', (d, i) => 5 + i*(rect_width + 5))
        //    .attr('y', d => size - d)
        //    .attr('width', rect_width)
        //    .attr('height', d => d)
        //    .attr('fill', 'teal');
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json")
        .then( function(data) {
            console.log("data", data);
            // Initialize the links
            var link = svg
                .selectAll("line")
                .data(data.links)
                .enter()
                .append("line")
                .style("stroke", "#aaa")
    
            // Initialize the nodes
            var node = svg
                .selectAll("circle")
                .data(data.nodes)
                .enter()
                .append("circle")
                .attr("r", 20)
                .style("fill", "#69b3a2")
    
            // Let's list the force we wanna apply on the network
            var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
                .force("link", d3.forceLink()                               // This force provides links between nodes
                        .id(function(d) { return d.id; })                     // This provide  the id of a node
                        .links(data.links)                                    // and this the list of links
                )
                .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
                .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
                .on("end", ticked);
    
            // This function is run at each iteration of the force algorithm, updating the nodes position.
            function ticked() {
                link
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });
    
                node    
                    .attr("cx", function (d) { return d.x+6; })
                    .attr("cy", function(d) { return d.y-6; });
            }

            
    
        });
    }, [data]);

    return (
        <div ref={ref} />
    )
}