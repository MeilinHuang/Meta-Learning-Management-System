import React, { useEffect, useState } from "react"
import { 
    Box,
    Button,
    Center,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    useBreakpointValue,
    useDisclosure,
    useToast,
} from "@chakra-ui/react"
import { GrAdd } from 'react-icons/gr'
import { SearchIcon } from '@chakra-ui/icons'
import Announcement from '../components/dashboard/Announcement/Announcement'
import AddPostModal from '../components/forums/AddPostModal'

// DUMMY VALUES
const dummyCourse = "C++ Programming"
const dummyAuthor = 3

function CourseDashboard() {
    const [announcements, setAnnouncements] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const buttonContents = useBreakpointValue({ base: '', md: 'Add Post' })
    const buttonIcon = useBreakpointValue({ base: <GrAdd />, md: null })
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    useEffect(() => {
        fetch(`http://localhost:8000/${dummyCourse}/announcement`).then(r => r.json()).then(data => setAnnouncements(data.reverse()))
    }, [setAnnouncements])

    console.log(announcements)

    const handleSubmit = e => {
        e.preventDefault()

        console.log(searchTerm)
    }

    const handleAddPostSubmit = ({ title, details, date }) => {
        console.log(JSON.stringify({
            author: dummyAuthor,
            attachments: [],
            title,
            content: details,
            postDate: date,
        }))
        fetch(`http://localhost:8000/${dummyCourse}/announcement/new`, {
            method: 'POST',
            body: JSON.stringify({
                author: dummyAuthor,
                attachments: [],
                title,
                content: details,
                postDate: date,
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(r => {
            if (r.status === 200) {
                toast({
                    title: 'Post created',
                    description: 'Refresh the page to view announcement',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            } 
            // TODO: Handle error case
        })
    }

    return (
        <>
            <Flex justify="center">
                <Center width={{ base: '100%', lg: '80%' }}>
                    {/* Only show for admin/staff */}
                    <Button onClick={onOpen} leftIcon={buttonIcon} pr={{ base: '8px', md: '16px' }}>{buttonContents}</Button>
                    <AddPostModal isOpen={isOpen} onClose={onClose} onSubmit={handleAddPostSubmit} />
                    <Box as="form" onSubmit={handleSubmit} width="100%" ml={{ base: '16px', md: '24px'}}>
                        <InputGroup variant="outline">
                            <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />}/>
                            <Input placeholder="Search" onChange={e => setSearchTerm(e.target.value)}></Input>
                        </InputGroup>
                    </Box>
                </Center>
            </Flex>
            {announcements.map(announcement => <Announcement announcement={announcement} />)}
        </>
    )
}

export default CourseDashboard