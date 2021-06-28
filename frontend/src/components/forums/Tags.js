import React from "react"
import {
    Flex,
    Tag,
} from "@chakra-ui/react"

function Tags({ tags }) {
    return (
        <Flex>
            {tags.map(tag => (
                <Tag key={tag} my="8px" mx="4px" px="12px" borderRadius="full" variant="outline">{tag}</Tag>
            ))}
        </Flex>
    )
}

export default Tags