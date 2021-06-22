import React from "react"
import { Link as RouterLink } from 'react-router-dom'
import {
    Link,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
  } from "@chakra-ui/react"

const getRow = post => {
    return (
        <Tr>
            <Td width="40%"><Link as={RouterLink} color="blue.500" to={`/forums/${post.id}`}>inches</Link></Td>
            <Td>millimetres (mm)</Td>
            <Td isNumeric>25.4</Td>
            <Td isNumeric>25.4</Td>
        </Tr>
    )
}

function PostTable({ isAdmin, posts }) {
    // if isAdmin then show pin/unpin logo next to each post
    return (
        <Table variant="simple">
            <Thead>
                    <Tr>
                    <Th>Post</Th>
                    <Th>Date created</Th>
                    <Th isNumeric>Replies</Th>
                    <Th isNumeric>Comments</Th>
                </Tr>
            </Thead>
            <Tbody>
                {posts.map(post => getRow(post))}
            </Tbody>
        </Table>
    )
}

export default PostTable