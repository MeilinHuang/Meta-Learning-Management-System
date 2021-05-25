import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { selectFocusedNode } from '../topicGraph/topicGraphSlice';

import {
    openMenu, closeExportMenu, setAnchorEl, selectIsOpen, selectAnchorEl,
    selectAnchorX, selectAnchorY, downloadZip, downloadCC
} from './exportMenuSlice';


// menu when trying to export topic as packages
export const ExportMenu = () => {
    const dispatch = useDispatch();

    const topicId = useSelector(selectFocusedNode);


    const isOpen = useSelector(selectIsOpen);
    // const anchorEl = useSelector(selectAnchorEl);
    const anchorX = useSelector(selectAnchorX);
    const anchorY = useSelector(selectAnchorY);
    // console.log('anchor element: ', anchorEl)

    return (
        <Menu
            id="simple-menu"
            // anchorEl={anchorEl}
            open={isOpen}
            // open={Boolean(anchorEl)}
            onClose={() => { dispatch(closeExportMenu()) }}
            style={{
                left: anchorX + 'px',
                top: anchorY + 'px'
            }}
        >

            <MenuItem
                onClick={() => {
                    dispatch(downloadZip({ topicId }))
                    dispatch(closeExportMenu())
                }}
            >
                as .zip
        </MenuItem>
            <MenuItem
                onClick={() => {
                    dispatch(downloadCC({ topicId }))
                    dispatch(closeExportMenu())
                }}

            >
                as .imscc
        </MenuItem>

        </Menu>)
}