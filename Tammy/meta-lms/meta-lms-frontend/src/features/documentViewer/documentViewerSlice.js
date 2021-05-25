import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getMaterialRequest } from '../../api/requests'
// postNewTopic

export const viewFile = createAsyncThunk(
    'documentViewer/viewFile',
    async (obj, { dispatch, getState }) => {
        console.log('viewing file by downlaoding!', obj.topicId, obj.filename, obj.category)
        // get byte64 src
        const src = await getMaterialRequest(obj.topicId, obj.filename, obj.category)
        console.log('source: ', src, obj.topicId, obj.filename, obj.category);


        // convert byte64 to blob
        // window.location.href = 'data:application/octet-stream;base64,' + src;


        // https://stackoverflow.com/questions/14011021/how-to-download-a-base64-encoded-image
        // var a = document.createElement("a"); //Create <a>
        // a.href = "data:application/octet-stream;base64," + src; //Image Base64 Goes here
        // a.download = obj.filename; //File name Here
        // a.click(); //Downloaded file
        // return null;
        return { topicId: obj.topicId, filename: obj.filename, category: obj.category, src: src }
    }
)


export const documentViewerSlice = createSlice({
    name: 'documentViewer',
    initialState: {
        isOpen: false,

        filename: "",
        src: "",
        type: ""
    },
    reducers: {
        openViewer: (state) => {
            state.isOpen = true;
        },
        closeViewer: (state) => {
            state.isOpen = false;
        }


    },
    extraReducers: {
        // Add reducers for additional action types here, and handle loading state as needed
        [viewFile.pending]: (state, action) => {
            state.status = 'loading'
            console.log('loading')
        },
        [viewFile.fulfilled]: (state, { payload }) => {
            // console.log('downloaded payload! ', payload)

            state.filename = payload.filename;
            state.src = payload.src;

            // mime type

            switch (state.filename.split('.').pop()) {
                // images
                case "jpg":
                    state.type = 'image/jpg';
                    break;
                case "png":
                    state.type = 'image/png';
                    break;
                // video
                case "mp4":
                    state.type = 'video/mp4';
                    break;
                case "mp3":
                    state.type = 'audio/mpeg';
                    break;
                // pdf
                case "pdf":
                    state.type = 'application/pdf';
                    break;
                case "md":
                    state.type = 'text/markdown';
                    break;
                default:
                    state.type = 'text/plain';
                    break;
            }


            state.isOpen = true;
            console.log('state: ', state.filename, state.src)
            console.log('success!')
            state.status = 'success'
        },
        [viewFile.rejected]: (state, action) => {
            state.status = 'failed'
            console.log('failed')
        }
    }
});

export const { openViewer, closeViewer } = documentViewerSlice.actions;


export const selectIsOpen = state => state.documentViewer.isOpen;
export const selectFilename = state => state.documentViewer.filename;
export const selectType = state => state.documentViewer.type;
export const selectSrc = state => state.documentViewer.src;

export default documentViewerSlice.reducer;
