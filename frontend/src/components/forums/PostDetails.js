import React from "react"
import {
    Button,
    Box,
    Divider,
    Flex,
} from "@chakra-ui/react"
import { GrEdit, GrShare } from 'react-icons/gr'
import AuthorDetails from './AuthorDetails'

function PostDetails({ post: { author, published_date, description }}) {
    return (
        <Box width={{ base: '100%', lg: '80%' }} mt="24px" mx="auto" p="16px" borderRadius="8px" border="1px" borderColor="gray.300">
            <AuthorDetails author={author} date={published_date} />
            {description}
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