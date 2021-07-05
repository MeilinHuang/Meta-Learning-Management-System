import React from "react"
import Select from 'react-select'
import classnames from 'classnames'
import makeAnimated from 'react-select/animated'
import styles from './TagSelect.module.css'

function TagSelect({ isFilter, setTags }) {
    const options = [
        // set value as id and label as name
        { value: 'tag1', label: 'Tag 1' },
        { value: 'tag2', label: 'Tag 2' },
        { value: 'tag3', label: 'Tag 3' },
    ]

    const handleSelect = selectedTags => {
        let currentTags = []
        selectedTags.forEach(({ value, label }) => {
            currentTags.push({id: value, name: label})
        })
        setTags(currentTags)
    }

    return (
        <Select 
            className={classnames(styles.select, { [styles.filter]: isFilter })}
            isMulti
            options={options}
            components={makeAnimated()}
            placeholder="Filter"
            onChange={handleSelect}
        />
    )
}

export default TagSelect