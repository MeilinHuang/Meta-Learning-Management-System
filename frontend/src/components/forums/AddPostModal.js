import React, { useEffect, useState } from "react"
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
    useToast,
} from "@chakra-ui/react"
import DraftEditor from './DraftEditor/DraftEditor'
import TagSelect from './TagSelect/TagSelect'

const dummyAuthor = 2

function AddPostModal({ isOpen, onClose, isForums, onSubmit }) {
    const [title, setTitle] = useState('')
    const [details, setDetails] = useState('')
    const [relatedLink, setRelatedLink] = useState('')
    const [images, setImages] = useState([])
    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])
    const toast = useToast()

    useEffect(() => {
        fetch(`http://localhost:8000/forum/tags`, { method: 'PUT' }).then(r => r.json()).then(data => setTags(data))
    }, [])

    const handleSubmit = e => {
        e.preventDefault()
        e.target.reset()
        console.log(details)

        if (title === '' || details.replace(/<[^>]+>/g, '') === '') {
            toast({
                title: 'Required fields missing',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return
        }

        const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000
        const date = new Date(Date.now() - timeZoneOffset).toISOString()

        const formData = new FormData()
        formData.append('user_id', dummyAuthor)
        formData.append('uploadFile', images)
        formData.append('title', title)
        formData.append('description', details)
        formData.append('publishedDate', date)

        if (selectedTags) {
            formData.append('tags', selectedTags)
        }

        onSubmit(formData)

        setTags([])
        setImages([])

        onClose()
    }

    const handleUpload = e => {
        setImages(e.target.files[0])
        console.log(e.target.files[0])
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} isCentered size="xl" p="24px">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{isForums ? 'Create new forum post' : 'Create new post'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <form id="createPost" onSubmit={handleSubmit} enctype="multipart/form-data">
                        <Flex flexDirection="column" mb="16px">
                            <Heading size="sm" mb="4px">Title*</Heading>
                            <Input name="postTitle" onChange={e => setTitle(e.target.value)} />
                        </Flex>
                        <Flex flexDirection="column">
                            <Heading size="sm" mb="4px">Details*</Heading>
                            <DraftEditor setDetails={setDetails}  />
                        </Flex>
                        <Flex flexDirection="column" mb="16px">
                            <Heading size="sm" mb="4px">Attach Images</Heading>
                            <input type="file" name="images" onChange={handleUpload} />
                        </Flex>
                        {isForums &&
                            <>
                                <Flex flexDirection="column">
                                    <Heading size="sm" mb="4px">Tags</Heading>
                                    <TagSelect setSelectedTags={setSelectedTags} tags={tags} />
                                </Flex>
                                <Flex flexDirection="column" mt="16px">
                                    <Heading size="sm" mb="4px">Related Link</Heading>
                                    <Input name="postRelatedLink" onChange={e => setRelatedLink(e.target.value)} />
                                </Flex>
                            </>
                        }
                    </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" form="createPost">Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddPostModal