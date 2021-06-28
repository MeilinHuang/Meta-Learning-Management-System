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
import DraftEditor from './DraftEditor/DraftEditor'

function AddPostModal({ isOpen, onClose }) {
    const [title, setTitle] = useState('')
    const [details, setDetails] = useState('')

    const handleSubmit = e => {
        e.preventDefault()
        const postDetails = {
            title,
            details
        }
        console.log(postDetails)
    }

    return (
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
                    {/* Placeholder details area */}
                    <Flex flexDirection="column">
                        <Heading size="sm" mb="4px">Details</Heading>
                        <DraftEditor setDetails={setDetails}  />
                    </Flex>
                </form>
                </ModalBody>
                <ModalFooter>
                    <Button type="submit" form="createPost">Save</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddPostModal