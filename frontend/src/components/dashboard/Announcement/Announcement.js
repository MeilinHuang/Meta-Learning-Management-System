import React from "react"
import { Link as RouterLink } from 'react-router-dom'
import {
    Box,
    Divider,
    Heading,
    Link,
    Text,
} from "@chakra-ui/react"
import styles from './Announcement.module.css'
import AuthorDetails from '../../forums/AuthorDetails'

function Announcement({ announcement: { author, id, title, content, post_date } }) {
    // TODO: handle file attachments

    return (
        <Box width={{ base: '100%', lg: '80%' }} mt="24px" mx="auto" p="16px" borderRadius="8px" border="1px" borderColor="gray.300">
            <Heading size="md"><Link as={RouterLink} _hover={{ color: "blue.500" }} to={`/announcement/${id}`}>{title}</Link></Heading>
            <Divider my="16px" />
            <Text className={styles.description} dangerouslySetInnerHTML={{ __html: content }} mb="16px;" />
            <AuthorDetails author={author} date={post_date} />
        </Box>
    )
}

export default Announcement