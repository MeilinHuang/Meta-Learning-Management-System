import React from "react"
import {
    Divider,
    Flex,
    Heading,
    Link,
    Text,
} from "@chakra-ui/react"

function Responses() {
    return (
        <>
            <Flex justifyContent="space-between">
                <Heading size="sm">Author</Heading>
                <Flex>
                    <Text>Date</Text>
                    {/* Show if user is author */}
                    <Text mx="4px">•</Text>
                    <Link>Edit</Link>
                    <Text mx="4px">•</Text>
                    <Link color="red">Delete</Link>
                </Flex>
            </Flex>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
            <Divider my="16px" />
        </>
    )
}

export default Responses