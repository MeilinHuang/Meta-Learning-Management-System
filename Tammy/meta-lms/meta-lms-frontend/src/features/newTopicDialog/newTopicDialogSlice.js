import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// postNewTopic

export const newTopicDialogSlice = createSlice({
    name: 'newTopicDialog',
    initialState: {
        isDialogOpen: false,

        title: "",
        description: "",
        group: [],
        discipline: [],
        prereqs: [],

        titleError: false,
        titleErrorText: "",
        descriptionError: false,
        descriptionErrorText: "",

        status: null, // status of adding new topic
    },
    reducers: {
        openDialog: (state) => {
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

export const { openDialog, closeDialog, setTitle, setDescription, setGroup, setDiscipline, setPrereqs, verifyForm } = newTopicDialogSlice.actions;

export const selectIsDialogOpen = state => state.newTopicDialog.isDialogOpen;
export const selectTitle = state => state.newTopicDialog.title;
export const selectDescription = state => state.newTopicDialog.description;
export const selectGroup = state => state.newTopicDialog.group;
export const selectDiscipline = state => state.newTopicDialog.discipline;
export const selectPrereqs = state => state.newTopicDialog.prereqs;

export default newTopicDialogSlice.reducer;
