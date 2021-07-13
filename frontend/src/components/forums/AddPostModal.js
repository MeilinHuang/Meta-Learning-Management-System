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
import TagSelect from './TagSelect/TagSelect'

function AddPostModal({ isOpen, onClose }) {
    const [title, setTitle] = useState('')
    const [details, setDetails] = useState('')
    const [image, setImage] = useState({})
    const [tags, setTags] = useState([])

    const handleSubmit = e => {
        e.preventDefault()
        const postDetails = {
            title,
            details,
            tags,
            image,
        }
        console.log(postDetails)
    }

    const handleUpload = e => {
        setImage(e.target.files[0])
        // console.log(e.target.files[0])
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
                        {/* <Flex flexDirection="column" mb="16px">
                            <Heading size="sm" mb="4px">Attach Images</Heading>
                            <input type="file" name="images" onChange={handleUpload} />
                        </Flex> */}
                        <Flex flexDirection="column">
                            <Heading size="sm" mb="4px">Tags</Heading>
                            <TagSelect setTags={setTags} />
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