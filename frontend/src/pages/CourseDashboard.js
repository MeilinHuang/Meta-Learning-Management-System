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
} from "@chakra-ui/react"
import { GrAdd } from 'react-icons/gr'
import { SearchIcon } from '@chakra-ui/icons'
import Announcement from '../components/dashboard/Announcement/Announcement'
import AddPostModal from '../components/forums/AddPostModal'

// DUMMY VALUES
const dummyAuthor = 3

function CourseDashboard({ match: { params: { code }}}) {
    const [announcements, setAnnouncements] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const buttonContents = useBreakpointValue({ base: '', md: 'Add Post' })
    const buttonIcon = useBreakpointValue({ base: <GrAdd />, md: null })
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        fetch(`http://localhost:8000/${code}/announcement`).then(r => r.json()).then(data => {
            const promises = []

            for (const post of data) {
                promises.push(fetch(`http://localhost:8000/user/${post.author}`).then(r => r.json()))
            }

            Promise.all(promises)
                .then(authorData => {
                    const newPosts = []
                    for (const i in authorData) {
                        const withAuthor = {...data[i], author: authorData[i].user_name}
                        newPosts.push(withAuthor)
                    }
                    setAnnouncements(newPosts.reverse())
                })
        })
    }, [code, setAnnouncements])

    const handleSubmit = e => {
        e.preventDefault()

        if (searchTerm === '') {
            fetch(`http://localhost:8000/${code}/announcement`).then(r => r.json()).then(data => {
                const promises = []

                for (const post of data) {
                    promises.push(fetch(`http://localhost:8000/user/${post.author}`).then(r => r.json()))
                }

                Promise.all(promises)
                    .then(authorData => {
                        const newPosts = []
                        for (const i in authorData) {
                            const withAuthor = {...data[i], author: authorData[i].user_name}
                            newPosts.push(withAuthor)
                        }
                        setAnnouncements(newPosts.reverse())
                    })
            })
            return
        }

        fetch(`http://localhost:8000/${code}/announcement/search/${searchTerm.toLowerCase()}`).then(r => r.json()).then(data => {
            const promises = []

                for (const post of data) {
                    promises.push(fetch(`http://localhost:8000/user/${post.author}`).then(r => r.json()))
                }

                Promise.all(promises)
                    .then(authorData => {
                        const newPosts = []
                        for (const i in authorData) {
                            const withAuthor = {...data[i], author: authorData[i].user_name}
                            newPosts.push(withAuthor)
                        }
                        setAnnouncements(newPosts.reverse())
                    })
        })
    }

    const handleAddPostSubmit = ({ title, details, date, images }) => {
        const formData = new FormData()

        formData.append('author', dummyAuthor)
        formData.append('uploadFile', images)
        formData.append('title', title)
        formData.append('content', details)
        formData.append('postDate', date
        )
        console.log([images])
        fetch(`http://localhost:8000/${code}/announcement/new`, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': '*/*',
                'Content-Type': 'multipart/form-data'
            }
        }).then(r => {
            if (r.status === 200) {
                fetch(`http://localhost:8000/${code}/announcement`).then(r => r.json()).then(data => setAnnouncements(data.reverse()))
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
            {announcements.map(announcement => <Announcement announcement={announcement} course={code} setAnnouncements={setAnnouncements} />)}
        </>
    )
}

export default CourseDashboard