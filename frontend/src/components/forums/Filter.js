import React, { useState } from "react"
import { 
    Box,
    Button,
    Flex,
    useDisclosure,
} from "@chakra-ui/react"
import TagSelect from './TagSelect/TagSelect'
import ManageTagsModal from "./ManageTagsModal"

function Filter() {
    const [tags, setTags] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure()
    
    // TODO: need to update the list of options in tagSelect when new tag added

    return (
        <Flex my="24px" mx="auto" pb="8px" width={{ base: '100%', lg: '80%' }} justifyContent="space-between">
            {/* 100% width if not admin */}
            <Box width="100%" mr="24px">
                <TagSelect isFilter setTags={setTags} />
            </Box>
            {/* Show if staff */}
            {/* <InputGroup width="20%">
                <form id="addTag" onSubmit={handleSubmit}>
                    <Input
                        pr="4.5rem"
                        type="text"
                        placeholder="Tag name"
                        onChange={e => setNewTag(e.target.value)}
                    />
                    <InputRightElement width="4.5rem" justifyContent="flex-end">
                        <IconButton aria-label="Add tag" type="submit" icon={<GrAdd />} borderRadius="0px 6px 6px 0px" />
                    </InputRightElement>
                </form>
            </InputGroup> */}
            <Button onClick={onOpen}>Manage Tags</Button>
            <ManageTagsModal isOpen={isOpen} onClose={onClose} />
        </Flex>

    )
}

export default Filter