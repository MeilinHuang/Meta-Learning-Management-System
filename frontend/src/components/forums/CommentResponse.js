import React from "react"
import {
    Divider,
} from "@chakra-ui/react"
import AuthorControls from './AuthorControls'
import AuthorDetails from './AuthorDetails'

function CommentResponse({ author, published_date, description }) {
    return (
        <>
            <AuthorDetails author={author} date={published_date} />
            {description}
            {/* show author controls if user is author */}
            <AuthorControls />
            <Divider my="16px" />
        </>
    )
}

export default CommentResponse