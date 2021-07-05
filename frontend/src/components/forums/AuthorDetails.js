import React from "react"
import {
    Flex,
    Heading,
    Text,
} from "@chakra-ui/react"

function AuthorDetails() {
    return (
        <Flex alignItems={{ base: 'unset', md: 'center' }} justifyContent="space-between" flexDirection={{ base: 'column', md: 'row' }} mb="8px">
            <Heading size="sm">Author</Heading>
            <Text>Date</Text>
        </Flex>
    )
}

export default AuthorDetails