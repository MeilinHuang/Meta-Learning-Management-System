import React from "react"
import {
    Divider,
    Text,
} from "@chakra-ui/react"
import AuthorControls from '../AuthorControls'
import AuthorDetails from '../AuthorDetails'
import styles from './CommentResponse.module.css'

function CommentResponse({ author, published_date, description }) {
    return (
        <>
            <AuthorDetails author={author} date={published_date} />
            <Text className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />
            {/* show author controls if user is author */}
            <AuthorControls />
            <Divider my="16px" />
        </>
    )
}

export default CommentResponse