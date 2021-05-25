import React from 'react';
import axios from 'axios';

export const addTopic = (title, prerequisites, description) => {
    // console.log("prereqqqss: ", prerequisites)
    if (this.state.nodes && this.state.nodes.length) {
        // already nodes inside
        // console.log("CHECK PREREQS:", prerequisites)
        // loop through prerequisites and only take the title string
        let prereqList = []

        for (let i = 0; i < prerequisites.length; i++) {
            prereqList.push(prerequisites[i].title)
        }
        // prerequisites.forEach((prereqList) => {
        //   p => prereqList.append(p.title)

        // });
        let that = this;
        // console.log("FIXED: ", prereqList)
        axios.post('http://127.0.0.1:5000/topics/', {
            title: title,
            prerequisites: prereqList,
            description: description
        })
            .then(function (response) {
                // console.log(response.data.id);
                that.state.nodes.push({
                    id: response.data.id,
                    title: title,
                    prereqs: prereqList,
                    description: description,
                    preparation: {
                        attachments: []
                    },
                    content: {
                        attachments: []
                    },
                    practice: {
                        attachments: []
                    },
                    assessment: {
                        attachments: []
                    }
                })

                // update the nodes and the links
                // that.setState({
                //   nodes: that.state.nodes
                // });

            })
            .catch(function (error) {
                window.alert("Invalid addition of Topic - it already exists")
                // console.log(error);
            }).then(function () {
                // always executed
                // update the links
                axios.get('http://127.0.0.1:5000/topics/prerequisites')
                    .then(function (response) {
                        // handle success
                        // console.log(response);
                        // console.log("IMPORTANT!!")
                        // console.log(response.data)
                        that.state.links = response.data;
                        // this.
                        // that.setState({
                        //   links: response.data
                        // })
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                        that.setState({
                            nodes: that.state.nodes,
                            links: that.state.links
                        });

                    });


            });



        // this.state.nodes.push({ id: newNode });
        // make a post api call
        // check return value - error or node id

        // push node to graph

    } else {
        // the first node being added
    }
}
