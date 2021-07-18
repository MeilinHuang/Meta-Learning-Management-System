import React, { useEffect, useState } from "react"
import {
    Button,
    ButtonGroup,
    Divider,
    Flex,
    InputGroup,
    Link,
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
import AuthorDetails from '../AuthorDetails'
import { AiOutlineClose, AiOutlineSend } from "react-icons/ai"
import { ContentState, convertFromHTML } from 'draft-js'
import DraftEditor from '../DraftEditor/DraftEditor'
import styles from './CommentResponse.module.css'

function CommentResponse({ author, comment, comment_id, post_id, published_date, reply, reply_id, setPost }) {
    const [ editorState, setEditorState ] = useState('')
    const [ details, setDetails ] = useState('')
    const toast = useToast()

    useEffect(() => {
        setDetails(comment || reply)
    }, [comment, reply])

    const editPost = () => {
        const markup = convertFromHTML(details)
        const state = ContentState.createFromBlockArray(markup)
        setEditorState(state)
    }

    const handleSubmit = e => {
        e.preventDefault()
        const isComments = !!comment && !reply

        if (isComments) {
            fetch(
                `http://localhost:8000/forum/post/${post_id}/comment/${comment_id}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        comment: details,
                    }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }
            ).then(r => {
                if (r.status === 200) {
                    setEditorState('')
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
        } else {
            fetch(
                `http://localhost:8000/forum/post/${post_id}/reply/${reply_id}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        reply: details,
                    }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }
            ).then(r => {
                if (r.status === 200) {
                    setEditorState('')
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
    }

    const handleDelete = onClose => {
        const isComments = !!comment && !reply
        if (isComments) {
            fetch(
                `http://localhost:8000/forum/post/${post_id}/comment/${comment_id}`, { method: 'DELETE' }
            ).then(r => {
                if (r.status === 200) {
                    fetch(`http://localhost:8000/forum/post/${post_id}`).then(r => r.json()).then(data => {
                        setPost(data[0])
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
        } else {
            fetch(
                `http://localhost:8000/forum/post/${post_id}/reply/${reply_id}`, { method: 'DELETE' }
            ).then(r => {
                if (r.status === 200) {
                    fetch(`http://localhost:8000/forum/post/${post_id}`).then(r => r.json()).then(data => {
                        setPost(data[0])
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
    }

    return (
        <>
            <AuthorDetails author={author} date={published_date} />
            {!!editorState
                ?
                    <form id="editPost" onSubmit={handleSubmit}>
                        <Flex>
                            <InputGroup variant="filled" mr="8px" width="100%">
                                <DraftEditor content={editorState} setDetails={setDetails} /> 
                            </InputGroup>
                            <Flex flexDirection="column" justifyContent="space-between">
                                <Button pr="8px" leftIcon={<AiOutlineClose />} onClick={() => setEditorState('')} />
                                <Button pr="8px" mb="16px" height="160px" leftIcon={<AiOutlineSend />} form="editPost" type="submit" />
                            </Flex>
                        </Flex>
                    </form>
                :
                    <>
                        <Text className={styles.description} dangerouslySetInnerHTML={{ __html: details }} />
                        {/* show author controls if user is author */}
                        <Flex mt="8px" justifyContent="flex-end">
                            <Link onClick={editPost}>Edit</Link>
                            <Popover>
                                {({ onClose }) => (
                                    <>
                                        <PopoverTrigger>
                                            <Link color="red" ml="8px">Delete</Link>
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
                    </>
            }
            
            <Divider my="16px" />
        </>
    )
}

export default CommentResponse