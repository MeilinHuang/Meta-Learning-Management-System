import React from "react"
import {
    Divider,
} from "@chakra-ui/react"
import AuthorControls from './AuthorControls'
import AuthorDetails from './AuthorDetails'

function Responses() {
    return (
        <>
            <AuthorDetails />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
            <AuthorControls />
            <Divider my="16px" />
        </>
    )
}

export default Responses