import React, { useState } from "react"
import {
    Button,
    Box,
    Flex,
    Heading,
    InputGroup,
} from "@chakra-ui/react"
import { AiOutlineSend } from 'react-icons/ai'
import CommentResponse from "../CommentResponse/CommentResponse"
import DraftEditor from '../DraftEditor/DraftEditor'
import styles from './CommentsResponses.module.css'

function CommentsResponses({ isComments, posts }) {
    const [details, setDetails] = useState('')

    const handleSubmit = e => {
        e.preventDefault()
        console.log(details)
    }

    return (
        <Box width={{ base: '100%', lg: '80%' }} mt="24px" mx="auto" p="16px" borderRadius="8px" border="1px" borderColor="gray.300">
            <Heading size="md" mb="12px" textTransform="uppercase">{isComments ? 'Comments' : 'Responses'}</Heading>
            {posts.map(post => (
                <CommentResponse {...post} />
            ))}
            <form id="createCommentResponse" onSubmit={handleSubmit}>
                <Flex>
                    <InputGroup variant="filled" mr="8px">
                        <DraftEditor setDetails={setDetails} className={styles.editor} />
                    </InputGroup>
                    <Button pr="8px" leftIcon={<AiOutlineSend />} form="createCommentResponse" type="submit" />
                </Flex>
            </form>
        </Box>
    )
}

export default CommentsResponses