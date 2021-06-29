import React from "react"
import {
    Flex,
    Link,
} from "@chakra-ui/react"

function AuthorControls() {
    return (
        <Flex mt="8px" justifyContent="flex-end">
            <Link>Edit</Link>
            <Link color="red" ml="8px">Delete</Link>
        </Flex>
    )
}

export default AuthorControls