import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    Button, Dialog, DialogTitle, DialogContent, DialogContentText,
    TextField, Checkbox, DialogActions
} from '@material-ui/core';
// import { Autocomplete } from '@material-ui/lab';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/core/Checkbox';
import AddIcon from '@material-ui/icons/Add';
import { spacing } from '@material-ui/system';
// import { red, blue } from 'material-ui/colors'



import {
    openDialog,
    closeDialog,

    setTitle,
    setDescription,
    setGroup,
    setDiscipline,
    setPrereqs,

    verifyForm,
    selectIsDialogOpen,
    selectTitle,
    selectDescription,
    selectGroup,
    selectDiscipline,
    selectPrereqs,


} from './newTopicDialogSlice';
import {
    focusNode,
    blurNode,
    selectFocusedNode,
    selectNodes,
    selectLinks,
    addNewTopic,
    selectGroups,
    selectDisciplines,
    loadAllTopics
} from '../topicGraph/topicGraphSlice';

import './NewTopicDialog.css';
import { selectValue } from '../disciplineDropdown/disciplineDropdownSlice';



// TODO: split up this component so the button is separate
export const NewTopicDialog = () => {
    const isOpen = useSelector(selectIsDialogOpen);

    const title = useSelector(selectTitle);

    const description = useSelector(selectDescription);
    const group = useSelector(selectGroup);
    const discipline = useSelector(selectDiscipline);
    const prereqs = useSelector(selectPrereqs);
    console.log('new prereqs: ', prereqs);

    const topics = useSelector(selectNodes);

    const groups = useSelector(selectGroups);
    const disciplines = useSelector(selectDisciplines);

    const dispatch = useDispatch();

    const disciplineVal = useSelector(selectValue);
    const filter = createFilterOptions();
    const options = ['One', 'Two', 'Three', 'Four']

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
    const checkedIcon = <CheckBoxIcon fontSize="small" />

    return (
        <>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => dispatch(openDialog())}
                className="button"
                startIcon={<AddIcon />}
                style={{
                    // borderRadius: 35,
                    backgroundColor: "#fff",
                    // padding: "18px 36px",
                    // fontSize: "18px"
                }}
            >
                Add New Topic
            </Button>
            <Dialog open={isOpen} onClose={() => {
                console.log('close dialog!')
                dispatch(closeDialog())

            }} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add New Topic</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the details of your new topic.
                    </DialogContentText>

                    {/* title */}
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        type="string"
                        fullWidth
                        placeholder="e.g. Linked List"
                        required={true}
                        value={title}
                        onChange={(e) => dispatch(setTitle(e.target.value))}
                    // helperText="Invalid title"
                    // error={}
                    />

                    {/* description */}
                    <TextField
                        margin="dense"
                        label="Short Description"
                        type="string"
                        fullWidth
                        placeholder="Description of the topic"
                        required={true}
                        value={description}
                        onChange={(e) => dispatch(setDescription(e.target.value))}

                    // helperText={this.state.descriptionHelperText}
                    // error={this.state.descriptionError}
                    />
                    {/* https://www.geeksforgeeks.org/adding-new-options-in-dropdown-dynamically-using-reactjs/ */}
                    {/* <TextField
                        margin="dense"
                        label="Group"
                        type="string"
                        fullWidth
                        placeholder="E.g. C Programming"
                        required={true}
                        value={''}
                        onChange={(e) => dispatch(setDescription(e.target.value))}
                    // helperText={this.state.descriptionHelperText}
                    // error={this.state.descriptionError}
                    /> */}

                    {/* TODO come back and fill this out with all the group values */}

                    {/* group */}
                    <Autocomplete
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params);
                            // Suggest the creation of a new value
                            if (params.inputValue !== '') {
                                filtered.push(`${params.inputValue}`);
                            }
                            // console.log('filtered: ', filtered)
                            return filtered;
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        options={groups}
                        renderOption={(option) => option}
                        style={{ width: 300 }}
                        freeSolo
                        style={{ width: 500 }}
                        renderInput={(params) => (
                            <TextField {...params}
                                label="Group"
                                placeholder="e.g. C Programming"
                            />
                        )}
                        onChange={(e, val) => {
                            // console.log('group!', val)
                            if (e.target.value === 0) {

                            }
                            dispatch(setGroup(val))

                        }}
                    />
                    {/* discipline */}
                    <Autocomplete
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
                                label="Discipline"
                                placeholder="e.g. Computer Science and Engineering"
                            />
                        )}
                        onChange={(e, val) => dispatch(setDiscipline(val))}
                    />

                    {/* prerequisites */}
                    <Autocomplete
                        multiple
                        id="checkboxes"
                        options={topics}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.title}
                        renderOption={(option, { selected }) => (
                            <>
                                <Checkbox
                                    icon={icon}
                                    // checkedIcon={checkedIcon}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                    value={prereqs}
                                />
                                {option.title}
                            </>
                        )}
                        style={{ width: 500 }}
                        renderInput={(params) => (
                            <TextField {...params}
                                label="Prerequisite(s)"
                                placeholder="e.g. Pointers"
                            />
                        )}
                        onChange={(e, val) => dispatch(setPrereqs(val))}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => dispatch(closeDialog())} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={
                        () => dispatch(verifyForm())
                            && dispatch(addNewTopic({
                                title, description, group, discipline, prereqs, disciplineVal
                            })) && dispatch(loadAllTopics({ disciplineVal }))
                            && dispatch(closeDialog())
                    } color="primary">
                        Add Topic
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    );
}