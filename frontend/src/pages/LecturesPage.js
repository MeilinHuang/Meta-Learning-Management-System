import React, { useEffect, useState } from 'react';
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
} from "@chakra-ui/react";

import { SearchIcon } from '@chakra-ui/icons'
import LectureTableContainer from '../components/lecturesTutorials/LectureTableContainer'
import AddLectureModal from '../components/lecturesTutorials/AddLectureModal'
import DeleteLectureModal from '../components/lecturesTutorials/DeleteLectureModal'
import { GrAdd } from 'react-icons/gr'

function LecturesPage ({ match: { params: { code }}}) {
  const [lectures, setLectures] = useState()
  const [searchFiles, setSearchFiles] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const buttonContents = useBreakpointValue({ base: "", md: "Add" });
  const deleteButton = useBreakpointValue({ base: "", md: "Delete" });
  const buttonIcon = useBreakpointValue({ base: <GrAdd />, md: null });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose} = useDisclosure();


  // Load lectures list
  useEffect(() => {
    fetch(`http://localhost:8000/${code}/lectures`, {
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
      fetch(`http://localhost:8000/${code}/lectures`, {
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
        `http://localhost:8000/${code}/lecture/search/${searchTerm.toLowerCase()}`,
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

  const renderLectures = () => {
    fetch(`http://localhost:8000/${code}/lectures`, {
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
  }

  // Post lectur
  const handleAddLectureSubmit = (formData) => {
    // Post lecture
    fetch(`http://localhost:8000/${code}/lecture`, {
      method: "POST",
      body: formData[0],
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(r => r.json())
    .then(data => {

      // Upload files 
      fetch(`http://localhost:8000/lecture/file/${data.lectureId}`, {
      method: "POST",
      body: formData[1],
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      })
    }).then(
      renderLectures()
    )
  };
  
  // Deletes lecture
  const handleDeleteLectureSubmit = () => {
    fetch(`http://localhost:8000/${code}/lectures`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((r) => r.json())
      .then((data) => 
      setLectures(data)
    );
  }

  return (
    <>
        <Flex justify="center">
            <Center width={{ base: '100%', lg: '80%' }}>
                <Box as="form" onSubmit={handleSubmit} width="100%" ml={{ base: '16px', md: '24px'}} paddingRight="2%" marginLeft="10%">
                    <InputGroup variant="outline">
                        <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />}/>
                        <Input placeholder="Search" onChange={e => setSearchTerm(e.target.value)}></Input>
                    </InputGroup>
                </Box>
                <Button onClick={onOpen} leftIcon={buttonIcon} pr={{ base: '8px', md: '16px'}} width="auto">{buttonContents}</Button>
                <AddLectureModal isOpen={isOpen} onClose={onClose} isLectures onSubmit={handleAddLectureSubmit} code={code} /> 
                <DeleteLectureModal isOpen={isDeleteOpen} onClose={onDeleteClose} isLectures onSubmit={handleDeleteLectureSubmit} code={code} />
                <Button onClick={onDeleteOpen} leftIcon={buttonIcon} pr={{ base: '8px', md: '16px' }} width="auto" marginLeft="1.5%">{deleteButton}</Button>
            </Center>
        </Flex>
        <LectureTableContainer lectures={lectures} isLectures searchFiles={searchFiles} code={code} /> 
    </>
  );
}

export default LecturesPage;