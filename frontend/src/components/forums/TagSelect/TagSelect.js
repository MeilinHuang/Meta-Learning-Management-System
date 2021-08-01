import React, { useEffect, useState } from "react"
import Select from 'react-select'
import classnames from 'classnames'
import makeAnimated from 'react-select/animated'
import styles from './TagSelect.module.css'

function TagSelect({ isFilter, setSelectedTags, tags }) {
    const tagsList = tags.map(({ tag_id, name}) => ({ value: tag_id, label: name }))
    
    // Add default tags
    // tagsList.push({ value: '000', label: 'Announcement'})

    const handleSelect = selectedTags => {
        let currentTags = []
        selectedTags.forEach(({ value }) => {
            currentTags.push(value)
        })
        setSelectedTags(currentTags)
    }

    return (
        <Select 
            className={classnames(styles.select, { [styles.filter]: isFilter })}
            isMulti
            options={tagsList}
            components={makeAnimated()}
            placeholder={isFilter ? "Filter" : 'Select'}
            onChange={handleSelect}
        />
    )
}

export default TagSelect