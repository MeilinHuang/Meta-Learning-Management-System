import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    Button, Dialog, DialogTitle, DialogContent, DialogContentText,
    TextField, Checkbox, DialogActions
} from '@material-ui/core';

import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/core/Checkbox';
import AddIcon from '@material-ui/icons/Add';
import { spacing } from '@material-ui/system';

import './EditTopicDialog.css';
import {
    focusNode,
    blurNode,
    selectFocusedNode,
    selectNodes,
    selectLinks,
    addNewTopic,
    selectGroups,
    selectDisciplines,
    loadAllTopics,
    editTopic
} from '../topicGraph/topicGraphSlice';
import {
    openDialog,
    closeDialog,
    setTitle,
    setDescription,
    setGroup,
    setDiscipline,
    setPrereqs,
    selectInitialPrereqs,
    verifyForm,
    selectIsDialogOpen,
    selectTitle,
    selectDescription,
    selectGroup,
    selectPrereqs,
    selectDiscipline,
} from './editTopicDialogSlice';
import { selectValue } from '../disciplineDropdown/disciplineDropdownSlice';



// TODO: split up this component so the button is separate
export const EditTopicDialog = () => {

    const disciplineVal = useSelector(selectValue);

    const isOpen = useSelector(selectIsDialogOpen)
    // console.log('is open: ', isOpen)
    const topicId = useSelector(selectFocusedNode);
    const title = useSelector(selectTitle);

    const description = useSelector(selectDescription);
    const group = useSelector(selectGroup);
    const discipline = useSelector(selectDiscipline);
    const prereqs = useSelector(selectPrereqs);
    console.log('edit prereqs: ', prereqs);
    const initialPrereqs = useSelector(selectInitialPrereqs);


    const topics = useSelector(selectNodes);
    console.log('topics: ', topics, 'prereqs: ', prereqs)

    const groups = useSelector(selectGroups);
    const disciplines = useSelector(selectDisciplines);

    const dispatch = useDispatch();

    const filter = createFilterOptions();
    // const options = ['One', 'Two', 'Three', 'Four']

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
    // const checkedIcon = <CheckBoxIcon fontSize="small" />


    // finds current prereq objects
    const findCurrPrereqObjs = (ts, ps) => {
        let curr = [];
        // for each prereq
        ps.forEach(p => {
            // go through all the topics
            ts.forEach(t => {
                if (t.title === p.title) {
                    // if we found the topic object
                    curr.push(t);
                }
            })
        })
        // ts.forEach(t => {
        //     console.log(ps.includes(t.title), ps, t.title);
        //     if (ps.includes(t.title)) {
        //         curr.push(t);
        //     }
        // });
        console.log('curr: ', curr, ts, ps)
        return curr;
    }

    return (
        <>
            <Dialog
                open={true}
                onClose={() => {
                    console.log('close dialog!')
                    dispatch(closeDialog())

                }}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit Topic</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please edit the details of your topic.
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

                    />


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
                        value={group}
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
                        value={discipline}
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

                        // bug
                        value={findCurrPrereqObjs(topics, prereqs)}


                        style={{ width: 500 }}
                        renderInput={(params) => (
                            <TextField {...params}
                                label="Prerequisite(s)"
                                placeholder="e.g. Pointers"
                            />
                        )}
                        onChange={(e, val) => dispatch(setPrereqs(val))}
                    />
                    {/* <Autocomplete
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
                        value={findCurrPrereqObjs(topics, prereqs)}
                        style={{ width: 500 }}
                        renderInput={(params) => (
                            <TextField {...params}
                                label="Prerequisite(s)"
                                placeholder="e.g. Pointers"
                            />
                        )}
                        onChange={(e, val) => { console.log('changed', val); dispatch(setPrereqs(val)) }}
                    /> */}

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => dispatch(closeDialog())} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={
                        () => {
                            dispatch(verifyForm())


                            dispatch(editTopic({
                                topicId, title, description, group, discipline,
                                prereqs: findCurrPrereqObjs(topics, prereqs),
                                initialPrereqs: findCurrPrereqObjs(topics, initialPrereqs),
                                disciplineVal
                            }))
                            dispatch(closeDialog())
                        }
                    } color="primary">
                        Confirm Edits
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    );
}