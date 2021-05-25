import axios from 'axios';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { postMaterialsRequest } from '../../api/requests';

import { selectContextMenuAnchorEl } from '../detailsCard/detailsCardSlice';

export const contextMenuSlice = createSlice({
    name: 'contextMenu',
    initialState: {
        isOpen: false,
        anchorEl: null
    },
    reducers: {
        openMenu: (state, { payload }) => {
            state.isOpen = true;
            // state.anchorEl = payload.anchorEl;
        },
        closeMenu: (state, { payload }) => {
            state.isOpen = false;

        }
    },

});

export const { openMenu, closeMenu } = contextMenuSlice.actions;


// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`

export const selectIsOpen = state => state.contextMenu.isOpen;
export const selectAnchorEl = state => state.contextMenu.anchorEl;

export default contextMenuSlice.reducer;
