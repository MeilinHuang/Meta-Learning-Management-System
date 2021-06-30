import React from "react"
import {
    Button,
    Box,
    Flex,
    Heading,
    Input,
    InputGroup,
} from "@chakra-ui/react"
import { AiOutlineSend } from 'react-icons/ai'
import CommentResponse from './CommentResponse'

function Comments() {
    return (
        <Box width={{ base: '100%', lg: '80%' }} mt="24px" mx="auto" p="16px" borderRadius="8px" border="1px" borderColor="gray.300">
            <Heading size="md" mb="12px" textTransform="uppercase">Comments</Heading>
            {/* if no response - "no comments yet" */}
            {/* maps comments */}
            <CommentResponse />
            <CommentResponse />
            <form>
                <Flex>
                    <InputGroup variant="filled" mr="8px">
                        <Input placeholder="Add comment"></Input>
                    </InputGroup>
                    <Button pr="8px" leftIcon={<AiOutlineSend />} type="submit" />
                </Flex>
            </form>
        </Box>
    )
}

export default Comments