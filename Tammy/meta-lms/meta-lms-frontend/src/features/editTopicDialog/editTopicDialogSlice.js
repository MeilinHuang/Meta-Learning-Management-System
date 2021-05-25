import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// postNewTopic

export const editTopicDialogSlice = createSlice({
    name: 'editTopicDialog',
    initialState: {
        isDialogOpen: false,

        title: "",
        description: "",
        group: "",
        discipline: "",
        prereqs: [],
        initialPrereqs: [],

        titleError: false,
        titleErrorText: "",
        descriptionError: false,
        descriptionErrorText: "",

        status: null, // status of adding new topic
    },
    reducers: {
        openEditDialog: (state, action) => {
            console.log('action: ', action)
            const { payload } = action;
            console.log('open edit topic dialog on topic: ', payload)
            state.title = payload.title;
            state.description = payload.description;
            state.group = payload.group;
            state.discipline = payload.discipline;
            state.prereqs = payload.ps; // strings of prereqs only
            state.initialPrereqs = payload.ps;
            // payload is the current data for the node
            state.isDialogOpen = true;
        },
        closeDialog: (state) => {
            state.isDialogOpen = false;

            // reset all state 
            state.title = "";
            state.prereqs = []; // "" - WEIRD BUG RESOLVED?!
            state.description = "";
            state.titleError = false;
            state.titleErrorText = "";
            state.descriptionError = false;
            state.descriptionErrorText = "";
        },

        setTitle: (state, { payload }) => {
            // if (payload !== "") {
            //     state.titleError = false;
            //     state.titleErrorText = "";
            // }
            state.title = payload;
        },
        setDescription: (state, { payload }) => {
            // if (payload !== "") {
            //     state.descriptionError = false;
            //     state.descriptionErrorText = "";
            // }
            state.description = payload;
        },
        setGroup: (state, { payload }) => {
            // if (payload !== "") {
            //     state.descriptionError = false;
            //     state.descriptionErrorText = "";
            // }
            state.group = payload;
        },
        setDiscipline: (state, { payload }) => {
            // if (payload !== "") {
            //     state.descriptionError = false;
            //     state.descriptionErrorText = "";
            // }
            // let the backend handle errors
            state.discipline = payload;
        },
        setPrereqs: (state, { payload }) => {
            state.prereqs = payload;
        },
        verifyForm: (state, { payload }) => { // rename to verify form inputs
            // check valid inputs
            // console.log('submit')

            // // check empty, too long, duplicate
            // if (state.title === "") {
            //     state.titleError = true;
            //     state.titleErrorText = "Invalid title"

            // }
            // if (state.description === "") {
            //     state.descriptionError = true;
            //     state.descriptionErrorText = "Invalid description"
            // }

            // if (state.titleError || state.descriptionError) return

            // set state to successfully submit and close dialog




        }
    },
});

export const { openEditDialog, closeDialog, setTitle, setDescription, setGroup, setDiscipline, setPrereqs, verifyForm } = editTopicDialogSlice.actions;

export const selectIsDialogOpen = state => state.editTopicDialog.isDialogOpen;
export const selectTitle = state => state.editTopicDialog.title;
export const selectDescription = state => state.editTopicDialog.description;
export const selectGroup = state => state.editTopicDialog.group;
export const selectDiscipline = state => state.editTopicDialog.discipline;
export const selectPrereqs = state => state.editTopicDialog.prereqs;
export const selectInitialPrereqs = state => state.editTopicDialog.initialPrereqs;

export default editTopicDialogSlice.reducer;
