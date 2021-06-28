import React from "react"
import {
    Button,
    Input,
    InputGroup,
    InputLeftAddon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
  } from "@chakra-ui/react"

function AddPostModal({ isOpen, onClose }) {
    const handleSubmit = e => {
        e.preventDefault()
        const postDetails = {
            title: e.target[0].value,
            description: e.target[1].value,
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
                    <InputGroup>
                        <InputLeftAddon children="Title" />
                        <Input name="postTitle" />
                    </InputGroup>
                    {/* Placeholder details area */}
                    <InputGroup mt="16px">
                        <InputLeftAddon children="Details" />
                        <Input name="details" />
                    </InputGroup>
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