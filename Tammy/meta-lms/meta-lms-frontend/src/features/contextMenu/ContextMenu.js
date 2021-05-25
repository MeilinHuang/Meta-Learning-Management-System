import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { selectIsOpen, selectAnchorEl, openMenu, closeMenu } from './contextMenuSlice';
import {
    selectContextMenuAnchorX, selectContextMenuAnchorY,
    selectTopicId, selectFilename, selectCategory,
    downloadFile
} from '../detailsCard/detailsCardSlice';

import { removeFile } from '../topicGraph/topicGraphSlice';
import { selectValue } from '../disciplineDropdown/disciplineDropdownSlice';

export const ContextMenu = () => {

    const disciplineVal = useSelector(selectValue);

    const isOpen = useSelector(selectIsOpen);
    const dispatch = useDispatch();
    const anchorX = useSelector(selectContextMenuAnchorX);
    const anchorY = useSelector(selectContextMenuAnchorY);

    const topicId = useSelector(selectTopicId);
    const filename = useSelector(selectFilename);
    const category = useSelector(selectCategory);
    // const anchorEl = useSelector(selectAnchorEl);
    // console.log('ANCHOR: ', anchorEl)
    console.log('x: ', anchorX, 'y: ', anchorY)
    const handleClose = () => {
        dispatch(closeMenu())
    }

    return (
        <Menu
            id="simple-menu"
            // anchorEl={anchorEl}
            open={isOpen}
            // open={Boolean(anchorEl)}
            onClose={handleClose}
            style={{
                left: anchorX + 'px',
                top: anchorY + 'px'
            }}
        >

            <MenuItem
                onClick={() => {
                    // TODO disptach remove learning material
                    // dispatch(removeFile({ topicId, filename, category }))

                    // get the file blob
                    dispatch(downloadFile({ topicId, filename, category }))
                    handleClose()
                }}
            >
                Download
        </MenuItem>
            <MenuItem
                onClick={() => {
                    // TODO disptach remove learning material
                    console.log('removing: ', topicId, filename, category)
                    dispatch(removeFile({ topicId, filename, category, disciplineVal }))

                    handleClose()
                }}
            >
                Remove
        </MenuItem>
            {/* <MenuItem onClick={this.handleClose}>My account</MenuItem>
<MenuItem onClick={this.handleClose}>Logout</MenuItem> */}
        </Menu>)
}