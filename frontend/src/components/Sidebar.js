import React from "react"
import { Stack, Container, Text, StackDivider } from "@chakra-ui/react"
//import {} from '@chakra-ui/icons'

function Sidebar({links}) {
    return (
        <Stack divider={<StackDivider borderColor="gray.200"></StackDivider>} spacing={4}>
            {links.map(e => {
                return (
                    <Container>
                        <Text>{e}</Text>
                    </Container>
                )
            })}
        </Stack>
    )
}

export default Sidebar