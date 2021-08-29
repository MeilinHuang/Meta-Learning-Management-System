import React, { useEffect, useState } from "react"
import {
    Button,
    ButtonGroup,
    Divider,
    Flex,
    Icon,
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
import { FaRegCheckCircle, FaCheckCircle } from 'react-icons/fa'
import { BsTrash } from 'react-icons/bs'
import { GrEdit } from 'react-icons/gr'
import DraftEditor from '../DraftEditor/DraftEditor'
import styles from './CommentResponse.module.css'

function CommentResponse({ author, comment, comment_id, post_id, published_date, reply, reply_id, setPost, isendorsed }) {
    const [ editorState, setEditorState ] = useState('')
    const [ details, setDetails ] = useState('')
    const toast = useToast()
    console.log(isendorsed)

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
                        setPost(data)
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
                        setPost(data)
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

    const handleEndorse = () => {
        fetch(
            `http://localhost:8000/forum/post/${post_id}/comment/${comment_id}/endorse/${!isendorsed}`, { method: 'PUT' }
        ).then(r => {
            if (r.status === 200) {
                fetch(`http://localhost:8000/forum/post/${post_id}`).then(r => r.json()).then(data => setPost(data))
            }
            // TODO: handle errors
        })
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
                        <Flex justifyContent={isendorsed ? "space-between" : 'flex-end'}>
                            {isendorsed && (
                                <Flex alignItems="center" mt="16px">
                                    <Icon h="13px" w="13px" mr="4px" color="green" as={FaCheckCircle} />
                                    <Text fontSize="13px" color="green" fontWeight="bold">This comment is endorsed by staff</Text>
                                </Flex>
                            )}
                            {/* show author controls if user is author */}
                            <Flex mt="8px" justifyContent="flex-end">
                                {!!comment_id && <Button pr="8px" ml="8px" leftIcon={isendorsed ? <FaCheckCircle /> : <FaRegCheckCircle />} onClick={handleEndorse} />}
                                <Button ml="8px" pr="8px" leftIcon={<GrEdit />} onClick={editPost} /> {/*  ONLY SHOW THIS IF USER IS AUTHOR OF POST */}
                                <Popover placement="bottom-end">
                                    {({ onClose }) => (
                                        <>
                                            <PopoverTrigger>
                                                <Button pr="8px" leftIcon={<BsTrash />} ml="8px" color="red" />
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
            
            <Divider my="16px" />
        </>
    )
}

export default CommentResponse