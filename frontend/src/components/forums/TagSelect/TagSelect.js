import React, { useEffect, useState } from "react"
import Select from 'react-select'
import classnames from 'classnames'
import makeAnimated from 'react-select/animated'
import styles from './TagSelect.module.css'

function TagSelect({ isFilter, setTags: setSelectedTags }) {
    const [ tags, setTags ] = useState([])

    useEffect(() => {
        fetch(`http://localhost:8000/forum/tags`, { method: 'PUT' }).then(r => r.json()).then(data => {
            setTags(data.map(({ tag_id, name }) => ({ value: tag_id, label: name })))
        })
    }, [])

    const handleSelect = selectedTags => {
        let currentTags = []
        selectedTags.forEach(({ value, label }) => {
            currentTags.push({tag_id: value, name: label})
        })
        setSelectedTags(currentTags)
    }

    return (
        <Select 
            className={classnames(styles.select, { [styles.filter]: isFilter })}
            isMulti
            options={tags}
            components={makeAnimated()}
            placeholder={isFilter ? "Filter" : 'Select'}
            onChange={handleSelect}
        />
    )
}

export default TagSelect