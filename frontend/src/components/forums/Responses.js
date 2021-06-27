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
import AuthorControls from './AuthorControls'
import AuthorDetails from './AuthorDetails'

function Responses() {
    return (
        <Box width={{ base: '100%', lg: '80%' }} mt="24px" mx="auto" p="16px" borderRadius="8px" border="1px" borderColor="gray.300">
            <Heading size="md" mb="12px" textTransform="uppercase">Responses</Heading>
            <AuthorDetails />
            {/* if no response - "no response yet" */}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
            <AuthorControls />
            {/* if no response and user is staff */}
            <Divider my="16px" />
            <form>
                <Flex>
                    <InputGroup variant="filled" mr="8px">
                        <Input placeholder="Add response"></Input>
                    </InputGroup>
                    <Button pr="8px" leftIcon={<AiOutlineSend />} type="submit" />
                </Flex>
            </form>
            {/* Show if there's a response and user is staff
                <Flex>
                    <Button ml="8px" pr="8px" leftIcon={<GrEdit />} />
                </Flex>
                <Flex alignItems="center">
                    <Text h="24px">Author and Date</Text>
                </Flex>
            */}
        </Box>
    )
}

export default Responses