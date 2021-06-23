import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function TopicTree() {
    const ref = useRef();
    const dataset = [100, 200, 300, 400, 500];
    const [data, setData] = useState([]);

    const getData = () => {
        fetch('topic-tree-example.json',
        {
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(function(response) {
            console.log(response);
            return response.json();
        }).then(function(myJson) {
            setData(myJson);
        });
    }

    // Runs on start, used for testing mainly
    useEffect(() => {
        const svgElement = d3.select(ref.current)
        svgElement.attr('id', 'network') // give a network id
        // console.log('ref: ', ref.current)
        // helper(svgElement, data)
        // console.log('onClickNode function: ', onClickNode);
        drawNetwork(data, svgElement, onClickNode, onClickNetwork);
    }, [data]);

    return (
        <div ref={ref} />
    )
}