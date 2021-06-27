import React from "react"
import {
    Button,
    Box,
    Divider,
    Flex,
    Heading,
    Input,
    InputGroup,
} from "@chakra-ui/react"
import { AiOutlineSend } from 'react-icons/ai'
import CommentResponse from "./CommentResponse"

function Responses({ replies }) {
    return (
        <Box width={{ base: '100%', lg: '80%' }} mt="24px" mx="auto" p="16px" borderRadius="8px" border="1px" borderColor="gray.300">
            <Heading size="md" mb="12px" textTransform="uppercase">Responses</Heading>
            {replies.map(reply => (
                <CommentResponse {...reply} />
            ))}
            <form>
                <Flex>
                    <InputGroup variant="filled" mr="8px">
                        <Input placeholder="Add response"></Input>
                    </InputGroup>
                    <Button pr="8px" leftIcon={<AiOutlineSend />} type="submit" />
                </Flex>
            </form>
        </Box>
    )
}

export default Responses