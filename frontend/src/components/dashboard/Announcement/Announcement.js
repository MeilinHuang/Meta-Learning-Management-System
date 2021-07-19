import React, { useEffect, useState } from "react"
import {
    ButtonGroup,
    Button,
    Box,
    Divider,
    Flex,
    Heading,
    InputGroup,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    Text,
    useToast,
} from "@chakra-ui/react"
import { GrEdit, GrShare } from 'react-icons/gr'
import { BiTrash } from 'react-icons/bi'
import { AiOutlineSend } from "react-icons/ai"
import { ContentState, convertFromHTML } from 'draft-js'
import DraftEditor from '../../forums/DraftEditor/DraftEditor'
import AuthorDetails from '../../forums/AuthorDetails'
import styles from './Announcement.module.css'

function Announcement({ announcement: { author, id, title, content, post_date }, course, setAnnouncements }) {
    const [ editorState, setEditorState ] = useState('')
    const [ details, setDetails ] = useState()
    const toast = useToast()

    useEffect(() => {
        setDetails(content)
    }, [content])

    const shareLink = () => {
        const link = window.location.origin
        navigator.clipboard.writeText(`${link}#announcement-${id}`)
        toast({
            title: 'Copied link',
            status: 'success',
            duration: 3000,
            isClosable: true,
        })
    }

    const editPost = () => {
        const markup = convertFromHTML(details)
        const state = ContentState.createFromBlockArray(markup)
        setEditorState(state)
    }

    const handleSubmit = e => {
        e.preventDefault()
        fetch(
            `http://localhost:8000/${course}/announcement/${id}`,
            {
                method: 'PUT',
                body: JSON.stringify({
                    title,
                    content: details,
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        ).then(r => console.log(r)) // TODO: handle errors (maybe don't change the value in the frontend until this is okay)
        setEditorState('')
    }

    const handleDelete = onClose => {
        fetch(
            `http://localhost:8000/${course}/announcement/${id}`, { method: 'DELETE' }
        ).then(r => {
            if (r.status === 200) {
                fetch(`http://localhost:8000/${course}/announcement`).then(r => r.json()).then(data => {
                    setAnnouncements(data.reverse())
                    onClose()
                })
            } else {
                toast({
                    title: 'Sorry, an error has occurred',
                    description: 'Please try again',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
        })

    }

    // TODO: handle file attachments

    return (
        <Box id={`announcement-${id}`} width={{ base: '100%', lg: '80%' }} mt="24px" mx="auto" p="16px" borderRadius="8px" border="1px" borderColor="gray.300">
            <Heading size="md">{title}</Heading>
            <Divider my="16px" />
            <AuthorDetails author={author} date={post_date} />
            {/* <Text className={styles.description} dangerouslySetInnerHTML={{ __html: content }} mb="16px;" /> */}
            {!!editorState 
                ? 
                    <form id="editPost" onSubmit={handleSubmit}>
                        <Flex>
                            <InputGroup variant="filled" mr="8px" width="100%">
                                <DraftEditor content={editorState} setDetails={setDetails} /> 
                            </InputGroup>
                            <Button pr="8px" leftIcon={<AiOutlineSend />} form="editPost" type="submit" />
                        </Flex>
                    </form>
                :
                    <>
                        <Text className={styles.description} dangerouslySetInnerHTML={{ __html: details }} />
                        <Divider my="16px" />
                        <Flex justifyContent="space-between">
                            <Flex>
                                <Button pr="8px" leftIcon={<GrShare />} onClick={shareLink} />
                                <Button ml="8px" pr="8px" leftIcon={<GrEdit />} onClick={editPost} /> {/*  ONLY SHOW THIS IF USER IS AUTHOR OF POST */}
                                <Popover>
                                    {({ onClose }) => (
                                        <>
                                            <PopoverTrigger>
                                                <Button ml="8px" pr="8px" leftIcon={<BiTrash />} color="red" />
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <PopoverHeader fontWeight="semibold">Confirmation</PopoverHeader>
                                                <PopoverArrow />
                                                <PopoverCloseButton />
                                                <PopoverBody>
                                                    Are you sure you want to delete this post?
                                                </PopoverBody>
                                                <PopoverFooter d="flex" justifyContent="flex-end">
                                                    <ButtonGroup size="sm">
                                                    <Button variant="outline">Cancel</Button>
                                                    <Button colorScheme="red" onClick={() => handleDelete(onClose)}>Delete</Button>
                                                    </ButtonGroup>
                                                </PopoverFooter>
                                            </PopoverContent>
                                        </>
                                    )}
                                </Popover>
                            </Flex>
                        </Flex>
                    </>
            }
        </Box>
    )
}

export default Announcement