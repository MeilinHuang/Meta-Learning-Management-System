
// https://medium.com/@varvara.munday/d3-in-react-a-step-by-step-tutorial-cba33ce000ce

import * as d3 from 'd3';
import * as d3Collection from 'd3-collection';

var globalData = {
    'nodes': [
        {
            'id': 1,
            'title': "Pointers",
            'prerequisites': ["Variables", "Structs"],
            'description': "Lorem Ipsum",
            'preparation': {
                'attachments': ["prereading.pdf"]
            },
            'content': {
                'attachments': ["slides.pdf", "lecture.mp4"]
            },
            'practice': {
                'attachments': ["exercise_set.pdf"]
            },
            'assessment': {
                'attachments': ["quiz.pdf"]
            },
            'group': 'C Programming'
        },
        {
            'id': 2,
            'title': "Struct",
            'prerequisites': ["Variables"],
            'description': "Lorem Ipsum",
            'preparation': {
                'attachments': ["prereading.pdf"]
            },
            'content': {
                'attachments': ["slides.pdf", "lecture.mp4"]
            },
            'practice': {
                'attachments': ["exercise_set.pdf"]
            },
            'assessment': {
                'attachments': ["quiz.pdf"]
            }, 'group': 'C Programming'
        },
        {
            'id': 3,
            'title': "Memory Allocation",
            'prerequisites': ["Pointers"],
            'description': "Lorem Ipsum",
            'preparation': {
                'attachments': ["prereading.pdf"]
            },
            'content': {
                'attachments': ["slides.pdf", "lecture.mp4"]
            },
            'practice': {
                'attachments': ["exercise_set.pdf"]
            },
            'assessment': {
                'attachments': ["quiz.pdf"]
            }, 'group': 'C Programming'
        },
        {
            'id': 4,
            'title': "Variables",
            'prerequisites': ["Variables", "Structs"],
            'description': "Lorem Ipsum",
            'preparation': {
                'attachments': ["prereading.pdf"]
            },
            'content': {
                'attachments': ["slides.pdf", "lecture.mp4"]
            },
            'practice': {
                'attachments': ["exercise_set.pdf"]
            },
            'assessment': {
                'attachments': ["quiz.pdf"]
            }, 'group': 'C Programming'
        },
        {
            'id': 5,
            'title': "Linked List",
            'prerequisites': ["Pointers", "Structs"],
            'description': "Lorem Ipsum",
            'preparation': {
                'attachments': ["prereading.pdf"]
            },
            'content': {
                'attachments': ["slides.pdf", "lecture.mp4"]
            },
            'practice': {
                'attachments': ["exercise_set.pdf"]
            },
            'assessment': {
                'attachments': ["quiz.pdf"]
            }, 'group': 'C Programming'
        },
        {
            'id': 6,
            'title': "Doubly Linked List",
            'prerequisites': ["Linked List"],
            'description': "Lorem Ipsum",
            'preparation': {
                'attachments': ["prereading.pdf"]
            },
            'content': {
                'attachments': ["slides.pdf", "lecture.mp4"]
            },
            'practice': {
                'attachments': ["exercise_set.pdf"]
            },
            'assessment': {
                'attachments': ["quiz.pdf"]
            }, 'group': 'Data Structures and Algorithms'
        },
        {
            'id': 7,
            'title': "Binary Tree",
            'prerequisites': ["Linked List"],
            'description': "Lorem Ipsum",
            'preparation': {
                'attachments': ["prereading.pdf"]
            },
            'content': {
                'attachments': ["slides.pdf", "lecture.mp4"]
            },
            'practice': {
                'attachments': ["exercise_set.pdf"]
            },
            'assessment': {
                'attachments': ["quiz.pdf"]
            }, 'group': 'Data Structures and Algorithms'
        }
    ],
    'links': [
        { 'source': "4", 'target': "2" },
        { 'source': "4", 'target': "1" },
        { 'source': "2", 'target': "1" },
        { 'source': "1", 'target': "3" },
        { 'source': "1", 'target': "5" },
        { 'source': "2", 'target': "5" },
        { 'source': "3", 'target': "5" },
        { 'source': "5", 'target': "6" },
        { 'source': "5", 'target': "7" }
    ]
}

