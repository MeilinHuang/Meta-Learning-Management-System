import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { postMaterialsRequest, getMaterialRequest } from '../../api/requests';

export const downloadFile = createAsyncThunk(
    'detailsCard/downloadFile',
    async (obj, { dispatch, getState }) => {
        console.log('download!')
        // get byte64 src
        const src = await getMaterialRequest(obj.topicId, obj.filename, obj.category)
        console.log('source: ', src);


        // convert byte64 to blob
        // window.location.href = 'data:application/octet-stream;base64,' + src;
        let type = null;

        switch (obj.filename.split('.').pop()) {
            // images
            case "jpg":
                type = 'image/jpg';
                break;
            case "png":
                type = 'image/png';
                break;
            // video
            case "mp4":
                type = 'video/mp4';
                break;
            case "mp3":
                type = 'audio/mpeg';
                break;
            // pdf
            case "pdf":
                type = 'application/pdf';
                break;
            case "md":
                type = 'text/markdown';
                break;
            default:
                type = 'text/plain';
                break;
        }



        // https://stackoverflow.com/questions/14011021/how-to-download-a-base64-encoded-image
        var a = document.createElement("a"); //Create <a>
        // a.href = "data:application/octet-stream;base64," + src; //Image Base64 Goes here

        a.href = `data:${type};base64,` + src;
        console.log(a.href)
        a.download = obj.filename; //File name Here
        a.click(); //Downloaded file

        return { topicId: obj.topicId, filename: obj.filename, category: obj.category, src: src }
    }
)



export const detailsCardSlice = createSlice({
    name: 'detailsCard',
    initialState: {
        // isUpload: {
        //     preparation: false,
        //     content: false,
        //     practice: false,
        //     assessment: false,
        // }
        // uploadStage: -1, // -1 means no upload stage
        preparationFilesToUpload: [],
        contentFilesToUpload: [],
        practiceFilesToUpload: [],
        assessmentFilesToUpload: [],

        isUploadPreparation: false,
        isUploadContent: false,
        isUploadPractice: false,
        isUploadAssessment: false,

        fileOpened: null,
        contextMenuAnchorX: 0,
        contextMenuAnchorY: 0,

        topicId: null,
        filename: null,
        category: null,

        src: null
    },
    reducers: {
        openFile: (state, { payload }) => {
            state.fileOpened = payload;
        },
        setContextMenuAnchorEl: (state, { payload }) => {
            console.log('anchoororr')
            state.contextMenuAnchorX = payload.x;
            state.contextMenuAnchorY = payload.y;


            // figure out which file
            state.topicId = payload.topicId;
            state.filename = payload.filename;
            state.category = payload.category;

            // get the file
        },
        setFilesToUpload: (state, { payload }) => {
            console.log('files to upload:', payload)
            console.log(payload.stageInt, payload.filesToUpload)
            // set uploading file for which stage
            // state.uploadStage = payload.stageInt;

            if (payload.stageInt === 1) {
                state.preparationFilesToUpload = JSON.parse(JSON.stringify(payload.filesToUpload))
            } else if (payload.stageInt === 2) {
                state.contentFilesToUpload = JSON.parse(JSON.stringify(payload.filesToUpload))
            } else if (payload.stageInt === 3) {
                state.practiceFilesToUpload = JSON.parse(JSON.stringify(payload.filesToUpload))
            } else if (payload.stageInt === 4) {
                state.assessmentFilesToUpload = JSON.parse(JSON.stringify(payload.filesToUpload))
            }

            // console.log('curr state: ', state.filesToUpload, state.uploadStage)

        },

        setUploadState: (state, { payload }) => {
            console.log('payload: ', payload)
            switch (payload) {
                case 'Preparation':
                    state.isUploadPreparation = true
                    break;
                case 'Content':
                    state.isUploadContent = true
                    break;
                case 'Practice':
                    state.isUploadPractice = true
                    break;
                case 'Assessment':
                    state.isUploadAssessment = true
                    break;
                default:
            }
            console.log(state.isUpload);

        },
        setViewOnlyState: (state, { payload }) => {
            switch (payload) {
                case 'Preparation':
                    state.isUploadPreparation = false
                    break;
                case 'Content':
                    state.isUploadContent = false
                    break;
                case 'Practice':
                    state.isUploadPractice = false
                    break;
                case 'Assessment':
                    state.isUploadAssessment = false
                    break;
                default:
            }
        },

        [downloadFile.pending]: (state, action) => {
            state.status = 'loading'
        },
        [downloadFile.fulfilled]: (state, { payload }) => {

            state.status = 'success'
        },
        [downloadFile.rejected]: (state, action) => {
            state.status = 'failed'
        },


    },

});

export const { setFilesToUpload, setContextMenuAnchorEl, setUploadState, setViewOnlyState } = detailsCardSlice.actions;

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
export const selectIsUploadPreparation = state => state.detailsCard.isUploadPreparation;
export const selectIsUploadContent = state => state.detailsCard.isUploadContent;
export const selectIsUploadPractice = state => state.detailsCard.isUploadPractice;
export const selectIsUploadAssessment = state => state.detailsCard.isUploadAssessment;


export const selectPreparationFiles = state => state.detailsCard.preparationFilesToUpload;
export const selectContentFiles = state => state.detailsCard.contentFilesToUpload;
export const selectPracticeFiles = state => state.detailsCard.practiceFilesToUpload;
export const selectAssessmentFiles = state => state.detailsCard.assessmentFilesToUpload;


export const selectContextMenuAnchorX = state => state.detailsCard.contextMenuAnchorX;
export const selectContextMenuAnchorY = state => state.detailsCard.contextMenuAnchorY;

export const selectTopicId = state => state.detailsCard.topicId;
export const selectFilename = state => state.detailsCard.filename;
export const selectCategory = state => state.detailsCard.category;

export default detailsCardSlice.reducer;
