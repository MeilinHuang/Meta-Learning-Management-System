import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { topics, prereqs, config as initialConfig } from './config'
import { getAllTopics, postNewTopic, putExistingTopic } from '../../api/topic';
import { deleteTopicRequest, putTopicRequest, postMaterialsRequest, deleteMaterialRequest } from '../../api/requests';
// https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9

// TODO: fix zoom issue
// TODO: fix dodgy windows resize issue - when window size changes but not refreshed page

export const loadAllTopics = createAsyncThunk(
    'topicGraph/loadAllTopics',
    async (obj, { dispatch, getState }) => {
        // IMPORTANT: current rlies on chrome extension CORS origin allowed
        // TODO: fix when deploy
        console.log('obj: get all topic', obj.disciplineVal)
        console.log('getting all topics...')
        const data = await getAllTopics(obj.disciplineVal);
        if (data === null) {
            return { topics: [], prerequisites: [], groups: [], disciplines: [] }
        }
        console.log('all topics: ', data)
        return data;
    }
)

export const addNewTopic = createAsyncThunk(
    'topicGraph/addNewTopic',
    async (obj, { dispatch, getState }) => {
        console.log('adding a new topic...!', obj)

        const prereqs = obj.prereqs.map((prereq) => prereq.id) // weird bug with this directly passed in?
        console.log('to post new topic!')
        // const { topics, prerequisites, groups, disciplines }
        //     = await postNewTopic(obj.title, obj.description, obj.group,
        // obj.discipline, prereqs, obj.disciplineVal);
        await postNewTopic(obj.title, obj.description, obj.group,
            obj.discipline, prereqs, obj.disciplineVal);

        const data = await getAllTopics(obj.disciplineVal);
        if (data === null) {
            return { topics: [], prerequisites: [], groups: [], disciplines: [] }
        }
        console.log('all topics: ', data)
        return data;
        // console.log('hello!')
        // console.log('returned obj: ', { topics: topics, prerequisites: prerequisites, groups: groups, disciplines: disciplines })
        // return { topics: topics, prerequisites: prerequisites, groups: groups, disciplines: disciplines }

    }
)



export const removeTopic = createAsyncThunk(
    'topicGraph/removeTopic',
    async (obj, { dispatch, getState }) => {
        console.log('removing a topic...!', obj) // whole topic object
        await deleteTopicRequest(obj.topicNode.id);
        // console.log(obj)
        // const { topicGraph } = getState();
        // console.log(topicGraph)
        // console.log(title, prereqs, description)
        // obj.prereqs.map((prereq) => prereq.id)
        // TODO come back to check whether it was successful may return duplicate issue error

        const data = await getAllTopics(obj.disciplineVal);
        if (data === null) {
            return { topics: [], prerequisites: [], groups: [], disciplines: [] }
        }
        console.log('all topics: ', data)
        return data;

        // uncomment this!

        // const prereqs = obj.prereqs.map((prereq) => prereq.id) // weird bug with this directly passed in?
        // console.log('to post new topic!')
        // const { topics, prerequisites, groups, disciplines }
        //     = await postNewTopic(obj.title, obj.description, obj.group,
        //         obj.discipline, prereqs);
        // console.log('hello!')
        // console.log('returned obj: ', { topics: topics, prerequisites: prerequisites, groups: groups, disciplines: disciplines })
        // return { topics: topics, prerequisites: prerequisites, groups: groups, disciplines: disciplines }

    }
)

export const editTopic = createAsyncThunk(
    'topicGraph/editTopic',
    async (obj, { dispatch, getState }) => {
        console.log('editing a new topic...!', obj)
        const newPrereqs = obj.prereqs.map(newPrereq => newPrereq.id);
        const oldPrereqs = obj.initialPrereqs.map(oldPrereq => oldPrereq.id)
        await putExistingTopic(obj.topicId, obj.title, obj.description, obj.group,
            obj.discipline, newPrereqs, oldPrereqs)
        // TODO
        console.log('done')

        // call to get all topics in graph to update
        const data = await getAllTopics(obj.disciplineVal);
        if (data === null) {
            return { topics: [], prerequisites: [], groups: [], disciplines: [] }
        }
        console.log('all topics: ', data)
        return data;
    }
)


export const uploadFiles = createAsyncThunk(
    'topicGraph/uploadFiles',
    async (obj, { dispatch, getState }) => {
        console.log('uploading: ', obj)

        // console.log('uploading: ', payload);
        // console.log('uploading: ', payload);
        postMaterialsRequest(obj.topicId, obj.body.category, obj.body.materials);
        //     const newPrereqs = obj.prereqs.map(newPrereq => newPrereq.id);
        //     const oldPrereqs = obj.initialPrereqs.map(oldPrereq => oldPrereq.id)
        //     await putExistingTopic(obj.topicId, obj.title, obj.description, obj.group,
        //         obj.discipline, newPrereqs, oldPrereqs)
        //     // TODO
        //     console.log('done')

        // call to get all topics in graph to update
        const data = await getAllTopics(obj.disciplineVal);
        if (data === null) {
            return { topics: [], prerequisites: [], groups: [], disciplines: [] }
        }
        console.log('all topics: ', data)
        return data;
    }
)


export const removeFile = createAsyncThunk(
    'topicGraph/removeFile',
    async (obj, { dispatch, getState }) => {
        console.log('removing: ', obj)

        await deleteMaterialRequest(obj.topicId, obj.filename, obj.category)

        // call to get all topics in graph to update
        const data = await getAllTopics(obj.disciplineVal);
        if (data === null) {
            return { topics: [], prerequisites: [], groups: [], disciplines: [] }
        }
        console.log('all topics: ', data)
        return data;
    }
)


