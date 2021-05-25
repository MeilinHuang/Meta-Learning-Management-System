import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const disciplineDropdownSlice = createSlice({
    name: 'disciplineDropdown',
    initialState: {
        value: "Computer Science and Engineering",
    },
    reducers: {
        setValue: (state, { payload }) => {
            console.log('payload: ', payload)
            state.value = payload
        }

    },
});

export const { setValue } = disciplineDropdownSlice.actions;

export const selectValue = state => state.disciplineDropdown.value;

export default disciplineDropdownSlice.reducer;