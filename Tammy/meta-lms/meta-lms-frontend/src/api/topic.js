'use strict';
import React from 'react';
import axios from 'axios';
import { URL, token } from './global.js';
import {
    getAllTopicsRequest,
    getAllPrerequisitesRequest,
    postTopicRequest,
    postPrerequisitesRequest,
    deleteTopicRequest,
    getTopicRequest,
    putTopicRequest

} from './requests.js';


export const getAllTopics = async (disciplineVal) => {
    console.log('get this topics for displicnehsdfjk: ', disciplineVal)
    const { topics, groups, disciplines, prerequisites } = await getAllTopicsRequest(disciplineVal);
    // const prereqs = await getAllPrerequisitesRequest();
    console.log(topics, groups, disciplines, prerequisites)
    if (topics !== null && prerequisites !== null) {

        return {
            topics: topics, prerequisites: prerequisites,
            groups: groups, disciplines: disciplines
        };
    }
    return null;
    // try {
    //     // get topics
    //     const topicsResponse = await axios.get(`${URL}/topic/`, {
    //         headers: {
    //             Authorization: 'Token ' + token //the token is a variable which holds the token
    //         },
    //         // params: {
    //         //     Authorization: tokenStr
    //         // }
    //     });

    //     // get all prereqs
    //     const prereqsResponse = await axios.get(`${URL}/topic/prerequisites`);

    //     // console.log('Topic Response: ', topicsResponse, 'prerequisite response', prereqsResponse);

    //     // TODO: get all groups

    //     // TODO: get all disciplines

    //     if (topicsResponse.status === 200 && prereqsResponse.status === 200) {
    //         return {
    //             topics: topicsResponse.data.topics, prereqs: prereqsResponse.data.prerequisites,
    //             groups: topicsResponse.data.groups, disciplines: topicsResponse.data.disciplines
    //         };
    //     } else {
    //         console.log('error!')
    //         return null;
    //     }

    // } catch (error) {
    //     console.error(error);
    //     throw error;
    // }
}

export const postNewTopic = async (title, description, group, discipline, prereqs, disciplineVal) => {
    console.log('tokenn!: ', token)
    console.log('post new topic! ', title, description, group, discipline, prereqs, disciplineVal);
    console.log('urgh', title)
    const topicId = await postTopicRequest(title, description, group, discipline);
    console.log('data: ', topicId, prereqs);


    // fixed bug - duplicate names of prereqs being redefined in the if statement scope
    if (topicId !== null) {
        console.log('prereqs: ', prereqs)
        console.log('TOPIC ID: ', topicId);

        // console.log('data: ', topicId, prereqs.toString());
        console.log('topic id is not null!');
        // if it is successfully
        // console.log('~prereq data: ', topicId, prereqs);
        // console.log(topicId, prereqs);
        // add the prereqs

        // console.log('prereqs!: ', prereqs);
        // const data = postPrerequisitesRequest(topicId, prereqs);
        const data = await postPrerequisitesRequest(topicId, prereqs);
        // const data = []
        console.log('prereq data: ', data);

        // if prereqs error out, 
        if (data === null) {
            // remove the topic just added
            await deleteTopicRequest(topicId);
            return null;
        }

        // const { topics, groups, disciplines, prerequisites } = await getAllTopicsRequest(disciplineVal);
        // const prereqList = await getAllPrerequisitesRequest();
        // console.log('topics after posting new topic: ', topics)
        // return { topics: topics, prerequisites: prerequisites, groups: groups, disciplines, disciplines };

    }
    console.log('topic id is null!') // TODO: reaches here when there is duplicat etopics 
    // return { topics: [], prerequisites: [], groups: [], disciplines: [] };
    // return null;


    // try {
    //     let options = {
    //         headers: { Authorization: 'Token ' + token }
    //     }
    //     console.log('posting prerequisites:', prereqs)
    //     // add the topic
    //     const topicResponse = await axios.post(`${URL}/topic/`, {
    //         title: title,
    //         // prerequisites: prereqs,
    //         description: description,
    //         group: groupName,
    //         discipline: discipline
    //     }, options)

    //     console.log('Topic Response: ', topicResponse)

    //     if (topicResponse.status === 200) {
    //         options = {
    //             headers: { Authorization: 'Token ' + token },
    //             // params: {
    //             //     id: topicResponse.data.topic_id
    //             // },
    //         }
    //         // add the prereqs
    //         const prereqsResponse = await axios.put(`${URL}/topic/prerequisites`, {

    //             prerequisites: prereqs,

    //         }, options)

    //         // if prereq errors out, remove topic
    //         if (prereqsResponse.status !== 200) {
    //             //
    //             await axios.delete(`${URL}/topic/`, {
    //                 headers: {
    //                     Authorization: 'Token ' + token //the token is a variable which holds the token
    //                 },
    //                 params: {
    //                     id: topicResponse.data.topic_id
    //                 }
    //             });

    //             // TODO signal error to show error message
    //             return false;

    //         }
    //         // successful topic and prereq add
    //         return true;

    //     }

    //     // TODO show error message
    //     return false;

    // } catch (error) {
    //     console.log()
    //     console.error(error);
    //     throw error;
    // }
}

// TODO
export const putExistingTopic = async (topicId, title, description, group, discipline, newPrereqIds, oldPrereqIds) => {
    console.log('putting: ', topicId, title, description, group, discipline, newPrereqIds, oldPrereqIds)

    // back up current prerequisites - old prereqsId

    // update the prerequisites
    const result = await postPrerequisitesRequest(topicId, newPrereqIds);

    // if successful 
    if (result !== null) {
        // update topic info
        await putTopicRequest(topicId, title, description, group, discipline)
    } else {
        // otherwise revert prerequisites - assume it will be successful - issue in special edge cases
        await postPrerequisitesRequest(topicId, oldPrereqIds);
    }



    // get all topic again

}