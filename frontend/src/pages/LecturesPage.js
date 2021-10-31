import React, { useEffect, useState } from 'react';
import { 
  Box,
  Center,
  Flex,
  Input,
  InputGroup,
  InputLeftElement
} from "@chakra-ui/react";

import { SearchIcon } from '@chakra-ui/icons'
import LectureTableContainer from '../components/lecturesTutorials/LectureTableContainer';
import { backend_url } from "../Constants";

function LecturesPage ({ match: { params: { code }}}) {
  const [lectures, setLectures] = useState()
  const [searchFiles, setSearchFiles] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  
  // const [isEdit, setEdit] = useState(false);

  const handleLectureState = (data) => {
    setLectures(data);
  };

  // Load lectures list
  useEffect(() => {
    fetch(`${backend_url}${code}/lectures`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        setLectures(data);
      });
  }, [setLectures, code]);

  // Filter lectures by number/file/week
  const handleSubmit = (e) => {
    e.preventDefault();

    if (searchTerm === "") {
      fetch(`${backend_url}${code}/lectures`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((r) => r.json())
        .then((data) => {
          setLectures(data);
          setSearchFiles(null);
        });
    } else {
      fetch(
        `${backend_url}${code}/lectures/search/${searchTerm.toLowerCase()}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((r) => r.json())
        .then((data) => {
          setSearchFiles(data);
          setLectures(null);
        });
    }
  };

  return (
    <>
        <Flex justify="center">
            <Center width={{ base: '100%', lg: '83%' }}>
                <Box as="form" onSubmit={handleSubmit} width="100%" ml={{ base: '16px', md: '24px'}} paddingRight="2%">
                    <InputGroup variant="outline">
                        <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />}/>
                        <Input placeholder="Search" onChange={e => setSearchTerm(e.target.value)}></Input>
                    </InputGroup>
                </Box>
            </Center>
        </Flex>
        <LectureTableContainer 
          lectures={lectures}
          handleLectureState={handleLectureState} 
          isLectures 
          searchFiles={searchFiles} 
          code={code} 
        /> 
    </>
  );
}

export default LecturesPage;