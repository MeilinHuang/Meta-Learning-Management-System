import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getMaterialRequest } from '../../api/requests'


// https://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript

// save button!

export const viewMarkdown = createAsyncThunk(
    'markdownEditor/viewMarkdown',
    async (obj, { dispatch, getState }) => {
        console.log('viewing file by downlaoding!', obj.topicId, '!', obj.filename, obj.category)
        let src;
        if (obj.filename !== "") { // empty
            // get byte64 src
            src = await getMaterialRequest(obj.topicId, obj.filename, obj.category)
            console.log('source: ', src, obj.topicId, obj.filename, obj.category);
        } else {
            src = "";
        }
        // convert byte64 to string

        return { topicId: obj.topicId, filename: obj.filename, category: obj.category, src: src }
    }
)

export const markdownEditorSlice = createSlice({
    name: 'markdownEditor',
    initialState: {
        isOpen: false,

        input: "",
        filename: "",

        stage: null,
        topicId: null
    },
    reducers: {
        openEditor: (state, { payload }) => {
            state.isOpen = true;

            state.stage = payload.stageInt;
            state.topicId = payload.topicId;
            console.log('state markdown:', state.stage, state.topicId)
        },
        closeEditor: (state) => {
            state.isOpen = false;
        },
        setInput: (state, { payload }) => {
            state.input = payload.input;
        },
        setFilename: (state, { payload }) => {
            console.log('filename: ', payload.filename)
            state.filename = payload.filename;
        }


    },
    extraReducers: {
        // Add reducers for additional action types here, and handle loading state as needed
        [viewMarkdown.pending]: (state, action) => {
            state.status = 'loading'
            console.log('loading')
        },
        [viewMarkdown.fulfilled]: (state, { payload }) => {
            // console.log('downloaded payload! ', payload)

            state.filename = payload.filename;
            state.src = payload.src;
            state.topicId = payload.topicId;
            state.stage = payload.category;
            // atob(state.src.replace('data:text/markdown;base64,', ''))
            console.log('state: ', state.filename, state.src)
            state.input = atob(state.src)
            // convet src into input str
            // atob(state.src)


            console.log('success!')
            state.isOpen = true;
            state.status = 'success'
        },
        [viewMarkdown.rejected]: (state, action) => {
            state.status = 'failed'
            console.log('failed')
        }
    }
});

export const { openEditor, closeEditor, setInput, setFilename } = markdownEditorSlice.actions;

export const selectTopicId = state => state.markdownEditor.topicId;
export const selectStage = state => state.markdownEditor.stage;
export const selectIsOpen = state => state.markdownEditor.isOpen;
export const selectInput = state => state.markdownEditor.input;
export const selectFilename = state => state.markdownEditor.filename;

export default markdownEditorSlice.reducer;
