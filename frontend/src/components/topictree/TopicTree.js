import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./TopicTree.css";
import TopicTreeHeader from "./TopicTreeHeader.js";
import {
  Button,
  Text,
  Heading,
  Box,
  Input,
  Flex,
  InputGroup,
  InputLeftElement,
  Stack,
  Divider,
} from "@chakra-ui/react";
import { SearchIcon, ArrowRightIcon } from "@chakra-ui/icons";
import TopicTreeViewResource from "./TopicTreeViewResource.js";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  backend_url,
  get_all_topics,
  get_topics_url,
  get_topic_groups,
} from "../../Constants.js";
import { set } from "draft-js/lib/DefaultDraftBlockRenderMap";

var g;
var svg;
var expand = {};
var circles,
  link,
  node,
  lables,
  simulation,
  tempNodes,
  linkNodes,
  tempLinks,
  arrows,
  groupPath;
var emptyNodes = 1; //fix later

function zoomed() {
  g.attr("transform", d3.event.transform);
}

export default function TopicTree() {
  const ref = useRef();
  const [data, setData] = useState([]);
  const [listPrereqs, setListPrereqs] = useState([]);
  const [notListPrereqs, setNotListPrereqs] = useState([]);
  const [topicGroups, setTopicGroups] = useState([]);
  const [selectedTopicGroup, setSelectedTopicGroup] = useState("");
  const [selectedNode, setSelectedNode] = useState({
    id: 0,
    title: "",
    prerequisite_strings: [],
    description: "",
    materials_strings: {
      preparation: [],
      content: [],
      practice: [],
      assessments: [],
    },
    group: "",
    discipline: "",
    creator: "",
    tags: [],
  });
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();

  const treeStructure = (jsonData) => {
    expand = {};

    let newJson = {
      nodes: [{}],
      links: [],
    };
    let tempTopicGroups = [];
    for (let topicGroup of jsonData) {
      tempTopicGroups.push({ label: topicGroup.name, value: topicGroup.name });
      expand[topicGroup.name] = false;
      for (let topic of topicGroup.topics_list) {
        let node = {};
        node["id"] = topic.id;
        node["title"] = topic.name;
        node["group"] = topicGroup.name;
        node["materials_strings"] = {};
        node.materials_strings["content"] = [];
        node.materials_strings["preparation"] = [];
        node.materials_strings["practice"] = [];
        node.materials_strings["assessments"] = [];
        for (let course_material of topic.course_materials) {
          if (course_material.type === "preparation") {
            node.materials_strings.preparation.push(course_material.name);
          } else if (course_material.type === "assessment") {
            node.materials_strings.assessments.push(course_material.name);
          } else if (course_material.type === "practice") {
            node.materials_strings.practice.push(course_material.name);
          } else {
            node.materials_strings.content.push(course_material.name);
          }
        }
        console.log("tags", topic.tags);
        node["tags"] = topic.tags;

        newJson.nodes.push(node);
        for (let prereq of topic.prereqs) {
          newJson.links.push({
            source: prereq.id,
            target: topic.id,
          });
        }
      }
    }
    setTopicGroups(tempTopicGroups);
    console.log("topicGroups", tempTopicGroups);

    return newJson;
  };

  const getListOfPrerequisites = (id, data) => {
    console.log("id", id);
    console.log("data", data);
    let linksArray = [];
    for (let i = 0; i < data.links.length; i++) {
      if (data.links[i].target === id) {
        linksArray.push(data.links[i].source);
      }
    }
    console.log("linksArray", linksArray);

    let prereqs = [];
    let nodes = [];

    for (let i = 0; i < data.nodes.length; i++) {
      let found = false;
      for (let j = 0; j < linksArray.length; j++) {
        if (data.nodes[i].id === linksArray[j]) {
          prereqs.push({ name: data.nodes[i].title, id: data.nodes[i].id });
          found = true;
          break;
        }
      }
      if (
        !found &&
        data.nodes[i].hasOwnProperty("id") &&
        data.nodes[i].hasOwnProperty("title") &&
        data.nodes[i].id !== id
      ) {
        nodes.push({
          value: data.nodes[i].id.toString(),
          label: data.nodes[i].title,
        });
      }
    }
    console.log("prereqs", prereqs);

    setListPrereqs(prereqs);
    setNotListPrereqs(nodes);
    onOpenModal();
  };

  function init(data) {
    if (simulation) {
      // clear graph
      // d3.selectAll("svg > *").remove();
      circles && circles.remove();
      node && node.remove();
      // arrows && arrows.remove();
      link && link.remove();
      // lables && lables.remove();
    }

    console.log("data nodes", data.nodes);

    tempNodes = new Array(emptyNodes).fill({}); // temporary fix
    emptyNodes += 1;
    console.log("tempNodes", tempNodes);
    let seenGroups = {};
    let nodeDict = {};
    let i = 76754;
    for (let node of data.nodes) {
      if (expand[node.group] == false) {
        if (!seenGroups.hasOwnProperty(node.group)) {
          seenGroups[node.group] = i;
          tempNodes.push({
            id: i,
            name: node.group,
            title: node.group,
            type: "group",
          });
          console.log({
            id: i,
            name: node.group,
            title: node.group,
            type: "group",
          });
        }
      } else if (node.hasOwnProperty("id")) {
        node.type = "topic";
        console.log({
          id: node.id,
          name: node.title,
          title: node.title,
          type: "topic",
          materials_strings: node.materials_strings,
          group: node.group,
          tags: node.tags,
        });
        tempNodes.push({
          id: node.id,
          name: node.title,
          title: node.title,
          type: "topic",
          materials_strings: node.materials_strings,
          group: node.group,
          tags: node.tags,
        });
      }
      nodeDict[node.id] = node;
      i += 1;
    }
    console.log("nodes", tempNodes);

    tempLinks = [];
    let linkDict = {};
    for (let link of data.links) {
      let linkToAppend = {};

      if (expand[nodeDict[link.source].group] == false) {
        linkToAppend["source"] = seenGroups[nodeDict[link.source].group];
      } else {
        linkToAppend["source"] = link.source;
      }

      if (expand[nodeDict[link.target].group] == false) {
        linkToAppend["target"] = seenGroups[nodeDict[link.target].group];
      } else {
        linkToAppend["target"] = link.target;
      }
      let linkStr = linkToAppend["source"] + "," + linkToAppend["target"];

      if (
        !linkDict.hasOwnProperty(linkStr) &&
        linkToAppend["source"] != linkToAppend["target"]
      ) {
        linkDict[linkStr] = true;
        tempLinks.push(JSON.parse(JSON.stringify(linkToAppend)));
      }
    }

    console.log("");

    let preprocessedData = {};
    // make it easier to access instead of having to traverse data.nodes each time
    for (let node of tempNodes) {
      if (node.hasOwnProperty("id")) {
        preprocessedData[node.id.toString()] = node;
      }
    }

    // arrow heads
    arrows = svg
      .append("svg:defs")
      .selectAll("marker")
      .data(["end"])
      .enter()
      .append("svg:marker")
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
    link = g
      .append("g")
      .attr("class", "links")
      .selectAll("path")
      .data(tempLinks)
      .enter()
      .append("path")
      .attr("class", function (d) {
        return "link";
      })
      .attr("marker-end", (d) => {
        return "url(#end)";
      })
      .style("fill", "none")
      .style("stroke", "#666")
      .style("stroke-width", "1.5px")
      .style("opacity", 0.8);

    // Initialize the nodes
    node = g
      .attr("class", "nodes")
      .selectAll("g")
      .data(tempNodes)
      .enter()
      .append("g")
      .on("click", function () {
        let topicName = d3.select(this).text();
        if (seenGroups.hasOwnProperty(topicName)) {
          expand[topicName] = true;
          init(data);
        } else {
          let topicName = d3.select(this).text();

          let nodeData = tempNodes.filter(function (dataValue) {
            return dataValue.title === topicName;
          });

          console.log("node", nodeData[0]);
          setSelectedNode(nodeData[0]);
          console.log("group", nodeData[0].group);
          setSelectedTopicGroup(nodeData[0].group);
          getListOfPrerequisites(nodeData[0].id, data);
        }
      });
    let radius = 30;
    circles = node
      .append("circle")
      .attr("r", function (r) {
        return r.type == "group" ? radius * 2 : radius;
      })
      .attr("fill", function (r) {
        if (r.type == "group") {
          return "#68b559";
        }
        return "#ADD8E6";
      })
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    lables = node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("font-size", "8px")
      .append("tspan")
      .text(function (d) {
        return d.title;
      });

    linkNodes = [];
    tempLinks.forEach(function (link) {
      linkNodes.push({
        source: preprocessedData[link.source],
        target: preprocessedData[link.target],
      });
    });

    simulation.nodes(tempNodes.concat(linkNodes)).on("tick", ticked);
    simulation.force("link").links(tempLinks.concat(linkNodes));

    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
      link.attr("d", function (d) {
        var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);

        var val2 =
          "M" +
          d.source.x +
          "," +
          d.source.y +
          "L" +
          d.target.x +
          "," +
          d.target.y;
        return val2;
      });

      node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    }
  }

  useEffect(() => {
    let size = 500;

    let width = window.innerWidth;
    let height =
      window.innerHeight -
      document.getElementById("topic-tree-header").getBoundingClientRect()
        .height;
    let zoom = d3.zoom().scaleExtent([0.3, 10]).on("zoom", zoomed);
    svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(zoom);
    g = svg.append("g");
    simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3
          .forceLink()
          .id(function (d) {
            return d.id;
          })
          .distance(400)
      )
      .force("charge", d3.forceManyBody().strength(-70))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json
    fetch(get_all_topics(), {
      headers: {
        "Content-Type": "application/JSON",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        return treeStructure(res.result);
      })
      .then(function (data) {
        init(data);
      });
  }, []);

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

  return (
    <div>
      <TopicTreeHeader
        id="topic-tree-header"
        topicGroups={topicGroups}
        view={"Graph View"}
      ></TopicTreeHeader>
      <div id="graph" ref={ref} />
      <TopicTreeViewResource
        data={selectedNode}
        isOpen={isOpenModal}
        onClose={onCloseModal}
        prereqs={listPrereqs}
        topicGroupName={selectedTopicGroup}
        nodes={notListPrereqs}
      />
    </div>
  );
}