export const topicGraphSlice = createSlice({
    name: 'topicGraph',
    initialState: {
        focusedNode: "", // id string

        nodes: [],  // non fetched data from config.js
        links: [],
        groups: [],
        disciplines: [],

        status: null
    },
    reducers: {
        focusNode: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.focusedNode = action.payload;
        },
        blurNode: state => {
            state.focusedNode = "";
        },
    },
    extraReducers: {
        [loadAllTopics.pending]: (state, action) => {
            console.log('PENDING!')
            state.status = 'loading'
        },
        [loadAllTopics.fulfilled]: (state, { payload }) => {
            console.log('SUCECSSS!')
            // console.log(payload.topics);
            // console.log(payload.prereqs);
            state.nodes = payload.topics;
            state.links = payload.prerequisites;
            state.groups = payload.groups;
            state.disciplines = payload.disciplines;
            state.status = 'success'
        },
        [loadAllTopics.rejected]: (state, action) => {
            console.log('FAILED!')
            state.status = 'failed'
        },

        [addNewTopic.pending]: (state, action) => {
            state.status = 'loading'
        },
        [addNewTopic.fulfilled]: (state, { payload }) => {
            console.log(payload)
            const { topics, prerequisites, groups, disciplines } = payload;

            console.log('state changed! ebofre ', state.nodes, state.links);
            state.nodes = topics;
            state.links = prerequisites;
            state.groups = groups;
            state.disciplines = disciplines;
            console.log('state changed! after ', state.nodes, state.links);
            state.status = 'success'
        },
        [addNewTopic.rejected]: (state, action) => {
            state.status = 'failed'
        },



        [removeTopic.pending]: (state, action) => {
            state.status = 'loading'
        },
        [removeTopic.fulfilled]: (state, { payload }) => {
            // console.log(payload)
            // const { topics, prerequisites, groups, disciplines } = payload;
            // console.log('state changed! ', state.nodes);
            // state.nodes = topics;
            // state.links = prerequisites;
            // state.groups = groups;
            // state.disciplines = disciplines;
            state.nodes = payload.topics;
            state.links = payload.prerequisites;
            state.groups = payload.groups;
            state.disciplines = payload.disciplines;
            state.status = 'success'
        },
        [removeTopic.rejected]: (state, action) => {
            state.status = 'failed'
        },


        [editTopic.pending]: (state, action) => {
            state.status = 'loading'
        },
        [editTopic.fulfilled]: (state, { payload }) => {
            // console.log(payload)
            // const { topics, prerequisites, groups, disciplines } = payload;
            // console.log('state changed! ', state.nodes);
            // state.nodes = topics;
            // state.links = prerequisites;
            // state.groups = groups;
            // state.disciplines = disciplines;
            // state.nodes = payload.topics;
            // state.links = payload.prereqs;
            // state.groups = payload.groups;
            // state.disciplines = payload.disciplines;
            state.nodes = payload.topics;
            state.links = payload.prerequisites;
            state.groups = payload.groups;
            state.disciplines = payload.disciplines;
            state.status = 'success'
        },
        [editTopic.rejected]: (state, action) => {
            state.status = 'failed'
        },

        [uploadFiles.pending]: (state, action) => {
            state.status = 'loading'
        },
        [uploadFiles.fulfilled]: (state, { payload }) => {
            // console.log(payload)
            // const { topics, prerequisites, groups, disciplines } = payload;
            // console.log('state changed! ', state.nodes);
            // state.nodes = topics;
            // state.links = prerequisites;
            // state.groups = groups;
            // state.disciplines = disciplines;
            // state.nodes = payload.topics;
            // state.links = payload.prereqs;
            // state.groups = payload.groups;
            // state.disciplines = payload.disciplines;
            state.nodes = payload.topics;
            state.links = payload.prerequisites;
            state.groups = payload.groups;
            state.disciplines = payload.disciplines;
            state.status = 'success'
        },
        [uploadFiles.rejected]: (state, action) => {
            state.status = 'failed'
        },

        [removeFile.pending]: (state, action) => {
            state.status = 'loading'
        },
        [removeFile.fulfilled]: (state, { payload }) => {
            // console.log(payload)
            // const { topics, prerequisites, groups, disciplines } = payload;
            // console.log('state changed! ', state.nodes);
            // state.nodes = topics;
            // state.links = prerequisites;
            // state.groups = groups;
            // state.disciplines = disciplines;
            // state.nodes = payload.topics;
            // state.links = payload.prereqs;
            // state.groups = payload.groups;
            // state.disciplines = payload.disciplines;
            state.nodes = payload.topics;
            state.links = payload.prerequisites;
            state.groups = payload.groups;
            state.disciplines = payload.disciplines;
            state.status = 'success'
        },
        [removeFile.rejected]: (state, action) => {
            state.status = 'failed'
        },


    }
});

export const { focusNode, blurNode } = topicGraphSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = amount => dispatch => {
//     setTimeout(() => {
//         dispatch(incrementByAmount(amount));
//     }, 1000);
// };



// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectConfig = state => state.topicGraph.config;
export const selectFocusedNode = state => state.topicGraph.focusedNode;
export const selectNodes = state => state.topicGraph.nodes;
export const selectLinks = state => state.topicGraph.links;
export const selectGroups = state => state.topicGraph.groups;
export const selectDisciplines = state => state.topicGraph.disciplines;

export default topicGraphSlice.reducer;
