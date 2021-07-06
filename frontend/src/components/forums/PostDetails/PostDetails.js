import React, { useState } from "react"
import {
    Button,
    Box,
    Divider,
    Flex,
    InputGroup,
    Text,
    useToast,
} from "@chakra-ui/react"
import { GrEdit, GrShare } from 'react-icons/gr'
import { AiOutlineSend } from "react-icons/ai"
import { ContentState, convertFromHTML } from 'draft-js'
import AuthorDetails from '../AuthorDetails'
import DraftEditor from '../DraftEditor/DraftEditor'
import styles from './PostDetails.module.css'

function PostDetails({ post: { author, published_date, description }}) {
    const [ editorState, setEditorState ] = useState('')
    const [ details, setDetails ] = useState(description)
    const toast = useToast()

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
        setEditorState('')
    }

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
                            </Flex>
                        </Flex>
                    </>
            }
        </Box>
    )
}

export default PostDetails