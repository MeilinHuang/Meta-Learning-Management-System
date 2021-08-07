import React from "react"
import {
    Flex,
    Heading,
    Text,
} from "@chakra-ui/react"

function AuthorDetails({ author, date }) {
    const dateString = new Date(date).toLocaleString('en-AU')

    return (
        <Flex alignItems={{ base: 'unset', md: 'center' }} justifyContent="space-between" flexDirection={{ base: 'column', md: 'row' }} mb="8px">
            <Heading size="sm">{author}</Heading>
            <Text fontSize="13px">{dateString}</Text>
        </Flex>
    )
}

export default AuthorDetails
