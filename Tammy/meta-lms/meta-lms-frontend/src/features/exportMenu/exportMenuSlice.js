import axios from 'axios';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getTopicExportRequest } from '../../api/requests';


export const downloadZip = createAsyncThunk(
    'exportMenu/downloadZip',
    async (obj, { dispatch, getState }) => {
        console.log('download zip!', obj.topicId)

        const exportObj = await getTopicExportRequest(obj.topicId, 1);
        // get byte64 src
        // const src = await getMaterialRequest(obj.topicId, obj.filename, obj.category)
        // console.log('source: ', src);


        // convert byte64 to blob
        // window.location.href = 'data:application/octet-stream;base64,' + src;
        const type = 'application/zip';



        // https://stackoverflow.com/questions/14011021/how-to-download-a-base64-encoded-image
        var a = document.createElement("a"); //Create <a>
        // a.href = "data:application/octet-stream;base64," + src; //Image Base64 Goes here

        a.href = `data:${type};base64,` + exportObj.file;
        console.log(a.href)
        a.download = exportObj.name; //File name Here
        a.click(); //Downloaded file

        // return { topicId: obj.topicId, filename: obj.filename, category: obj.category, src: src }
    }
)



export const downloadCC = createAsyncThunk(
    'exportMenu/downloadCC',
    async (obj, { dispatch, getState }) => {
        console.log('download CC!', obj.topicId)

        const exportObj = await getTopicExportRequest(obj.topicId, 2);
        // get byte64 src
        // const src = await getMaterialRequest(obj.topicId, obj.filename, obj.category)
        // console.log('source: ', src);


        // convert byte64 to blob
        // window.location.href = 'data:application/octet-stream;base64,' + src;
        const type = 'application/imscc';



        // https://stackoverflow.com/questions/14011021/how-to-download-a-base64-encoded-image
        var a = document.createElement("a"); //Create <a>
        // a.href = "data:application/octet-stream;base64," + src; //Image Base64 Goes here

        a.href = `data:${type};base64,` + exportObj.file;
        console.log(a.href)
        a.download = exportObj.name; //File name Here
        a.click(); //Downloaded file

        // return { topicId: obj.topicId, filename: obj.filename, category: obj.category, src: src }
    }
)

export const exportMenuSlice = createSlice({
    name: 'exportMenu',
    initialState: {
        isOpen: false,
        anchorEl: null,
        xPos: 0,
        yPos: 0
    },
    reducers: {
        openExportMenu: (state, { payload }) => {
            state.isOpen = true;
            // state.anchorEl = payload.anchorEl;
        },
        closeExportMenu: (state, { payload }) => {
            state.isOpen = false;

        },
        setAnchorEl: (state, { payload }) => {
            state.xPos = payload.x;
            state.yPos = payload.y;
        }
    },
    extraReducers: {
        [downloadZip.pending]: (state, action) => {
            console.log('PENDING!')
            state.status = 'loading'
        },
        [downloadZip.fulfilled]: (state, { payload }) => {
            console.log('SUCECSSS!')
            state.status = 'success'
        },
        [downloadZip.rejected]: (state, action) => {
            console.log('FAILED!')
            state.status = 'failed'
        },

        [downloadCC.pending]: (state, action) => {
            console.log('PENDING!')
            state.status = 'loading'
        },
        [downloadCC.fulfilled]: (state, { payload }) => {
            console.log('SUCECSSS!')
            state.status = 'success'
        },
        [downloadCC.rejected]: (state, action) => {
            console.log('FAILED!')
            state.status = 'failed'
        },
    }

});

export const { openExportMenu, closeExportMenu, setAnchorEl } = exportMenuSlice.actions;


// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`

export const selectIsOpen = state => state.exportMenu.isOpen;
export const selectAnchorEl = state => state.exportMenu.anchorEl;
export const selectAnchorX = state => state.exportMenu.xPos;
export const selectAnchorY = state => state.exportMenu.yPos;

export default exportMenuSlice.reducer;