function getGroup(n) { return n.group; }

function network(data, prev, checkGroup, expand) { // prev is the previous net
    // console.log('network function called!')
    var cnode, groupIndex, mappedNodes = [], mappedLinks = [], clink, tempN, tempL = [], newNodes = [], soIn, taIn, lw = 0, newLinks = [];
    // console.log('previous network: ', prev);
    // console.log('network data:', data)
    let nodes, links;
    // if the prev network exists
    // if (prev) {
    //     console.log('prev exists!')
    //     // update the expand
    //     // if there is no hulls that need to be expanded
    //     // rid the ex
    //     // TODO check expanded, nodes and links all match - otherwise only update the discrepancies

    //     // pass in data from local storage as prev nodes later...
    //     for (var k = 0; k < data.nodes.length; k++) {
    //         cnode = data.nodes[k];
    //         groupIndex = checkGroup(cnode);
    //         if (expand[groupIndex]) { // if this node belongs to an expanded group

    //             // mappedNodes is the actual nodes displayed on the graph
    //             // if it is not already in the prev grph (by id)
    //             // push it to the prev graph
    //             let doesExist = false;
    //             let prevCnode;
    //             prev.nodes.forEach((node) => {
    //                 if (node.id === cnode.id) {
    //                     doesExist = true;
    //                     prevCnode = node;
    //                 }
    //             });
    //             if (!doesExist) { // add new node
    //                 mappedNodes.push(cnode);
    //             } else { // otherwise add the node alreay existing from prev graph
    //                 mappedNodes.push(prevCnode);
    //             }

    //             // mappedNodes.push(cnode);
    //             //if expand true, nodes condition expand
    //         } else { // this node in the data does not belong to the expanded group
    //             if (!newNodes[groupIndex]) { // not a node in an expanded group - if the group node has not been created
    //                 tempN = {
    //                     'id': groupIndex,
    //                     // 'label': 'domain ' + groupIndex,
    //                     'label': groupIndex,
    //                     // 'type': 'resource',
    //                     // 'size': 30,
    //                     'group': groupIndex
    //                 };
    //                 newNodes[groupIndex] = tempN;

    //                 let doesExist = false;
    //                 let prevTempN;
    //                 prev.nodes.forEach((node) => {
    //                     if (node.id === tempN.id) {
    //                         doesExist = true;
    //                         prevTempN = node;
    //                     }
    //                 });

    //                 if (!doesExist) { // add new node
    //                     mappedNodes.push(tempN);
    //                 } else { // otherwise add the node alreay existing from prev graph
    //                     mappedNodes.push(prevTempN);
    //                 }
    //                 // mappedNodes.push(tempN);
    //             }
    //             // if expand false, nodes condition collapse
    //         }
    //         //iterate through all data.nodes
    //     }

    //     for (var x = 0; x < data.links.length; x++) {
    //         clink = data.links[x];
    //         soIn = checkGroup(clink.source);
    //         taIn = checkGroup(clink.target);
    //         tempL = {};

    //         if (expand[soIn] && expand[taIn]) {

    //             soIn = clink.source.id;
    //             taIn = clink.target.id;
    //         } else if (!expand[soIn] && expand[taIn]) {

    //             soIn = soIn;
    //             taIn = clink.target.id;
    //         } else if (expand[soIn] && !expand[taIn]) {

    //             taIn = taIn;
    //             soIn = clink.source.id;
    //         } else if (!expand[soIn] && !expand[taIn]) {

    //             if (soIn == taIn) { soIn = ''; taIn = ''; }
    //         }
    //         // console.log(soIn, taIn);
    //         if (soIn != '' && taIn != '') {
    //             tempL = {
    //                 'source': soIn,
    //                 'target': taIn,
    //                 // 'type': clink.type,
    //                 'distance': 150,
    //                 // 'strength': 1
    //             }

    //             let doesExist = false;
    //             let prevTempL;
    //             prev.links.forEach((link) => {
    //                 if (link.source.id === tempL.source.id
    //                     && link.target.id === tempL.target.id) {
    //                     doesExist = true;
    //                     prevTempL = link;
    //                 }
    //             });

    //             if (!doesExist) { // add new node
    //                 mappedLinks.push(tempL);
    //             } else { // otherwise add the node alreay existing from prev graph
    //                 mappedLinks.push(prevTempL);
    //             }


    //             // mappedLinks.push(tempL);
    //         }
    //     }
    //     // console.log(mappedLinks);
    //     nodes = mappedNodes;
    //     links = mappedLinks;
    //     // endof if expand not empty
    //     return { nodes: nodes, links: links };
    //     // return prev;
    // }
    // console.log('EXPANNDD: ', expand, Object.getOwnPropertyNames(expand).length)
    if (Object.getOwnPropertyNames(expand).length == 0) { // if no expand - make every node expand

        // console.log('IN IF!')
        for (var j = 0; j < data.nodes.length; j++) {
            groupIndex = checkGroup(data.nodes[j]); // find the group name
            expand[groupIndex] = true;
        }
        nodes = data.nodes;
        links = data.links;
    } else {
        for (var k = 0; k < data.nodes.length; k++) {
            cnode = data.nodes[k];
            groupIndex = checkGroup(cnode);
            if (expand[groupIndex]) {
                mappedNodes.push(cnode);
                //if expand true, nodes condition expand
            } else {
                if (!newNodes[groupIndex]) {
                    tempN = {
                        'id': groupIndex,
                        // 'label': 'domain ' + groupIndex,
                        'title': groupIndex,
                        // 'type': 'resource',
                        // 'size': 30,
                        'group': groupIndex
                    };
                    newNodes[groupIndex] = tempN;
                    mappedNodes.push(tempN);
                }
                // if expand false, nodes condition collapse
            }
            //iterate through all data.nodes
        }

        // console.log('data.links: ', data.links)
        for (var x = 0; x < data.links.length; x++) {
            // console.log('link! ', x)
            clink = data.links[x];
            soIn = checkGroup(clink.source);
            taIn = checkGroup(clink.target);
            tempL = {};

            if (expand[soIn] && expand[taIn]) {

                soIn = clink.source.id;
                taIn = clink.target.id;
            } else if (!expand[soIn] && expand[taIn]) {

                soIn = soIn;
                taIn = clink.target.id;
            } else if (expand[soIn] && !expand[taIn]) {

                taIn = taIn;
                soIn = clink.source.id;
            } else if (!expand[soIn] && !expand[taIn]) {

                if (soIn == taIn) { soIn = ''; taIn = ''; }
            }
            // console.log('YAAA', soIn, taIn);
            if (soIn != '' && taIn != '') {
                tempL = {
                    'source': soIn,
                    'target': taIn,
                    // 'type': clink.type,
                    'distance': 150,
                    // 'strength': 1
                }
                mappedLinks.push(tempL);
            }
        }
        // console.log('mappedLinks: ', mappedLinks);
        nodes = mappedNodes;
        links = mappedLinks;
        // endof if expand not empty
    }
    // console.log('nodesss: ', nodes, 'linksss: ', links)
    return { nodes: nodes, links: links };
}

