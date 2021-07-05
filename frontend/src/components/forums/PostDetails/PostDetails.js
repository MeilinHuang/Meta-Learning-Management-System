import React from "react"
import {
    Button,
    Box,
    Divider,
    Flex,
    Text,
    useToast,
} from "@chakra-ui/react"
import { GrEdit, GrShare } from 'react-icons/gr'
import AuthorDetails from '../AuthorDetails'
import styles from './PostDetails.module.css'

function PostDetails({ post: { author, published_date, description }}) {
    const toast = useToast()

    const shareLink = () => {
        const link = window.location.href
        navigator.clipboard.writeText(link)
        toast({
            title: 'Copied link',
            status: 'success',
            duration: 3000,
            isClosable: true,
        })
    }

    return (
        <Box width={{ base: '100%', lg: '80%' }} mt="24px" mx="auto" p="16px" borderRadius="8px" border="1px" borderColor="gray.300">
            <AuthorDetails author={author} date={published_date} />
            <Text className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />
            <Divider my="16px" />
            <Flex justifyContent="space-between">
                <Flex>
                    <Button pr="8px" leftIcon={<GrShare />} onClick={shareLink} />
                    <Button ml="8px" pr="8px" leftIcon={<GrEdit />} /> {/*  ONLY SHOW THIS IF USER IS AUTHOR OF POST */}
                </Flex>
            </Flex>
        </Box>
    )
}

export default PostDetails