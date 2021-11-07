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
import TutorialTableContainer from '../components/lecturesTutorials/TutorialTableContainer';
import { backend_url } from "../Constants";

function TutorialsPage ({ match: { params: { code }}}) {
  const [tutorials, setTutorials] = useState()
  const [searchFiles, setSearchFiles] = useState();
  const [searchTerm, setSearchTerm] = useState('');

  const handleTutorialState = (data) => {
    setTutorials(data);
  };

  // Load lectures list
  useEffect(() => {
    fetch(`${backend_url}${code}/tutorials`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        setTutorials(data);
      });
  }, [setTutorials, code]);

  // Filter lectures by number/file/week
  const handleSubmit = (e) => {
    e.preventDefault();

    if (searchTerm === "") {
      fetch(`${backend_url}${code}/tutorials`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((r) => r.json())
        .then((data) => {
          setTutorials(data);
          setSearchFiles(null);
        });
    } else {
      fetch(
        `${backend_url}${code}/tutorials/search/${searchTerm.toLowerCase()}`,
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
          setTutorials(null);
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
                        <Input 
                          placeholder="Search" 
                          onChange={e => 
                            {
                              setSearchTerm(e.target.value);
                            }
                          }
                        />
                    </InputGroup>
                </Box>
            </Center>
        </Flex>
        <TutorialTableContainer 
          tutorials={tutorials}
          handleTutorialState={handleTutorialState} 
          searchFiles={searchFiles} 
          code={code} 
        /> 
    </>
  );
}

export default TutorialsPage;