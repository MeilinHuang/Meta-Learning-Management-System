import React, { useState } from "react"
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
} from "@chakra-ui/react"
import AuthorDetails from '../AuthorDetails'
import { AiOutlineSend } from "react-icons/ai"
import { ContentState, convertFromHTML } from 'draft-js'
import DraftEditor from '../DraftEditor/DraftEditor'
import styles from './CommentResponse.module.css'

function CommentResponse({ author, published_date, description }) {
    const [ editorState, setEditorState ] = useState('')
    const [ details, setDetails ] = useState(description)

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
        <>
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
                        {/* show author controls if user is author */}
                        <Flex mt="8px" justifyContent="flex-end">
                            <Link onClick={editPost}>Edit</Link>
                            <Popover>
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
                                        <Button colorScheme="red">Delete</Button>
                                        </ButtonGroup>
                                    </PopoverFooter>
                                </PopoverContent>
                            </Popover>
                        </Flex>
                    </>
            }
            
            <Divider my="16px" />
        </>
    )
}

export default CommentResponse