// https://jsfiddle.net/uc7oprx3/5/

///
function zoomed() {
    g.attr("transform", d3.event.transform);
}
// original zoom diff
var zoom = d3.zoom()
    .scaleExtent([0.3, 2])
    .on("zoom", zoomed);

// var canvas = document.getElementById('canvas');
// var w = canvas.clientWidth, h = canvas.clientHeight;\
// var w = window.innerWidth, h = window.innerHeight;
// var color = d3.scaleOrdinal(d3.schemeSet3);

var w = window.innerWidth;
var h = window.innerHeight;

var color = d3.scaleOrdinal(d3.schemeSet3);

// var svg = d3.select(canvas).append('svg') // zoomer
//     .attr('width', w)
//     .attr('height', h)
//     .call(zoom);
var svg;
// var rectWidth = 80,
//     rectHeight = 30;

var rectWidth = 80;
var rectHeight = 30;
var markerWidth = 10,
    markerHeight = 6,
    cRadius = 40, // play with the cRadius value
    refX = 70, //refX = cRadius + markerWidth,
    refY = 0, //refY = -Math.sqrt(cRadius),
    drSub = cRadius + refY;

// var markerWidth,
//     markerHeight,
//     cRadius, // play with the cRadius value
//     refX, //refX = cRadius + markerWidth,
//     refY, //refY = -Math.sqrt(cRadius),
//     drSub;


