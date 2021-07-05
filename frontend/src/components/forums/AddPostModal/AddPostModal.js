import React, { useState } from "react"
import {
    Button,
    Flex,
    Heading,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react"
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import DraftEditor from '../DraftEditor/DraftEditor'
import styles from './AddPostModal.module.css'

function AddPostModal({ isOpen, onClose }) {
    const [title, setTitle] = useState('')
    const [details, setDetails] = useState('')
    const [tags, setTags] = useState([])

    const options = [
        // set value as id and label as name
        { value: 'tag1', label: 'Tag 1' },
        { value: 'tag2', label: 'Tag 2' },
        { value: 'tag3', label: 'Tag 3' },
    ]

    const handleSubmit = e => {
        e.preventDefault()
        const postDetails = {
            title,
            details,
            tags,
        }
        console.log(postDetails)
    }

    const handleSelect = selectedTags => {
        let currentTags = []
        selectedTags.forEach(({ value, label }) => {
            currentTags.push({id: value, name: label})
        })
        setTags(currentTags)
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} isCentered size="xl" p="24px">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create new post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <form id="createPost" onSubmit={handleSubmit}>
                        <Flex flexDirection="column" mb="16px">
                            <Heading size="sm" mb="4px">Title</Heading>
                            <Input name="postTitle" onChange={e => setTitle(e.target.value)} />
                        </Flex>
                        <Flex flexDirection="column">
                            <Heading size="sm" mb="4px">Details</Heading>
                            <DraftEditor setDetails={setDetails}  />
                        </Flex>
                        {/* Add upload image here */}
                        <Flex flexDirection="column">
                            <Heading size="sm" mb="4px">Tags</Heading>
                            <Select className={styles.select} isMulti options={options} components={makeAnimated()} onChange={handleSelect} />
                        </Flex>
                    </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" form="createPost" onClick={onClose}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddPostModal