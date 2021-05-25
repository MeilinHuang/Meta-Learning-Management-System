import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from "@material-ui/core/Select";
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { InputBase } from '@material-ui/core';
import NativeSelect from '@material-ui/core/NativeSelect';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { selectDisciplines } from '../topicGraph/topicGraphSlice';

import {

    loadAllTopics
} from '../topicGraph/topicGraphSlice';

import { setValue, selectValue } from './disciplineDropdownSlice';
// import { dispatch } from 'd3-dispatch';
export const DisciplineDropdown = () => {
    const dispatch = useDispatch();
    const disciplines = useSelector(selectDisciplines);
    console.log('discplines: ', disciplines);
    const filterOptions = createFilterOptions({
        matchFrom: 'any',
        stringify: (option) => option.title
    });

    // const disciplineVal = useSelector(selectValue)
    const handleChange = (e) => {
        console.log('event.target.value', e.target.value)
        // dispatch(setValue({ value: e.target.value }));
    }

    let currVal = useSelector(selectValue);
    if (currVal === "") {
        currVal = disciplines[0]
    }

    const filter = createFilterOptions();

    return (
        <>
            {/* <Autocomplete
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    // Suggest the creation of a new value
                    if (params.inputValue !== '') {
                        filtered.push(`${params.inputValue}`);
                    }
                    return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                options={disciplines}
                renderOption={(option) => option}
                style={{ width: 300 }}
                freeSolo
                style={{ width: 500 }}
                renderInput={(params) => (
                    <TextField {...params}
                        // defaultValue={disciplines[0]}
                        label="Discipline"
                        placeholder="e.g. Computer Science and Engineering"
                    />
                )}
                onChange={(e, val) => {
                    console.log('value: ', val);
                    dispatch(setValue(val))
                }}
            /> */}

            <div style={{ background: "white", marginLeft: "30px" }}>
                <Select native={true}
                    // value={currVal}
                    onChange={(e) => {
                        console.log('clicked!', e.target.value);

                        dispatch(setValue(e.target.value))
                        dispatch(loadAllTopics({ disciplineVal: e.target.value }))
                    }}
                    // defaultValue={disciplines[0]}
                    variant="outlined">

                    {disciplines.map(d => (
                        <option key={d} value={d}>{d}</option>

                    ))}
                    {/* <option value={1}>1</option>
                    <option value={2}>2</option> */}
                </Select>
            </div>
            {/* <FormControl >
                <InputLabel id="demo-multiple-name-label">Name</InputLabel>
                <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"

                    value={currVal}
                    onChange={handleChange}
                // input={<Input />}
                // MenuProps={MenuProps}
                >
                    {disciplines.map(d => (
                        <MenuItem
                            key={d}
                            value={d}
                        // style={getStyles(name, personName, theme)}
                        >
                            {d}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl> */}
            {/* <FormControl
                style={{ width: 300, background: "white", marginLeft: "30px" }}>
              
                <Select
                    native
                    // labelId="demo-simple-select-label"
                    // id="demo-simple-select"
                    value={currVal}
                    variant="outlined"
                    defaultValue={disciplines[0]}
                    onChange={handleChange}
                // onChange={handleChange}
                >
                    {
                        disciplines.map((d, index) => {
                            return <MenuItem key={index} value={d}>{d}</MenuItem>
                        })
                    }
                </Select>
            </FormControl> */}
            {/* <Autocomplete
                id="filter-demo"
                options={disciplines}
                getOptionLabel={(option) => option.title}
                filterOptions={filterOptions}
                style={{ width: 300, background: "white" }}
                onChange={(e, val) => {
                    console.log(val);
                    // if (val === null) {
                    //     setSearchValue({ val: "" });
                    // } else {
                    //     setSearchValue({ val });
                    //     dispatch(focusNode(val.id));
                    // }

                }}
                renderInput={(params) =>
                    <TextField {...params}
                        placeholder={"Select Discipline"}
                        // searchForVal
                        // onChange={(e) => { console.log(e.target.value) }}
                        variant="outlined" />}
            /> */}
        </>
    )
}