var towhite = "stroke";

var focus_node = null; highlight_node = null;

var towhite;

var focus_node, highlight_node;

var clicked_color;

var highlight_color = "blue";
var highlight_trans = 0.1;

var default_node_color = "#ccc";
//var default_node_color = "rgb(3,190,100)";
var default_link_color = "#888";

var highlight_color;
var highlight_trans;

var default_node_color;
//var default_node_color = "rgb(3,190,100)";
var default_link_color;

// var g = svg.append("g")
var g;
// .attr("class", "viz");
var net, convexHull, genCH, linkElements, nodeElements, textElements, circle, simulation, linkForce, args;

var expand = {}; // an object with fields for each "group"

// var linkedByIndex = {};
// data.links.forEach(function (d) {
//     linkedByIndex[d.source + "," + d.target] = true;
// });

// https://stackoverflow.com/questions/57151735/d3-stop-force-graph-from-moving-around-nodes-should-only-stay-where-moved
var groupFill = function (d, i) { return color(d.key); };
var offset = 0, groups, groupPath;

// my own functions
let globalOnClickNode;


function init(data) {
    globalData = data;
    // console.log('init data: ', globalData)
    if (simulation) { // reset graph
        // console.log(net.nodes)
        // console.log('linkElements: ', linkElements);
        // console.log('nodeElements: ', nodeElements);
        // console.log('convexHull: ', convexHull);
        // console.log('genCH: ', genCH);
        linkElements && linkElements.remove();
        nodeElements && nodeElements.remove();
        genCH && genCH.remove();
        convexHull && convexHull.remove();
        textElements && textElements.remove();
    }
    // console.log('expand on init: ', expand)
    // console.log(globalData)
    // https://stackoverflow.com/questions/33645587/capturing-saving-the-current-state-of-d3-js-visualization
    net = network(globalData, net, getGroup, expand);
    groups = d3.nest().key(function (d) { return d.group; }).entries(net.nodes);
    groupPath = function (d) { // important for claultaing the hull
        // console.log('dddd', d);
        // takes the number of nodes to work out how to draw thw hull
        // null when trying to make a hull with two nodes only - so need to a way around it
        // https://stackoverflow.com/questions/45912361/d3-how-to-draw-multiple-convex-hulls-on-groups-of-force-layout-nodes
        if (d.values.length === 1 && d.values[0].id !== d.values[0].group) { // when group value and id value is the same - it means this is a group node
            var fakePoints = [];
            // if (d.length == 1 || d.length == 2) {
            fakePoints = [[d.values[0].x + 0.001, d.values[0].y - 0.001],
            [d.values[0].x - 0.001, d.values[0].y + 0.001],
            [d.values[0].x - 0.001, d.values[0].y + 0.001]];
            // fakePoints = [[d.values[0].x + offset, d.values[0].y - offset],
            // [d.values[0].x - offset, d.values[0].y + offset],
            // [d.values[0].x - offset, d.values[0].y + offset]];
            // }
            return "M" + d3.polygonHull(d.values.map(function (i) { return [i.x, i.y]; })
                .concat(fakePoints))  //do not forget to append the fakePoints to the group data
                .join("L") + "Z";
            // return "M0,0L0,0L0,0Z"; // does not create a hull
        } else if (d.values.length === 1 && d.values[0].id === d.values[0].group) {
            // do nothing don't want hull for group node
        } else if (d.values.length === 2) {
            var arr = d.values.map(function (i) {
                return [i.x + offset, i.y + offset];
            })
            arr.push([arr[0][0], arr[0][1]]);
            return "M" + d3.polygonHull(arr).join("L") + "Z";
        } else {
            return "M" +
                d3.polygonHull(d.values.map(function (i) {
                    return [i.x + offset, i.y + offset];
                }))
                    .join("L") + "Z";
        }

    };
    convexHull = g.append('g').attr('class', 'hull');
    // simulation setup with all forces
    linkForce = d3
        .forceLink()
        .id(function (link) { return link.id })
    // .strength(function (link) { return 0.1 })

    var inpos = [], counterX = 1, inposY = [], counterY = 1;
    simulation = d3
        .forceSimulation()
        .force('link', linkForce)
        .force('forceX', d3.forceX(function (d) {
            if (inpos[d.group]) {
                // console.log(inpos);
                return inpos[d.group];
            } else {
                inpos[d.group] = w / counterX;
                // console.log(inpos);
                counterX++;
                return inpos[d.group];
            }
        }))
        .force('forceY', d3.forceY(function (d) {
            if (inposY[d.group]) {
                // console.log(inposY);
                return inposY[d.group];
            } else {
                inposY[d.group] = h / (Math.random() * (d.group.length - 0 + 1) + 1);
                // console.log(inposY);
                return inposY[d.group];
            }
        }))
        .force('charge', d3.forceManyBody().strength(-501))
        .force('center', d3.forceCenter(w / 2, h / 2))
        .force("gravity", d3.forceManyBody(1));

    // arrow head for line

    svg.append("svg:defs").selectAll("marker")
        .data(["end"])
        .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 55) // whereabouts it is on the line - TODO adjust this dependon if we are talking about distance of hull or topic nodes
        .attr("refY", refY)
        .attr("markerWidth", markerWidth)
        .attr("markerHeight", markerHeight)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");
    console.log('NETLINKS', net.links)
    linkElements = g.append('g')
        .attr('class', 'links')
        .selectAll('path')
        .data(net.links)
        .enter()
        .append('path')
        .attr('class', function (d) { return 'link'; })
        .attr("marker-end", (d) => { return "url(#end)" })
        .style("fill", 'none')
        .style("stroke", "#666")
        .style("stroke-width", "1.5px")
        .style("opacity", 0.8);
    // .style('marker-end', 'url(#mark-end-arrow)');
    // .attr('marker-end', function (d) {
    //         return 'url(#' + d.type + ')';
    //     });

    nodeElements = g.append('g').attr('class', 'nodes').selectAll('.node')
        .data(net.nodes)
        .enter().append('g')
        .attr('class', 'node');
    // .append('circle')
    // .attr("r", cRadius)
    // .attr("fill", function(d){ return color(d.group);});
    circle = nodeElements.append('circle')
        .attr('class', 'circle')
        .attr("r", function (d) { return d.id === d.group ? 40 : 30; }) // dependon if its a group node - different size
        .attr("fill", function (d) { return color(d.group); });

    textElements = g.append("g")
        .attr("class", "texts")
        .selectAll("text")
        .data(net.nodes)
        .enter().append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .append('tspan')
        // .attr('dx', function (d) {
        //     if (d.type == 'property') {
        //         return '40px';
        //     }
        // })
        // .attr('dy', function (d) {
        //     if (d.type == 'property') {
        //         return '18px';
        //     }
        // })
        .text(function (node) { return node.title });
    // https://stackoverflow.com/questions/10392505/fix-node-position-in-d3-force-directed-layout
    simulation.nodes(net.nodes).on('tick', () => {
        genCH = convexHull.selectAll("path")
            .data(groups)
            .attr("d", groupPath)
            .enter().insert("path", "circle")
            .style("fill", groupFill)
            .style("stroke", groupFill)
            .style("stroke-width", 140)
            .style("stroke-linejoin", "round")
            .style("opacity", .5)
            .on('click', function (d) {
                // console.log('data on click: ', d, d.key);
                // console.log('data on click: expand:', expand[d.key])
                expand[d.key] = false;
                // console.log('data on click: expand:', expand[d.key])
                init(globalData);
            })
        // .attr("d", groupPath);

        nodeElements
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })

        textElements
            .attr('x', function (node) { return node.x })
            .attr('y', function (node) { return node.y })
        linkElements
            .attr('d', function (d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);

                var val2 = 'M' + d.source.x + ',' + d.source.y + 'L' + (d.target.x) + ',' + (d.target.y);
                return val2;

            });
    })

    // node mouse events
    nodeElements
        .on("mouseover", function (d) {
            svg.style("cursor", "pointer");
            // link.style('stroke-width', function (l) {
            //     if (d === l.source || d === l.target)
            //         return 4;
            //     else
            //         return 2;
            // });
            if (focus_node !== null) d = focus_node;
            highlight_node = d;

            if (highlight_color != "white") {
                circle.style(towhite, function (o) {
                    return d.id === o.id ? highlight_color : "black";
                });
                //             linkElements.style("stroke", function(o) {
                // 		      return o.source.index == d.index || o.target.index == d.index ? highlight_color : ((isNumber(o.score) && o.score>=0)?color(o.score):default_link_color);
                // });
            }
        })
        .on("mouseout", function (d) {
            svg.style("cursor", "default");

            highlight_node = null;
            if (focus_node === null) {
                // svg.style("cursor", "move");
                if (highlight_color != "black") {
                    circle.style(towhite, "black");
                    // linkElements.style("stroke", function (o) { return (isNumber(o.score) && o.score >= 0) ? color(o.score) : default_link_color });
                }

            }
        })
        .on("mousedown", function (d) {
            // console.log('mouse down')
            d3.event.stopPropagation();
            // console.log('node clicked: ', d);
            // if id is not the same as group then we are clicking on a topic node
            // centerNode(d);
            // globalOnClickNode(d.id)

            // centerNode(d.x, d.y) -- TODO only use this for search

            if (d.id !== d.group) {
                // console.log('topic clicked: ', d);

                // change colour to swho inetractivity
                circle.style('fill', function (o, i) {
                    // console.log('d', d, 'o', o)

                    if (d.id === o.id) { clicked_color = d3.select(this).style('fill'); }
                    return d.id === o.id ? highlight_color : d3.select(this).style('fill');
                });

                // TODO open up https://stackoverflow.com/questions/46294323/how-to-get-color-of-current-selected-object-using-d3
            } else {
                setExpand(d); // expands clicked node
            }
        }).on("mouseup", function (d) {
            // console.log('MOUSE UP')
            // globalOnClickNode(d.id)
            d3.event.stopPropagation();
            delay(50).then(() => {
                // console.log('mouse up', d, d.style);
                circle.style('fill', function (o, i) {
                    // console.log('mouse up: ', d3.select(this).style('fill'))
                    // console.log('mouse d', d, 'o', o)
                    // console.log('clicked colour: ', clicked_color)
                    return d.id === o.id ? clicked_color : d3.select(this).style('fill');
                    // clicked_color = d3.select(this).style('fill');
                    // return d.id === o.id ? highlight_color : d3.select(this).style('fill');
                });
                globalOnClickNode(d.id)
            })




            // circle.style('fill', clicked_color);
            // change colour to swho inetractivity

            // circle.style('fill', function (o, i) {
            //     console.log('d', d, 'o', o)
            //     // clicked_color = d3.select(this).style('fill');
            //     // return d.id === o.id ? clicked_color : d3.select(this).style('fill');
            //     return d.id === o.id ? "red" : d3.select(this).style('fill');
            // });
        });
    // https://stackoverflow.com/questions/20031254/how-can-i-make-double-click-event-on-node-in-d3-js
    // .on("dblclick", function (d) {
    //     if (d.id !== d.group) {
    //         console.log('node double clicked: ', d);
    //     }

    //     // if id is not the same as group then we are clicking on a topic node


    // })
    console.log('net.links: ', net.links)
    simulation.force("link")
        .links(net.links)
        .distance(function (d) {
            if (d.source.group == d.target.group) return 85;
            else return 180;
            // if(d.type=='resource') return 300;
            // else return 150;
            // return d.distance;
        });

    function setExpand(d) {
        // console.log('expand: ', expand)
        expand[d.id] = !expand[d.id];
        // console.log('d: ', d)
        init(globalData);
    }

    // endof init()
}


