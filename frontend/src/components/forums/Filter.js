import React from "react"
import { 
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
} from "@chakra-ui/react"

function Filter() {
    return (
        <Accordion allowToggle my="24px" mx="auto" width={{ base: '100%', md: '70%' }}>
            <AccordionItem>
                <h2>
                <AccordionButton>
                    <Box flex="1" textAlign="left">
                    Filter
                    </Box>
                    <AccordionIcon />
                </AccordionButton> 
                </h2>
                <AccordionPanel pb={4}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    )
}

export default Filter