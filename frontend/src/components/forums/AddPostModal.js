import React, { useState } from "react"
import {
    Alert,
    AlertDescription,
    Button,
    CloseButton,
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
    // const [post, setPost] = useState('')
    // const [showAlert, setShowAlert] = useState(false)

    const handleSubmit = e => {
        e.preventDefault()
        const postDetails = {
            title,
            details
        }
        // setPost(details)
        // setShowAlert(true)
        console.log(postDetails)
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
                        {/* Placeholder details area */}
                        <Flex flexDirection="column">
                            <Heading size="sm" mb="4px">Details</Heading>
                            <DraftEditor setDetails={setDetails}  />
                        </Flex>
                    </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" form="createPost" onClick={onClose}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {/* {showAlert && <Alert status="error">
                <AlertDescription dangerouslySetInnerHTML={{ __html: post }} />
                <CloseButton position="absolute" right="8px" top="8px" />
            </Alert>} */}
        </>
    )
}

export default AddPostModal