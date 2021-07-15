import React from "react"
import {
    Button,
    Box,
    Divider,
    Flex,
} from "@chakra-ui/react"
import { GrEdit, GrShare } from 'react-icons/gr'
import AuthorDetails from './AuthorDetails'

function PostDetails() {
    return (
        <Box width={{ base: '100%', lg: '80%' }} mt="24px" mx="auto" p="16px" borderRadius="8px" border="1px" borderColor="gray.300">
            <AuthorDetails />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
            <Divider my="16px" />
            <Flex justifyContent="space-between">
                <Flex>
                    <Button pr="8px" leftIcon={<GrShare />} />
                    <Button ml="8px" pr="8px" leftIcon={<GrEdit />} /> {/*  ONLY SHOW THIS IF USER IS AUTHOR OF POST */}
                </Flex>
            </Flex>
        </Box>
    )
}

export default PostDetails