function delay(t, v) {
    return new Promise(function (resolve) {
        setTimeout(resolve.bind(null, v), t)
    });
}

function centerNode(xx, yy) {
    g.transition()
        .duration(500)
        .attr("transform", "translate(" + (w / 2 - xx) + "," + (h / 2 - yy) + ")scale(" + 1 + ")")
        .on("end", function () { svg.call(zoom.transform, d3.zoomIdentity.translate((w / 2 - xx), (h / 2 - yy)).scale(1)) });
}

const addNewNode = (data) => {
    // console.log('ADD NEW NODE!');
    let clonedData = JSON.parse(JSON.stringify(globalData))
    const newNode = {
        'id': data,
        'title': data + ' :: title',
        'group': 'x'
    };

    clonedData.nodes.push(newNode);

    let sourceNode = null;
    // look for prereq with a given id
    clonedData.nodes.forEach((node) => {
        if (node.id === 'C') {
            sourceNode = node;
        }
    })
    clonedData.links.push({
        'source': sourceNode,
        'target': newNode
    })
    // console.log('source: ', sourceNode);
    // console.log('add new node data: ', clonedData.nodes);
    // console.log('new links', clonedData.links);
    // add a link later

    init(clonedData);
}


// update graph -- whether its ading or removing nodes give the whole graph again
// this function shoudl check if the current globalgraph has what we want(node or link) and if not - then update it otehrwise skip
// store global graph in local storage!! weverytie it chanegs later!
// or updating links of a particular node
// lave the logic fo rbackend!
// delete node delete all children
const updateGraph = (nodes, links) => {
    let updatedGraph = { 'nodes': [], 'links': [] };

    // fill out the nodes for the updated graph
    nodes.forEach((node) => {
        // for each node if this new graph
        let found = false;
        // if it is in the net.nodes
        net.nodes.forEach((netNode) => {
            if (netNode.id === node.id) {
                updatedGraph.nodes.push(netNode);
                found = true;
            }
        })
        if (!found) {
            // add the new node into the updated graph
            updatedGraph.nodes.push(node);
        }

        // take the net.nodes one
        // else push this element into graph
    });

    // fill out the links for the updated graph
    links.forEach((link) => {
        // for each link if this new graph
        let found = false;
        // if it is in the net.nodes
        net.links.forEach((netLink) => {
            if (netLink.source === link.source && netLink.target === link.target) {
                updateGraph.links.push(netLink);
                found = true;
            }
        })
        if (!found) {
            // add the new node into the updated graph
            updatedGraph.links.push(link);
        }

        // take the net.nodes one
        // else push this element into graph
    });

    init(updatedGraph)
}


