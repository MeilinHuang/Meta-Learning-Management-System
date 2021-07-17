import React from "react"
import {
    Flex,
    Tag,
} from "@chakra-ui/react"

function Tags({ tags }) {
    return (
        <Flex>
            {tags && tags[0] !== null && tags.map(({ id, name }) => (
                <Tag key={id} my="8px" mx="4px" px="12px" borderRadius="full" variant="outline">{name}</Tag>
            ))}
        </Flex>
    )
}

export default Tags