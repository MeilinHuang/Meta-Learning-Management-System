import React, { useEffect, useState } from "react"
import {
    Button,
    Box,
    Divider,
    Flex,
    Icon,
    InputGroup,
    Text,
    useToast,
} from "@chakra-ui/react"
import { GrEdit, GrShare } from 'react-icons/gr'
import { AiOutlineClose, AiOutlineSend } from "react-icons/ai"
import { FaRegCheckCircle, FaCheckCircle } from 'react-icons/fa'
import { TiArrowUpOutline, TiArrowUpThick } from 'react-icons/ti'
import { ContentState, convertFromHTML } from 'draft-js'
import AuthorDetails from '../AuthorDetails'
import DraftEditor from '../DraftEditor/DraftEditor'
import styles from './PostDetails.module.css'

function PostDetails({ post: { attachments, author, post_id, published_date, description, isendorsed, num_of_upvotes, upvoters }, setPost}) {
    const [ editorState, setEditorState ] = useState('')
    const [ details, setDetails ] = useState()
    const toast = useToast()

    useEffect(() => {
        setDetails(description)
    }, [description])

    const shareLink = () => {
        const link = window.location.href
        navigator.clipboard.writeText(link)
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
            `http://localhost:8000/forum/post/${post_id}`,
            {
                method: 'PUT',
                body: JSON.stringify({
                    description: details,
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }
        ).then(r => {
            if (r.status === 200) {
                fetch(`http://localhost:8000/forum/post/${post_id}`).then(r => r.json()).then(data => setPost(data))
            }
        }) // TODO: handle errors
        setEditorState('')
    }

    const handleEndorse = () => {
        fetch(
            `http://localhost:8000/forum/post/endorse/${post_id}/${!isendorsed}`, { method: 'PUT' }
        ).then(r => {
            if (r.status === 200) {
                fetch(`http://localhost:8000/forum/post/${post_id}`).then(r => r.json()).then(data => setPost(data))
            }
            // TODO: handle errors
        })
    }

    const getImage = ({ id, name, file }) => (
        <img className={styles.attachment} key={id} alt={name} src={file} />
    )

    return (
        <Box width={{ base: '100%', lg: '80%' }} mt="24px" mx="auto" p="16px" borderRadius="8px" border="1px" borderColor="gray.300">
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
                        {!!attachments && !!attachments.length && attachments.map(image => getImage(image))}
                        {isendorsed && (
                            <Flex alignItems="center" mt="16px">
                                <Icon h="13px" w="13px" mr="4px" color="green" as={FaCheckCircle} />
                                <Text fontSize="13px" color="green" fontWeight="bold">This post is endorsed by staff</Text>
                            </Flex>
                        )}
                        <Divider my="16px" />
                        <Flex justifyContent="space-between">
                            <Flex>
                                <Button leftIcon={<TiArrowUpOutline />}>{num_of_upvotes}</Button>
                                <Button pr="8px" ml="8px" leftIcon={isendorsed ? <FaCheckCircle /> : <FaRegCheckCircle />} onClick={handleEndorse} /> {/* ONLY SHOW IF USER IS STAFF */}
                                <Button pr="8px" leftIcon={<GrShare />} onClick={shareLink} ml="8px" />
                            </Flex>
                            <Flex>
                                <Button ml="8px" pr="8px" leftIcon={<GrEdit />} onClick={editPost} /> {/*  ONLY SHOW THIS IF USER IS AUTHOR OF POST */}
                            </Flex>
                        </Flex>
                    </>
            }
        </Box>
    )
}

export default PostDetails