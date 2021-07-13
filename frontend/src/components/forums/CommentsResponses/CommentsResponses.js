import React, { useEffect, useState } from "react"
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

const dummyAuthor = 'David Nguyen'

function CommentsResponses({ isComments, posts, post_id }) {
    const [details, setDetails] = useState('')
    
    console.log(posts)

    const handleSubmit = e => {
        e.preventDefault()
        const date = new Date(Date.now()).toISOString()

        const body = isComments ? 
            {
                author: dummyAuthor, // TODO: update to user_id if changed in backend
                published_date: date,
                comment: details,
            } : {
                author: dummyAuthor, // TODO: update to user_id if changed in backend
                published_date: date,
                reply: details,
            }

        fetch(`http://localhost:8000/forum/post/${post_id}/${isComments ? 'comment' : 'reply'}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(r => {
            console.log(r)
            if (r.status === 200) {
                window.location.reload()
            } 
            // TODO: Handle error case
        })
    }

    return (
        <Box width={{ base: '100%', lg: '80%' }} mt="24px" mx="auto" p="16px" borderRadius="8px" border="1px" borderColor="gray.300">
            <Heading size="md" mb="12px" textTransform="uppercase">{isComments ? 'Comments' : 'Responses'}</Heading>
            {posts && posts[0] !== null && posts.map(post => (
                <CommentResponse {...post} post_id={post_id} />
            ))}
            <form id={`create${isComments ? 'Comment' : 'Response'}`} onSubmit={handleSubmit}>
                <Flex>
                    <InputGroup variant="filled" mr="8px">
                        <DraftEditor setDetails={setDetails} className={styles.editor} />
                    </InputGroup>
                    <Button pr="8px" leftIcon={<AiOutlineSend />} form={`create${isComments ? 'Comment' : 'Response'}`} type="submit" />
                </Flex>
            </form>
        </Box>
    )
}

export default CommentsResponses