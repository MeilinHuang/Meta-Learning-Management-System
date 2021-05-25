import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const searchBarSlice = createSlice({
    name: 'searchBar',
    initialState: {
        searchFor: 'topic',
        searchValue: {},
    },
    reducers: {
        searchFor: (state, { payload }) => {
            state.searchFor = payload.searchFor
        },
        setSearchValue: (state, { payload }) => {
            state.searchValue = payload.val
        }
        // updateData: (state, { payload }) => {
        //     // console.log('payload: ', payload)
        //     state.data = payload;
        // },
        // updateNetworkData: (state, { payload }) => {
        //     // console.log('!network data: ', payload);
        //     state.networkData = payload;
        // }
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

export const { searchFor, setSearchValue } = searchBarSlice.actions;


export const selectSearchFor = state => state.searchBar.searchFor;
// export const selectData = state => state.network.data;
// export const selectNetworkData = state => state.network.networkData;

export default searchBarSlice.reducer;