/* eslint-disable eqeqeq */
import React from "react";
import { 
  Link,
  AccordionItem,
  Flex,
  Button,
  Center,
  useBreakpointValue,
  useDisclosure,
  Box,
  IconButton
} from "@chakra-ui/react";
import { DownloadIcon, AddIcon, DeleteIcon } from '@chakra-ui/icons'

import AddFileModal from './AddFileModal';
import { backend_url } from "../../Constants";

function LectureTable({lecture, code, searchFiles, renderLectures}) {
  const isAdmin = localStorage.getItem("staff");
  const buttonIcon = useBreakpointValue({ base: <AddIcon />, md: null });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isLectureFiles = (lecture) => {
    if (lecture) if (lecture.lecture_files) return true
    return false;
  }
    
  const isSearchFiles = (searchFiles) => {
    if (searchFiles) return true
    return false;
  }

  // Upload Lecture File
  const handleFileUpload = (formData) => {
    fetch(`${backend_url}lecture/file/${lecture.id}`, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    }).then(renderLectures);
  };

  // Delete file
  const handleFileDelete = (target) => {
    fetch(`${backend_url}lecture/file/${target}`, {
    method: "DELETE",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    }).then(renderLectures);
  };

  return (
    <Flex align-items="center" text-align="center"> 
      <AccordionItem width="88%" text-align="left" padding="1%">
        {
          (isLectureFiles(lecture) && lecture.lecture_files.length) ? lecture.lecture_files.map( file => (
            <Flex alignItems="center"> 
              <Box>
                <Link href={file.file} key={file.id} download>
                  {file.name}
                </Link>
              </Box>
              { isAdmin == 1 ? 
                <Box marginLeft="auto"> 
                  <IconButton 
                  onClick={() => handleFileDelete(file.id)}
                  cursor="pointer"
                  backgroundColor="white"
                  color="red"
                  size="sm" 
                  icon={<DeleteIcon />}/>
                </Box> : <></>
              }
            </Flex>
          )) : <></>
        }
        {
          isSearchFiles(searchFiles) && searchFiles.map( file => (
            <>
              <Link href={file.file} key={file.id} download>
                {file.name} <DownloadIcon cursor="pointer"/>
              </Link>
              <br/>
            </>
          ))
        }
        {
          (!isSearchFiles(searchFiles) && isAdmin == 1) && 
          <Center width={{ base: '100%', lg: '100%' }} padding="1%">
            <Button 
            onClick={onOpen} 
            leftIcon={buttonIcon} 
            pr={{ base: '8px', md: '16px'}} 
            width="100%" 
            backgroundColor="white" 
            fontSize="medium" 
            marginTop="1%"
            > 
              Add File 
            </Button>
            <AddFileModal 
            lectureId={lecture.id}
            isOpen={isOpen} 
            onClose={onClose} 
            isLectures 
            onSubmit={handleFileUpload} 
            code={code} /> 
          </Center>
        }
      </AccordionItem>
    </Flex>
  )
}

export default LectureTable;