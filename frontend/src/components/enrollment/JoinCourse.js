import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import {
  Flex,
  Box,
  Input,
  Heading,
  Button,
  FormControl,
  FormLabel
} from "@chakra-ui/react"

export default function CourseInvite() {
  let { code } = useParams() 
  const [invite, setInvite] = useState(code)
  const history = useHistory()

  console.log(invite)

  useEffect(() => {
    if (sessionStorage.getItem('token') === null) {
      history.push('/login')
    }
  }, [])

  //check login by session storage
  return (
    <Flex width="Full" align="center" justifyContent="center">
      <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
        <Box textAlign="center">
          <Heading>Join a course with an invite code!</Heading>
        </Box>
        <Box my={4} textAlign="left">
          <FormControl isRequired>
            <FormLabel>Invite Code</FormLabel>
            <Input type="text"
              defaultValue={code}
              placeholder="Enter a course invite code"
              size="lg"
              onChange = {(e) => setInvite(e.currentTarget.value)}
            />
          </FormControl>
          <Button variant="outline" width="full" mt={4} type="submit" onClick={(e) => {
            e.preventDefault()
          }}>
            Join Course!
          </Button>
        </Box>
      </Box>
    </Flex>
  )
}