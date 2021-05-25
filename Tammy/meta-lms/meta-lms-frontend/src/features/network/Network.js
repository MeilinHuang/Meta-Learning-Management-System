import { render } from '@testing-library/react';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as d3Collection from 'd3-collection';
// import { helper, removeAll } from './fakeData.js';
import { selectData, selectNetworkData, updateNetworkData } from './networkSlice.js';

import { useSelector, useDispatch } from 'react-redux';
import { drawNetwork, removeAll } from './helper.js';
import {
    focusNode,
    blurNode,
    selectFocusedNode,
    selectNodes,
    selectLinks,
    loadAllTopics,
} from '../topicGraph/topicGraphSlice';

import './Network.css'
import { dispatch } from 'd3';
// export const Network = () => {

//     return (<div></div>);

// }

// https://wattenberger.com/blog/react-and-d3
// https://medium.com/@varvara.munday/d3-in-react-a-step-by-step-tutorial-cba33ce000ce


// https://blog.logrocket.com/data-visualization-in-react-using-react-d3-c35835af16d0/

// TODO: keep this indenependent and not accessing global data but only data passed down via props!


// TODO: make nodes draggable!
export const NetworkGraph = ({ data }) => {
    const ref = useRef();
    const dispatch = useDispatch();
    const nodes = useSelector(selectNodes);
    const links = useSelector(selectLinks);

    // const data = useSelector(selectData);
    const networkData = useSelector(selectNetworkData);
    // console.log('Network Graph prop: ', data)
    // console.log('network data: ', networkData);
    // https://dev.to/robmarshall/how-to-use-componentwillunmount-with-functional-components-in-react-2a5g
    const onClickNode = (nodeId) => {
        // console.log('CLICKED OMG!', nodeId);
        dispatch(focusNode(nodeId))
    }
    const onClickNetwork = () => {
        // console.log('graph clicked');
        dispatch(blurNode());
    }

    // const data = { 'nodes': nodes, 'links': links }
    useEffect(() => { // problem - when react component rerenders - it adds ontop of what is there already
        // dispatch(updateNetworkData(data));
        // console.log('Mounting Network')
        // console.log('data: ', data)


        console.log('data to draw on network: ', data)
        removeAll(); //- todo
        const svgElement = d3.select(ref.current)
        svgElement.attr('id', 'network') // give a network id
        // console.log('ref: ', ref.current)
        // helper(svgElement, data)
        // console.log('onClickNode function: ', onClickNode);
        drawNetwork(data, svgElement, onClickNode, onClickNetwork);

        // drawNetwork(networkData, svgElement);



        // init(networkData);
        return () => {
            // Anything in here is fired on component unmount.

        }
    }, [data]);
    // useEffect(() => {

    //     // initChart(400, 600);
    //     // changeChart();
    //     // d3.select('#network')
    //     //     .append('p')
    //     //     .text('‘Hello from D3’')

    //     console.log('TESTINg')
    //     console.log('data: ', data)

    //     // var svg = d3.select("#network")

    //     // var svg = d3.select(ref.current)
    //     // svg.append("circle")
    //     //     .attr("cx", 2).attr("cy", 2).attr("r", 40).style("fill", "blue");
    //     // svg.append("circle")
    //     //     .attr("cx", 140).attr("cy", 70).attr("r", 40).style("fill", "red");
    //     // svg.append("circle")
    //     // //     .attr("cx", 300).attr("cy", 100).attr("r", 40).style("fill", "green");
    //     // let size = 500;
    //     // let svg = d3.select(ref.current)
    //     //     .append('svg')
    //     //     .attr('width', size)
    //     //     .attr('height', size)

    //     // let rect_width = 95;
    //     // svg.selectAll('rect')
    //     //     .data(data)
    //     //     .enter()
    //     //     .append('rect')
    //     //     .attr('x', (d, i) => 5 + i * (rect_width + 5))
    //     //     .attr('y', d => size - d)
    //     //     .attr('width', rect_width)
    //     //     .attr('height', d => d)
    //     //     .attr('fill', 'teal')
    //     // console.log(ref.current.height)
    //     const svgElement = d3.select(ref.current)
    //     console.log('ref: ', ref.current)
    //     helper(svgElement, data)
    //     // TODO: test variable datasets passed in via props
    //     // then convert my code to something similar to this!
    // }, []);

    // const style = {
    //     width: '100%',
    //     height: '100%'
    // }

    return (
        // <div ref={this.myRef}>
        // </div>
        <>
            {/* <div>Chart, data: {data}</div> */}
            {/* < div id="network" style={style}>1</div > */}
            <svg ref={ref} />
        </>
    );


}