// edit node function - name/label
const updateNode = (nodeId, label) => {
    // look for the node based on node id
    // console.log('net.nodes: ', net.nodes);
    net.nodes.forEach((node) => {
        if (node.id === nodeId) {
            node.label = label;
        }
    });
    // https://stackoverflow.com/questions/25609229/how-to-update-specific-node-in-d3
    // d3.selectAll("g").select("circle")
    //     .text(function (node) { return node.label });
    init(globalData)
    // console.log('global data: ', globalData)
}


// focus/center node function - for searching
const focusNode = (nodeId) => {
    let nodeToFocus = null;
    globalData.nodes.forEach((node) => {
        if (node.id === nodeId) {
            nodeToFocus = node;
        }
    })
    centerNode(nodeToFocus.x, nodeToFocus.y);
}


export const drawNetwork = (data, svgElement, onClickNode, onClickNetwork) => {
    // globalData = data;
    // expand = {}
    // console.log('DRAW NETWORK', data, expand)
    globalData = JSON.parse(JSON.stringify(data)) // clone we odnt mutate the thing passed in
    svgElement // zoomer
        .attr('width', w)
        .attr('height', h)
        .on('click', () => {
            // console.log('clicked network!')
            onClickNetwork();
        })
        .call(zoom);
    svg = svgElement;
    g = svg.append("g");
    // console.log('svg', svg)

    globalOnClickNode = onClickNode;
    // console.log('globalOnClickNode:', globalOnClickNode)


    init(globalData);
}

export const removeAll = () => {

    // reset all global data
    globalData = {}
    focus_node = null; highlight_node = null;

    net = undefined;
    convexHull = undefined;
    genCH = undefined;
    linkElements = undefined;
    nodeElements = undefined;
    textElements = undefined;
    circle = undefined;
    simulation = undefined;
    linkForce = undefined;
    args = undefined;
    expand = {}; // an object with fields for each "group"

    offset = 0; groups = undefined; groupPath = undefined;


    var highlight_color = undefined;
    var highlight_trans = undefined;

    var default_node_color = undefined;
    //var default_node_color = "rgb(3,190,100)";
    var default_link_color = undefined;

    // var g = svg.append("g")
    var g = undefined;

    const chart = document.getElementById('network')
    while (chart && chart.hasChildNodes())
        chart.removeChild(chart.lastChild);


}