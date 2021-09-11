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

function PostTableContainer({ pinnedPosts, posts, showPinned, code }) {
    // if isAdmin then show pin/unpin logo next to each post
    console.log('posttabelcontainer', posts)
    return (
        <Accordion allowMultiple defaultIndex={[0, 1]} mx="auto" width={{ base: '100%', lg: '80%' }} borderColor="white">
            {showPinned && <AccordionItem>
                <h2>
                <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                        Pinned
                    </Box>
                    <AccordionIcon />
                </AccordionButton> 
                </h2>
                <AccordionPanel pb={4} px={0} overflowX={{ base: 'scroll', md: 'initial' }}>
                    {/* <PostTable posts={pinnedPosts} code={code} /> */}
                </AccordionPanel>
            </AccordionItem>} 
            <AccordionItem>
                <h2>
                <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                        Posts
                    </Box>
                    <AccordionIcon />
                </AccordionButton> 
                </h2>
                <AccordionPanel pb={4} px={0} overflowX={{ base: 'scroll', md: 'initial' }}>
                    <PostTable posts={posts} code={code} />
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    )
}

export default PostTableContainer