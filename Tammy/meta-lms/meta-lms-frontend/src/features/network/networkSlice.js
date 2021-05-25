import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';


// THIS FILE IS NOT USED! - ALL FUNCTIONS ARE IN TOPIC GRAPH!!
var globalData1 = {
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
export const networkSlice = createSlice({
    name: 'network',
    initialState: {
        // isDialogOpen: false,
        // title: "",
        // prereqs: "",
        // description: "",

        // titleError: false,
        // titleErrorText: "",
        // descriptionError: false,
        // descriptionErrorText: "",

        // status: null, // status of adding new topic
        data: 50,
        networkData: globalData1
        // networkData: { 'nodes': [], 'links': [] }
    },
    reducers: {
        updateData: (state, { payload }) => {
            // console.log('payload: ', payload)
            state.data = payload;
        },
        updateNetworkData: (state, { payload }) => {
            // console.log('!network data: ', payload);
            state.networkData = payload;
        }
        // openDialog: (state) => {
        //     state.isDialogOpen = true;
        // },
        // closeDialog: (state) => {
        //     state.isDialogOpen = false;

        //     // reset all state 
        //     state.title = "";
        //     state.prereqs = "";
        //     state.description = "";
        //     state.titleError = false;
        //     state.titleErrorText = "";
        //     state.descriptionError = false;
        //     state.descriptionErrorText = "";
        // },

        // setTitle: (state, { payload }) => {
        //     if (payload !== "") {
        //         state.titleError = false;
        //         state.titleErrorText = "";
        //     }
        //     state.title = payload;
        // },
        // setPrereqs: (state, { payload }) => {
        //     state.prereqs = payload;
        // },
        // setDescription: (state, { payload }) => {
        //     if (payload !== "") {
        //         state.descriptionError = false;
        //         state.descriptionErrorText = "";
        //     }
        //     state.description = payload;
        // },
        // verifyForm: (state, { payload }) => { // rename to verify form inputs
        //     // check valid inputs
        //     console.log('submit')

        //     // check empty, too long, duplicate
        //     if (state.title === "") {
        //         state.titleError = true;
        //         state.titleErrorText = "Invalid title"

        //     }
        //     if (state.description === "") {
        //         state.descriptionError = true;
        //         state.descriptionErrorText = "Invalid description"
        //     }

        //     // if (state.titleError || state.descriptionError) return

        //     // set state to successfully submit and close dialog




        // }
    },
});

export const { updateData, updateNetworkData } = networkSlice.actions;

export const selectData = state => state.network.data;
export const selectNetworkData = state => state.network.networkData;

export default networkSlice.reducer;
