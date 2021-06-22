import React from "react"
import { 
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
} from "@chakra-ui/react"
import PostTable from './PostTable'

function PostTableContainer(props) {
    // if isAdmin then show pin/unpin logo next to each post
    return (
        <Accordion allowMultiple mx="auto" width={{ base: '100%', md: '70%' }} borderColor="white">
            {/* 2.2.2 - Pinned posts are shown at the top of the forum overview page
                <AccordionItem>
                    <h2>
                    <AccordionButton>
                        <Box flex="1" textAlign="left">
                        Pinned
                        </Box>
                        <AccordionIcon />
                    </AccordionButton> 
                    </h2>
                    <AccordionPanel pb={4}>
                        <PostTable {...props} />
                    </AccordionPanel>
                </AccordionItem> 
            */}
            <AccordionItem>
                <h2>
                <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                        Posts
                    </Box>
                    <AccordionIcon />
                </AccordionButton> 
                </h2>
                <AccordionPanel pb={4} px={0}>
                    <PostTable {...props} />
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    )
}

export default PostTableContainer