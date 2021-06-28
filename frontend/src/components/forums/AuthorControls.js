import React from "react"
import {
    Flex,
    Link,
    Text,
} from "@chakra-ui/react"

function AuthorControls() {
    return (
        <Flex mt="8px">
            <Link>Edit</Link>
            <Link color="red" ml="8px">Delete</Link>
        </Flex>
    )
}

export default AuthorControls